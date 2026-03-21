import { create } from 'zustand';
import api from '@/lib/axios';

export interface Company {
  _id: string;
  name: string;
  slug: string;
  logo: string;
  website: string;
  description: string;
  industry: string;
  size: string;
  founded: string;
  headquarters: string;
}

interface CompanyState {
  company: Company | null;
  isLoading: boolean;
  error: string | null;
  fetchCompany: () => Promise<void>;
  createCompany: (data: Partial<Company>) => Promise<boolean>;
  updateCompany: (data: Partial<Company>) => Promise<boolean>;
  clearError: () => void;
}

export const useCompanyStore = create<CompanyState>((set) => ({
  company: null,
  isLoading: false,
  error: null,

  fetchCompany: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get('/api/v1/company');
      set({ company: response.data.data, isLoading: false });
    } catch (error: any) {
      if (error.response?.status !== 404) {
        set({ error: error.response?.data?.error || 'Failed to fetch company', isLoading: false });
      } else {
        set({ isLoading: false });
      }
    }
  },

  createCompany: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.post('/api/v1/company', data);
      set({ company: response.data.data, isLoading: false });
      return true;
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Failed to create company', isLoading: false });
      return false;
    }
  },

  updateCompany: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.put('/api/v1/company', data);
      set({ company: response.data.data, isLoading: false });
      return true;
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Failed to update company', isLoading: false });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));
