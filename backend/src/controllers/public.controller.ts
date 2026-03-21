import { Request, Response } from 'express';
import { Company } from '../models/Company';
import { CareerPage } from '../models/CareerPage';
import { Section } from '../models/Section';
import { Theme } from '../models/Theme';
import { Job, IJob } from '../models/Job';
import { Analytics } from '../models/Analytics';
import { JobFilterQuery, PaginatedResponse } from '../types';

export const getPublicCareersPage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    const company = await Company.findOne({ slug }).select('-createdBy');
    if (!company) {
      res.status(404).json({ success: false, error: 'Company not found' });
      return;
    }

    const careerPage = await CareerPage.findOne({ companyId: company._id });
    if (!careerPage || !careerPage.isPublished) {
      res.status(404).json({ success: false, error: 'Page not published' });
      return;
    }

    const [sections, theme, jobCount] = await Promise.all([
      Section.find({ careerPageId: careerPage._id, isVisible: true }).sort({ order: 1 }),
      Theme.findById(careerPage.themeId),
      Job.countDocuments({ companyId: company._id, isActive: true }),
    ]);

    // Track page view
    await Analytics.create({
      companyId: company._id,
      event: 'page_view',
      metadata: { userAgent: req.headers['user-agent'], referer: req.headers.referer },
    });

    res.json({
      success: true,
      data: {
        company,
        careerPage,
        sections,
        theme,
        jobCount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to load careers page' });
  }
};

export const getPublicJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const query = req.query as JobFilterQuery;

    const company = await Company.findOne({ slug });
    if (!company) {
      res.status(404).json({ success: false, error: 'Company not found' });
      return;
    }

    const page = parseInt(query.page || '1');
    const perPage = parseInt(query.per_page || '10');
    const skip = (page - 1) * perPage;

    // Build filter
    const filter: Record<string, unknown> = {
      companyId: company._id,
      isActive: true,
    };

    if (query.search) {
      filter.$or = [
        { title: { $regex: query.search, $options: 'i' } },
        { description: { $regex: query.search, $options: 'i' } },
      ];
    }
    if (query.department) filter.department = query.department;
    if (query.workPolicy) filter.workPolicy = query.workPolicy;
    if (query.employmentType) filter.employmentType = query.employmentType;
    if (query.experienceLevel) filter.experienceLevel = query.experienceLevel;
    if (query.jobType) filter.jobType = query.jobType;
    if (query.location) filter.location = { $regex: query.location, $options: 'i' };

    const [jobs, total] = await Promise.all([
      Job.find(filter).sort({ postedAt: -1 }).skip(skip).limit(perPage),
      Job.countDocuments(filter),
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

export const trackAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const { event, jobId, metadata } = req.body;

    const company = await Company.findOne({ slug });
    if (!company) {
      res.status(404).json({ success: false, error: 'Company not found' });
      return;
    }

    await Analytics.create({
      companyId: company._id,
      event,
      jobId: jobId || undefined,
      metadata: metadata || {},
    });

    res.json({ success: true, message: 'Event tracked' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to track event' });
  }
};
