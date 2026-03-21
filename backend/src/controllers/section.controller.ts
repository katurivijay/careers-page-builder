import { Response } from 'express';
import { AuthRequest } from '../types';
import { Section, SECTION_TYPES } from '../models/Section';
import { CareerPage } from '../models/CareerPage';
import { Company } from '../models/Company';

const getCompanyAndPage = async (userId: string) => {
  const company = await Company.findOne({ createdBy: userId });
  if (!company) throw new Error('Company not found');
  const careerPage = await CareerPage.findOne({ companyId: company._id });
  if (!careerPage) throw new Error('Career page not found');
  return { company, careerPage };
};

export const getSections = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { company, careerPage } = await getCompanyAndPage(req.user!.id);
    const sections = await Section.find({ careerPageId: careerPage._id })
      .sort({ order: 1 });
    res.json({ success: true, data: sections });
  } catch (error: any) {
    res.status(error.message?.includes('not found') ? 404 : 500)
      .json({ success: false, error: error.message || 'Failed to fetch sections' });
  }
};

export const createSection = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { company, careerPage } = await getCompanyAndPage(req.user!.id);
    const { type, content } = req.body;

    // Get next order number
    const maxOrder = await Section.findOne({ careerPageId: careerPage._id })
      .sort({ order: -1 })
      .select('order');
    const order = (maxOrder?.order || 0) + 1;

    const section = await Section.create({
      careerPageId: careerPage._id,
      companyId: company._id,
      type,
      content: content || getDefaultContent(type),
      order,
      isVisible: true,
    });

    res.status(201).json({ success: true, data: section });
  } catch (error: any) {
    res.status(error.message?.includes('not found') ? 404 : 500)
      .json({ success: false, error: error.message || 'Failed to create section' });
  }
};

export const updateSection = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const company = await Company.findOne({ createdBy: userId });

    const section = await Section.findOneAndUpdate(
      { _id: id, companyId: company?._id },
      req.body,
      { new: true }
    );

    if (!section) {
      res.status(404).json({ success: false, error: 'Section not found' });
      return;
    }

    res.json({ success: true, data: section });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update section' });
  }
};

export const deleteSection = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const company = await Company.findOne({ createdBy: userId });

    const section = await Section.findOneAndDelete({ _id: id, companyId: company?._id });
    if (!section) {
      res.status(404).json({ success: false, error: 'Section not found' });
      return;
    }

    // Reorder remaining sections
    await Section.updateMany(
      { careerPageId: section.careerPageId, order: { $gt: section.order } },
      { $inc: { order: -1 } }
    );

    res.json({ success: true, message: 'Section deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete section' });
  }
};

export const reorderSections = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { company, careerPage } = await getCompanyAndPage(req.user!.id);
    const { sectionIds } = req.body; // array of section IDs in new order

    if (!Array.isArray(sectionIds)) {
      res.status(400).json({ success: false, error: 'sectionIds must be an array' });
      return;
    }

    const bulkOps = sectionIds.map((id: string, index: number) => ({
      updateOne: {
        filter: { _id: id, companyId: company._id },
        update: { order: index + 1 },
      },
    }));

    await Section.bulkWrite(bulkOps);

    const sections = await Section.find({ careerPageId: careerPage._id }).sort({ order: 1 });
    res.json({ success: true, data: sections });
  } catch (error: any) {
    res.status(error.message?.includes('not found') ? 404 : 500)
      .json({ success: false, error: error.message || 'Failed to reorder sections' });
  }
};

function getDefaultContent(type: string): Record<string, unknown> {
  switch (type) {
    case 'hero':
      return {
        title: 'Join Our Team',
        subtitle: 'Build the future with us',
        description: 'We are looking for talented people to help us make a difference.',
        backgroundImage: '',
        ctaText: 'View Open Positions',
        ctaLink: '#jobs',
      };
    case 'about':
      return {
        title: 'About Us',
        description: 'Tell your company story here...',
      };
    case 'culture':
      return {
        title: 'Our Culture',
        description: 'What makes us unique...',
        videoUrl: '',
        images: [],
      };
    case 'benefits':
      return {
        title: 'Benefits & Perks',
        benefits: [
          { icon: '🏥', title: 'Health Insurance', description: 'Comprehensive coverage for you and your family' },
          { icon: '🏖️', title: 'Flexible PTO', description: 'Take time when you need it' },
          { icon: '🏠', title: 'Remote Work', description: 'Work from anywhere' },
          { icon: '📚', title: 'Learning Budget', description: 'Grow your skills with us' },
        ],
      };
    case 'jobs':
      return {
        title: 'Open Positions',
        description: 'Find your next role',
      };
    case 'custom':
      return {
        title: 'Custom Section',
        richText: '<p>Add your custom content here...</p>',
      };
    default:
      return {};
  }
}
