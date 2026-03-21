import { create } from 'zustand';
import api from '@/lib/axios';

export interface Theme {
  _id: string;
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
}

export interface Preset {
  id: string;
  name: string;
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
}

interface ThemeState {
  theme: Theme | null;
  presets: Preset[];
  isLoading: boolean;
  error: string | null;
  fetchTheme: () => Promise<void>;
  fetchPresets: () => Promise<void>;
  updateTheme: (updates: Partial<Theme>) => Promise<boolean>;
  applyPreset: (presetId: string) => Promise<boolean>;
  clearError: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: null,
  presets: [],
  isLoading: false,
  error: null,

  fetchTheme: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get('/api/v1/theme');
      set({ theme: response.data.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Failed to fetch theme', isLoading: false });
    }
  },

  fetchPresets: async () => {
    try {
      const response = await api.get('/api/v1/theme/presets');
      set({ presets: response.data.data });
    } catch { /* ignore */ }
  },

  updateTheme: async (updates) => {
    try {
      set((state) => ({
        theme: state.theme ? { ...state.theme, ...updates } : null,
      }));
      set({ isLoading: true, error: null });
      const response = await api.put('/api/v1/theme', updates);
      set({ theme: response.data.data, isLoading: false });
      return true;
    } catch (error: any) {
      await get().fetchTheme();
      set({ error: error.response?.data?.error || 'Failed to update theme', isLoading: false });
      return false;
    }
  },

  applyPreset: async (presetId) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.put('/api/v1/theme', { preset: presetId });
      set({ theme: response.data.data, isLoading: false });
      return true;
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Failed to apply preset', isLoading: false });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));
