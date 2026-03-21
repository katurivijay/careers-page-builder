import mongoose, { Document, Schema } from 'mongoose';

export interface ITheme extends Document {
  _id: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
  name: string;
  preset: 'startup' | 'corporate' | 'playful' | 'custom';
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bgColor: string;
  surfaceColor: string;
  textColor: string;
  textMutedColor: string;
  fontHeading: string;
  fontBody: string;
  borderRadius: string;
  bannerUrl: string;
  cultureVideoUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const themeSchema = new Schema<ITheme>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    name: {
      type: String,
      default: 'Default Theme',
    },
    preset: {
      type: String,
      enum: ['startup', 'corporate', 'playful', 'custom'],
      default: 'startup',
    },
    primaryColor: { type: String, default: '#4F46E5' },
    secondaryColor: { type: String, default: '#7C3AED' },
    accentColor: { type: String, default: '#EC4899' },
    bgColor: { type: String, default: '#0A0A0F' },
    surfaceColor: { type: String, default: '#12121A' },
    textColor: { type: String, default: '#F1F5F9' },
    textMutedColor: { type: String, default: '#94A3B8' },
    fontHeading: { type: String, default: 'Inter' },
    fontBody: { type: String, default: 'Inter' },
    borderRadius: { type: String, default: '0.75rem' },
    bannerUrl: { type: String, default: '' },
    cultureVideoUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

themeSchema.index({ companyId: 1 });

export const Theme = mongoose.model<ITheme>('Theme', themeSchema);
