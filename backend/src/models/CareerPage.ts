import mongoose, { Document, Schema } from 'mongoose';

export interface ICareerPage extends Document {
  _id: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
  themeId: mongoose.Types.ObjectId;
  isPublished: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const careerPageSchema = new Schema<ICareerPage>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      unique: true,
    },
    themeId: {
      type: Schema.Types.ObjectId,
      ref: 'Theme',
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export const CareerPage = mongoose.model<ICareerPage>('CareerPage', careerPageSchema);
