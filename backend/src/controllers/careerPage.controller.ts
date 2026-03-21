import { Response } from 'express';
import { AuthRequest } from '../types';
import { CareerPage } from '../models/CareerPage';
import { Company } from '../models/Company';

export const getCareerPage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const company = await Company.findOne({ createdBy: userId });
    if (!company) {
      res.status(404).json({ success: false, error: 'Company not found' });
      return;
    }

    const careerPage = await CareerPage.findOne({ companyId: company._id })
      .populate('themeId');

    if (!careerPage) {
      res.status(404).json({ success: false, error: 'Career page not found' });
      return;
    }

    res.json({ success: true, data: careerPage });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch career page' });
  }
};

export const updateCareerPage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const company = await Company.findOne({ createdBy: userId });
    if (!company) {
      res.status(404).json({ success: false, error: 'Company not found' });
      return;
    }

    const updates = req.body;

    const careerPage = await CareerPage.findOneAndUpdate(
      { companyId: company._id },
      updates,
      { new: true }
    ).populate('themeId');

    if (!careerPage) {
      res.status(404).json({ success: false, error: 'Career page not found' });
      return;
    }

    res.json({ success: true, data: careerPage });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update career page' });
  }
};

export const publishCareerPage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const company = await Company.findOne({ createdBy: userId });
    if (!company) {
      res.status(404).json({ success: false, error: 'Company not found' });
      return;
    }

    const careerPage = await CareerPage.findOneAndUpdate(
      { companyId: company._id },
      { isPublished: true, publishedAt: new Date() },
      { new: true }
    );

    if (!careerPage) {
      res.status(404).json({ success: false, error: 'Career page not found' });
      return;
    }

    res.json({ success: true, data: careerPage, message: 'Career page published!' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to publish career page' });
  }
};

export const unpublishCareerPage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const company = await Company.findOne({ createdBy: userId });
    if (!company) {
      res.status(404).json({ success: false, error: 'Company not found' });
      return;
    }

    const careerPage = await CareerPage.findOneAndUpdate(
      { companyId: company._id },
      { isPublished: false },
      { new: true }
    );

    if (!careerPage) {
      res.status(404).json({ success: false, error: 'Career page not found' });
      return;
    }

    res.json({ success: true, data: careerPage, message: 'Career page unpublished' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to unpublish career page' });
  }
};
