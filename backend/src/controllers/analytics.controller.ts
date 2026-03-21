import { Response } from 'express';
import { AuthRequest } from '../types';
import { Analytics } from '../models/Analytics';
import { Company } from '../models/Company';
import { Job } from '../models/Job';

export const getAnalyticsSummary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const company = await Company.findOne({ createdBy: userId });
    if (!company) {
      res.status(404).json({ success: false, error: 'Company not found' });
      return;
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalViews,
      totalJobClicks,
      totalApplyClicks,
      last30DaysViews,
      last7DaysViews,
      activeJobsCount,
      dailyViews,
    ] = await Promise.all([
      Analytics.countDocuments({ companyId: company._id, event: 'page_view' }),
      Analytics.countDocuments({ companyId: company._id, event: 'job_click' }),
      Analytics.countDocuments({ companyId: company._id, event: 'apply_click' }),
      Analytics.countDocuments({
        companyId: company._id,
        event: 'page_view',
        timestamp: { $gte: thirtyDaysAgo },
      }),
      Analytics.countDocuments({
        companyId: company._id,
        event: 'page_view',
        timestamp: { $gte: sevenDaysAgo },
      }),
      Job.countDocuments({ companyId: company._id, isActive: true }),
      // Daily views for last 30 days
      Analytics.aggregate([
        {
          $match: {
            companyId: company._id,
            event: 'page_view',
            timestamp: { $gte: thirtyDaysAgo },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$timestamp' },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    // Top clicked jobs
    const topJobs = await Analytics.aggregate([
      {
        $match: {
          companyId: company._id,
          event: 'job_click',
          jobId: { $exists: true },
        },
      },
      {
        $group: {
          _id: '$jobId',
          clicks: { $sum: 1 },
        },
      },
      { $sort: { clicks: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'jobs',
          localField: '_id',
          foreignField: '_id',
          as: 'job',
        },
      },
      { $unwind: '$job' },
      {
        $project: {
          _id: 1,
          clicks: 1,
          title: '$job.title',
          department: '$job.department',
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalViews,
          totalJobClicks,
          totalApplyClicks,
          last30DaysViews,
          last7DaysViews,
          activeJobsCount,
        },
        dailyViews,
        topJobs,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch analytics' });
  }
};
