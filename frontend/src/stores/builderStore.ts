import { create } from 'zustand';
import api from '@/lib/axios';

export interface SectionContent {
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

export interface Section {
  _id: string;
  careerPageId: string;
  companyId: string;
  type: 'hero' | 'about' | 'culture' | 'benefits' | 'jobs' | 'custom';
  content: SectionContent;
  order: number;
  isVisible: boolean;
}

interface BuilderState {
  sections: Section[];
  isLoading: boolean;
  error: string | null;
  activeSectionId: string | null;
  isPublished: boolean;
  fetchSections: () => Promise<void>;
  createSection: (type: Section['type']) => Promise<void>;
  updateSection: (id: string, updates: Partial<Section>) => Promise<void>;
  deleteSection: (id: string) => Promise<void>;
  reorderSections: (newOrderIds: string[]) => Promise<void>;
  setActiveSection: (id: string | null) => void;
  fetchPublishStatus: () => Promise<void>;
  publishPage: () => Promise<boolean>;
  unpublishPage: () => Promise<boolean>;
  clearError: () => void;
}

export const useBuilderStore = create<BuilderState>((set, get) => ({
  sections: [],
  isLoading: false,
  error: null,
  activeSectionId: null,
  isPublished: false,

  fetchSections: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get('/api/v1/sections');
      set({ sections: response.data.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Failed to fetch sections', isLoading: false });
    }
  },

  createSection: async (type) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.post('/api/v1/sections', { type });
      await get().fetchSections();
      set({ activeSectionId: response.data.data._id, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Failed to create section', isLoading: false });
    }
  },

  updateSection: async (id, updates) => {
    try {
      set((state) => ({
        sections: state.sections.map((s) => (s._id === id ? { ...s, ...updates } : s)),
        error: null,
      }));
      await api.put(`/api/v1/sections/${id}`, updates);
    } catch (error: any) {
      await get().fetchSections();
      set({ error: error.response?.data?.error || 'Failed to update section' });
    }
  },

  deleteSection: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await api.delete(`/api/v1/sections/${id}`);
      if (get().activeSectionId === id) set({ activeSectionId: null });
      await get().fetchSections();
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Failed to delete section', isLoading: false });
    }
  },

  reorderSections: async (newOrderIds) => {
    try {
      set((state) => {
        const newSections = [...state.sections].sort(
          (a, b) => newOrderIds.indexOf(a._id) - newOrderIds.indexOf(b._id)
        );
        return { sections: newSections, error: null };
      });
      await api.put('/api/v1/sections/reorder', { sectionIds: newOrderIds });
    } catch (error: any) {
      await get().fetchSections();
      set({ error: error.response?.data?.error || 'Failed to reorder sections' });
    }
  },

  setActiveSection: (id) => set({ activeSectionId: id }),

  fetchPublishStatus: async () => {
    try {
      const response = await api.get('/api/v1/career-page');
      set({ isPublished: response.data.data.isPublished });
    } catch { /* ignore */ }
  },

  publishPage: async () => {
    try {
      set({ isLoading: true, error: null });
      await api.post('/api/v1/career-page/publish');
      set({ isPublished: true, isLoading: false });
      return true;
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Failed to publish page', isLoading: false });
      return false;
    }
  },

  unpublishPage: async () => {
    try {
      set({ isLoading: true, error: null });
      await api.post('/api/v1/career-page/unpublish');
      set({ isPublished: false, isLoading: false });
      return true;
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Failed to unpublish page', isLoading: false });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));
