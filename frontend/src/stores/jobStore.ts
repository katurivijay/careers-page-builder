import { create } from 'zustand';
import api from '@/lib/axios';

export interface Job {
  _id: string;
  companyId: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  workPolicy: 'remote' | 'hybrid' | 'onsite';
  employmentType: 'full-time' | 'part-time' | 'contract';
  experienceLevel: 'junior' | 'mid-level' | 'senior' | 'lead';
  jobType: 'permanent' | 'temporary' | 'internship';
  salaryRange: string;
  description: string;
  isActive: boolean;
  postedAt: string;
}

export interface PaginationData {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface JobState {
  jobs: Job[];
  pagination: PaginationData | null;
  isLoading: boolean;
  error: string | null;
  fetchJobs: (page?: number, perPage?: number) => Promise<void>;
  createJob: (data: Partial<Job>) => Promise<boolean>;
  updateJob: (id: string, data: Partial<Job>) => Promise<boolean>;
  deleteJob: (id: string) => Promise<boolean>;
  clearError: () => void;
}

export const useJobStore = create<JobState>((set, get) => ({
  jobs: [],
  pagination: null,
  isLoading: false,
  error: null,

  fetchJobs: async (page = 1, perPage = 10) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get(`/api/v1/jobs?page=${page}&per_page=${perPage}`);
      set({ jobs: response.data.data, pagination: response.data.pagination, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Failed to fetch jobs', isLoading: false });
    }
  },

  createJob: async (data) => {
    try {
      set({ isLoading: true, error: null });
      await api.post('/api/v1/jobs', data);
      await get().fetchJobs();
      return true;
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Failed to create job', isLoading: false });
      return false;
    }
  },

  updateJob: async (id, data) => {
    try {
      set({ isLoading: true, error: null });
      await api.put(`/api/v1/jobs/${id}`, data);
      await get().fetchJobs(get().pagination?.page || 1);
      return true;
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Failed to update job', isLoading: false });
      return false;
    }
  },

  deleteJob: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await api.delete(`/api/v1/jobs/${id}`);
      await get().fetchJobs(get().pagination?.page || 1);
      return true;
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Failed to delete job', isLoading: false });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));
