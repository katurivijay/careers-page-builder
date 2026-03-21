import { useBuilderStore } from '@/stores/builderStore';
import { useThemeStore } from '@/stores/themeStore';
import { useCompanyStore } from '@/stores/companyStore';
import SectionRenderer from '@/components/builder/SectionRenderer';

export default function LivePreview() {
  const { sections } = useBuilderStore();
  const { theme } = useThemeStore();
  const { company } = useCompanyStore();

  const visibleSections = sections.filter((s) => s.isVisible);

  // Build CSS custom properties from the theme for dynamic styling
  const themeStyle: React.CSSProperties = theme
    ? ({
        '--theme-primary': theme.primaryColor,
        '--theme-secondary': theme.secondaryColor,
        '--theme-accent': theme.accentColor,
        '--theme-bg': theme.bgColor,
        '--theme-surface': theme.surfaceColor,
        '--theme-text': theme.textColor,
        '--theme-text-muted': theme.textMutedColor,
        '--theme-radius': theme.borderRadius,
        fontFamily: `"${theme.fontBody}", sans-serif`,
        backgroundColor: theme.bgColor,
        color: theme.textColor,
      } as React.CSSProperties)
    : {};

  return (
    <div className="min-h-full" style={themeStyle}>
      <div className="text-center py-3 text-xs font-medium opacity-50 border-b" style={{ borderColor: `${theme?.textMutedColor || '#666'}33` }}>
        ✨ Live Preview — {company?.name || 'Your Company'}
      </div>

      {visibleSections.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 opacity-40">
          <p className="text-lg font-medium">No visible sections</p>
          <p className="text-sm mt-1">Add sections from the left panel to see your careers page.</p>
        </div>
      ) : (
        visibleSections.map((section) => (
          <SectionRenderer key={section._id} section={section} theme={theme} company={company} isPreview />
        ))
      )}
    </div>
  );
}
