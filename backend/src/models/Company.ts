import mongoose, { Document, Schema } from 'mongoose';

export interface ICompany extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  logo: string;
  website: string;
  description: string;
  industry: string;
  size: string;
  founded: string;
  headquarters: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const companySchema = new Schema<ICompany>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    logo: {
      type: String,
      default: '',
    },
    website: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    industry: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: '',
    },
    founded: {
      type: String,
      default: '',
    },
    headquarters: {
      type: String,
      default: '',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

companySchema.index({ createdBy: 1 });

export const Company = mongoose.model<ICompany>('Company', companySchema);
