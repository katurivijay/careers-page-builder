import { Request } from 'express';
import mongoose from 'mongoose';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    companyId?: string;
  };
}

export interface PaginationQuery {
  page?: string;
  per_page?: string;
}

export interface JobFilterQuery extends PaginationQuery {
  search?: string;
  department?: string;
  workPolicy?: string;
  employmentType?: string;
  experienceLevel?: string;
  jobType?: string;
  location?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
