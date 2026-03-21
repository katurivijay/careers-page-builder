import mongoose, { Document, Schema } from 'mongoose';

export const WORK_POLICIES = ['remote', 'hybrid', 'onsite'] as const;
export const EMPLOYMENT_TYPES = ['full-time', 'part-time', 'contract'] as const;
export const EXPERIENCE_LEVELS = ['junior', 'mid-level', 'senior', 'lead'] as const;
export const JOB_TYPES = ['permanent', 'temporary', 'internship'] as const;
export const DEPARTMENTS = [
  'Engineering',
  'Product',
  'Design',
  'Marketing',
  'Sales',
  'Operations',
  'HR',
  'Finance',
  'Legal',
  'Customer Support',
  'Customer Success',
  'Data',
  'Analytics',
  'R&D',
  'IT Support',
  'Other',
] as const;

export type WorkPolicy = (typeof WORK_POLICIES)[number];
export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number];
export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number];
export type JobType = (typeof JOB_TYPES)[number];
export type Department = (typeof DEPARTMENTS)[number];

export interface IJob extends Document {
  _id: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  department: Department;
  location: string;
  workPolicy: WorkPolicy;
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel;
  jobType: JobType;
  salaryRange: string;
  description: string;
  isActive: boolean;
  postedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema<IJob>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      enum: DEPARTMENTS,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    workPolicy: {
      type: String,
      enum: WORK_POLICIES,
      required: true,
    },
    employmentType: {
      type: String,
      enum: EMPLOYMENT_TYPES,
      required: true,
    },
    experienceLevel: {
      type: String,
      enum: EXPERIENCE_LEVELS,
      required: true,
    },
    jobType: {
      type: String,
      enum: JOB_TYPES,
      required: true,
    },
    salaryRange: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    postedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

jobSchema.index({ companyId: 1, isActive: 1 });
jobSchema.index({ companyId: 1, slug: 1 }, { unique: true });
jobSchema.index({ title: 'text', description: 'text' });

export const Job = mongoose.model<IJob>('Job', jobSchema);
