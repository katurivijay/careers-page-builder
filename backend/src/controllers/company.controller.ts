import { Response } from 'express';
import slugify from 'slugify';
import { AuthRequest } from '../types';
import { Company } from '../models/Company';
import { User } from '../models/User';
import { CareerPage } from '../models/CareerPage';
import { Theme } from '../models/Theme';

export const createCompany = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, website, description, industry, size, founded, headquarters } = req.body;
    const userId = req.user!.id;

    // Check if user already has a company
    const existing = await Company.findOne({ createdBy: userId });
    if (existing) {
      res.status(400).json({ success: false, error: 'You already have a company' });
      return;
    }

    let slug = slugify(name, { lower: true, strict: true });
    // Ensure unique slug
    const existingSlug = await Company.findOne({ slug });
    if (existingSlug) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const company = await Company.create({
      name,
      slug,
      website: website || '',
      description: description || '',
      industry: industry || '',
      size: size || '',
      founded: founded || '',
      headquarters: headquarters || '',
      createdBy: userId,
    });

    // Update user with companyId
    await User.findByIdAndUpdate(userId, { companyId: company._id });

    // Create default theme
    const theme = await Theme.create({
      companyId: company._id,
      name: 'Default Theme',
      preset: 'startup',
    });

    // Create career page
    await CareerPage.create({
      companyId: company._id,
      themeId: theme._id,
      isPublished: false,
    });

    res.status(201).json({ success: true, data: company });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create company' });
  }
};

export const getCompany = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const company = await Company.findOne({ createdBy: userId });
    if (!company) {
      res.status(404).json({ success: false, error: 'Company not found' });
      return;
    }
    res.json({ success: true, data: company });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch company' });
  }
};

export const updateCompany = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const updates = req.body;

    // If name changed, regenerate slug
    if (updates.name) {
      let slug = slugify(updates.name, { lower: true, strict: true });
      const existingSlug = await Company.findOne({ slug, createdBy: { $ne: userId } });
      if (existingSlug) {
        slug = `${slug}-${Date.now().toString(36)}`;
      }
      updates.slug = slug;
    }

    const company = await Company.findOneAndUpdate(
      { createdBy: userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!company) {
      res.status(404).json({ success: false, error: 'Company not found' });
      return;
    }

    res.json({ success: true, data: company });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update company' });
  }
};
