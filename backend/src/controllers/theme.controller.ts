import { Response } from 'express';
import { AuthRequest } from '../types';
import { Theme } from '../models/Theme';
import { Company } from '../models/Company';
import { CareerPage } from '../models/CareerPage';

const THEME_PRESETS = {
  startup: {
    primaryColor: '#6366F1',
    secondaryColor: '#8B5CF6',
    accentColor: '#EC4899',
    bgColor: '#0A0A0F',
    surfaceColor: '#12121A',
    textColor: '#F1F5F9',
    textMutedColor: '#94A3B8',
    fontHeading: 'Inter',
    fontBody: 'Inter',
    borderRadius: '0.75rem',
  },
  corporate: {
    primaryColor: '#1E40AF',
    secondaryColor: '#1D4ED8',
    accentColor: '#0891B2',
    bgColor: '#FFFFFF',
    surfaceColor: '#F8FAFC',
    textColor: '#0F172A',
    textMutedColor: '#64748B',
    fontHeading: 'Georgia',
    fontBody: 'Arial',
    borderRadius: '0.375rem',
  },
  playful: {
    primaryColor: '#E11D48',
    secondaryColor: '#F97316',
    accentColor: '#FACC15',
    bgColor: '#FFFBEB',
    surfaceColor: '#FEF3C7',
    textColor: '#1C1917',
    textMutedColor: '#78716C',
    fontHeading: 'Outfit',
    fontBody: 'Inter',
    borderRadius: '1rem',
  },
};

export const getTheme = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const company = await Company.findOne({ createdBy: userId });
    if (!company) {
      res.status(404).json({ success: false, error: 'Company not found' });
      return;
    }

    let theme = await Theme.findOne({ companyId: company._id });
    if (!theme) {
      theme = await Theme.create({
        companyId: company._id,
        name: 'Default Theme',
        preset: 'startup',
        ...THEME_PRESETS.startup,
      });
    }

    res.json({ success: true, data: theme });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch theme' });
  }
};

export const updateTheme = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const company = await Company.findOne({ createdBy: userId });
    if (!company) {
      res.status(404).json({ success: false, error: 'Company not found' });
      return;
    }

    const updates = req.body;

    // If switching to a preset, apply preset defaults
    if (updates.preset && updates.preset !== 'custom' && THEME_PRESETS[updates.preset as keyof typeof THEME_PRESETS]) {
      Object.assign(updates, THEME_PRESETS[updates.preset as keyof typeof THEME_PRESETS]);
    }

    const theme = await Theme.findOneAndUpdate(
      { companyId: company._id },
      updates,
      { new: true, upsert: true }
    );

    res.json({ success: true, data: theme });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update theme' });
  }
};

export const getPresets = async (_req: AuthRequest, res: Response): Promise<void> => {
  res.json({
    success: true,
    data: Object.entries(THEME_PRESETS).map(([key, value]) => ({
      id: key,
      name: key.charAt(0).toUpperCase() + key.slice(1),
      ...value,
    })),
  });
};
