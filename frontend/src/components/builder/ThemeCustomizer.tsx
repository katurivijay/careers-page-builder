import { useThemeStore } from '@/stores/themeStore';
import { useEffect } from 'react';
import { Input, Label, Button } from '@/components/ui';
import { Loader2, Palette } from 'lucide-react';

export default function ThemeCustomizer() {
  const { theme, presets, isLoading, fetchTheme, fetchPresets, updateTheme, applyPreset } = useThemeStore();

  useEffect(() => {
    fetchTheme();
    fetchPresets();
  }, [fetchTheme, fetchPresets]);

  if (!theme) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const handleColorChange = (field: string, value: string) => {
    updateTheme({ [field]: value, preset: 'custom' as const });
  };

  const colorFields = [
    { key: 'primaryColor', label: 'Primary' },
    { key: 'secondaryColor', label: 'Secondary' },
    { key: 'accentColor', label: 'Accent' },
    { key: 'bgColor', label: 'Background' },
    { key: 'surfaceColor', label: 'Surface' },
    { key: 'textColor', label: 'Text' },
    { key: 'textMutedColor', label: 'Muted Text' },
  ];

  return (
    <div className="p-4 space-y-6">
      <div>
        <h3 className="text-sm font-semibold mb-1 flex items-center gap-2">
          <Palette className="w-4 h-4" /> Theme Settings
        </h3>
        <p className="text-xs text-muted-foreground">Customize your careers page look and feel.</p>
      </div>

      {/* Presets */}
      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Quick Presets</Label>
        <div className="grid grid-cols-3 gap-2">
          {presets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset.id)}
              className={`p-3 rounded-lg border text-xs font-medium transition-all ${
                theme.preset === preset.id
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border/50 hover:border-primary/30'
              }`}
            >
              <div className="flex gap-1 mb-2 justify-center">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.primaryColor }} />
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.secondaryColor }} />
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.accentColor }} />
              </div>
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div className="space-y-3">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Colors</Label>
        {colorFields.map(({ key, label }) => (
          <div key={key} className="flex items-center gap-3">
            <input
              type="color"
              value={(theme as any)[key] || '#000000'}
              onChange={(e) => handleColorChange(key, e.target.value)}
              className="w-8 h-8 rounded-md border border-border cursor-pointer bg-transparent"
            />
            <div className="flex-1">
              <p className="text-xs font-medium">{label}</p>
              <p className="text-xs text-muted-foreground">{(theme as any)[key]}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Typography */}
      <div className="space-y-3">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Typography</Label>
        <div className="space-y-2">
          <div className="space-y-1">
            <Label className="text-xs">Heading Font</Label>
            <select
              value={theme.fontHeading}
              onChange={(e) => updateTheme({ fontHeading: e.target.value })}
              className="flex h-8 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {['Inter', 'Georgia', 'Outfit', 'Poppins', 'Roboto', 'Playfair Display'].map((f) => (
                <option key={f} value={f} className="bg-card">{f}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Body Font</Label>
            <select
              value={theme.fontBody}
              onChange={(e) => updateTheme({ fontBody: e.target.value })}
              className="flex h-8 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {['Inter', 'Arial', 'Roboto', 'Open Sans', 'Lato', 'Source Sans Pro'].map((f) => (
                <option key={f} value={f} className="bg-card">{f}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Media */}
      <div className="space-y-3">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Media</Label>
        <div className="space-y-1.5">
          <Label className="text-xs">Banner Image URL</Label>
          <Input
            value={theme.bannerUrl}
            onChange={(e) => updateTheme({ bannerUrl: e.target.value })}
            placeholder="https://..."
            className="h-8 text-xs"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Culture Video URL</Label>
          <Input
            value={theme.cultureVideoUrl}
            onChange={(e) => updateTheme({ cultureVideoUrl: e.target.value })}
            placeholder="https://youtube.com/..."
            className="h-8 text-xs"
          />
        </div>
      </div>

      {/* Border Radius */}
      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Border Radius</Label>
        <select
          value={theme.borderRadius}
          onChange={(e) => updateTheme({ borderRadius: e.target.value })}
          className="flex h-8 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="0" className="bg-card">None (0)</option>
          <option value="0.375rem" className="bg-card">Small (0.375rem)</option>
          <option value="0.5rem" className="bg-card">Medium (0.5rem)</option>
          <option value="0.75rem" className="bg-card">Large (0.75rem)</option>
          <option value="1rem" className="bg-card">XLarge (1rem)</option>
        </select>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="w-3 h-3 animate-spin" /> Saving...
        </div>
      )}
    </div>
  );
}
