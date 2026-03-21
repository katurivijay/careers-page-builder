import mongoose, { Document, Schema } from 'mongoose';

export const ANALYTICS_EVENTS = ['page_view', 'job_click', 'apply_click'] as const;
export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[number];

export interface IAnalytics extends Document {
  _id: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
  event: AnalyticsEvent;
  jobId?: mongoose.Types.ObjectId;
  metadata: Record<string, unknown>;
  timestamp: Date;
}

const analyticsSchema = new Schema<IAnalytics>({
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  event: {
    type: String,
    enum: ANALYTICS_EVENTS,
    required: true,
  },
  jobId: {
    type: Schema.Types.ObjectId,
    ref: 'Job',
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {},
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

analyticsSchema.index({ companyId: 1, event: 1, timestamp: -1 });

export const Analytics = mongoose.model<IAnalytics>('Analytics', analyticsSchema);
