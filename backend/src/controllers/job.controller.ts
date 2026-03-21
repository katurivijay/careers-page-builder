import { Response } from 'express';
import slugify from 'slugify';
import { AuthRequest, JobFilterQuery, PaginatedResponse } from '../types';
import { Job, IJob } from '../models/Job';
import { Company } from '../models/Company';

export const getJobs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const company = await Company.findOne({ createdBy: userId });
    if (!company) {
      res.status(404).json({ success: false, error: 'Company not found' });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const perPage = parseInt(req.query.per_page as string) || 10;
    const skip = (page - 1) * perPage;

    const [jobs, total] = await Promise.all([
      Job.find({ companyId: company._id }).sort({ createdAt: -1 }).skip(skip).limit(perPage),
      Job.countDocuments({ companyId: company._id }),
    ]);

    const response: PaginatedResponse<IJob> = {
      data: jobs,
      pagination: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
        hasNext: page < Math.ceil(total / perPage),
        hasPrev: page > 1,
      },
    };

    res.json({ success: true, ...response });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch jobs' });
  }
};

export const createJob = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const company = await Company.findOne({ createdBy: userId });
    if (!company) {
      res.status(404).json({ success: false, error: 'Company not found' });
      return;
    }

    const jobData = req.body;
    let slug = slugify(jobData.title, { lower: true, strict: true });

    // Ensure unique slug within company
    const existingSlug = await Job.findOne({ companyId: company._id, slug });
    if (existingSlug) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const job = await Job.create({
      ...jobData,
      companyId: company._id,
      slug,
      postedAt: new Date(),
    });

    res.status(201).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create job' });
  }
};

export const updateJob = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const company = await Company.findOne({ createdBy: userId });

    const updates = req.body;
    if (updates.title) {
      updates.slug = slugify(updates.title, { lower: true, strict: true });
    }

    const job = await Job.findOneAndUpdate(
      { _id: id, companyId: company?._id },
      updates,
      { new: true, runValidators: true }
    );

    if (!job) {
      res.status(404).json({ success: false, error: 'Job not found' });
      return;
    }

    res.json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update job' });
  }
};

export const deleteJob = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const company = await Company.findOne({ createdBy: userId });

    const job = await Job.findOneAndDelete({ _id: id, companyId: company?._id });
    if (!job) {
      res.status(404).json({ success: false, error: 'Job not found' });
      return;
    }

    res.json({ success: true, message: 'Job deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete job' });
  }
};

export const getJobById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const company = await Company.findOne({ createdBy: userId });

    const job = await Job.findOne({ _id: id, companyId: company?._id });
    if (!job) {
      res.status(404).json({ success: false, error: 'Job not found' });
      return;
    }

    res.json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch job' });
  }
};
