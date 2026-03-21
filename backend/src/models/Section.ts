import mongoose, { Document, Schema } from 'mongoose';

export const SECTION_TYPES = [
  'hero',
  'about',
  'culture',
  'benefits',
  'jobs',
  'custom',
] as const;

export type SectionType = (typeof SECTION_TYPES)[number];

export interface ISectionContent {
  title?: string;
  subtitle?: string;
  description?: string;
  backgroundImage?: string;
  ctaText?: string;
  ctaLink?: string;
  videoUrl?: string;
  images?: string[];
  benefits?: Array<{ icon: string; title: string; description: string }>;
  richText?: string;
  [key: string]: unknown;
}

export interface ISection extends Document {
  _id: mongoose.Types.ObjectId;
  careerPageId: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
  type: SectionType;
  content: ISectionContent;
  order: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const sectionSchema = new Schema<ISection>(
  {
    careerPageId: {
      type: Schema.Types.ObjectId,
      ref: 'CareerPage',
      required: true,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    type: {
      type: String,
      enum: SECTION_TYPES,
      required: true,
    },
    content: {
      type: Schema.Types.Mixed,
      default: {},
    },
    order: {
      type: Number,
      default: 0,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

sectionSchema.index({ careerPageId: 1, order: 1 });
sectionSchema.index({ companyId: 1 });

export const Section = mongoose.model<ISection>('Section', sectionSchema);
