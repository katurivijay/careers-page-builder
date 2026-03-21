import { useBuilderStore } from '@/stores/builderStore';
import { Input, Label } from '@/components/ui';

export default function SectionEditor() {
  const { sections, activeSectionId, updateSection } = useBuilderStore();
  const section = sections.find((s) => s._id === activeSectionId);

  if (!section) return null;

  const updateContent = (field: string, value: unknown) => {
    updateSection(section._id, {
      content: { ...section.content, [field]: value },
    });
  };

  const updateBenefit = (index: number, field: string, value: string) => {
    const benefits = [...(section.content.benefits || [])];
    benefits[index] = { ...benefits[index], [field]: value };
    updateContent('benefits', benefits);
  };

  const addBenefit = () => {
    const benefits = [...(section.content.benefits || [])];
    benefits.push({ icon: '⭐', title: 'New Benefit', description: 'Description...' });
    updateContent('benefits', benefits);
  };

  const removeBenefit = (index: number) => {
    const benefits = [...(section.content.benefits || [])];
    benefits.splice(index, 1);
    updateContent('benefits', benefits);
  };

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Edit {section.type} Section
      </h4>

      {/* Common: Title */}
      {section.type !== 'jobs' && (
        <div className="space-y-1.5">
          <Label className="text-xs">Title</Label>
          <Input
            value={section.content.title || ''}
            onChange={(e) => updateContent('title', e.target.value)}
            placeholder="Section title"
            className="h-8 text-sm"
          />
        </div>
      )}

      {/* Hero */}
      {section.type === 'hero' && (
        <>
          <div className="space-y-1.5">
            <Label className="text-xs">Subtitle</Label>
            <Input
              value={section.content.subtitle || ''}
              onChange={(e) => updateContent('subtitle', e.target.value)}
              placeholder="Catchy subtitle"
              className="h-8 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Description</Label>
            <textarea
              value={section.content.description || ''}
              onChange={(e) => updateContent('description', e.target.value)}
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              rows={3}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">CTA Text</Label>
            <Input
              value={section.content.ctaText || ''}
              onChange={(e) => updateContent('ctaText', e.target.value)}
              placeholder="View Open Positions"
              className="h-8 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Background Image URL</Label>
            <Input
              value={section.content.backgroundImage || ''}
              onChange={(e) => updateContent('backgroundImage', e.target.value)}
              placeholder="https://..."
              className="h-8 text-sm"
            />
          </div>
        </>
      )}

      {/* About */}
      {section.type === 'about' && (
        <div className="space-y-1.5">
          <Label className="text-xs">Description</Label>
          <textarea
            value={section.content.description || ''}
            onChange={(e) => updateContent('description', e.target.value)}
            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            rows={5}
          />
        </div>
      )}

      {/* Culture */}
      {section.type === 'culture' && (
        <>
          <div className="space-y-1.5">
            <Label className="text-xs">Description</Label>
            <textarea
              value={section.content.description || ''}
              onChange={(e) => updateContent('description', e.target.value)}
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              rows={3}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Culture Video URL</Label>
            <Input
              value={section.content.videoUrl || ''}
              onChange={(e) => updateContent('videoUrl', e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="h-8 text-sm"
            />
          </div>
        </>
      )}

      {/* Benefits */}
      {section.type === 'benefits' && (
        <div className="space-y-3">
          {(section.content.benefits || []).map((benefit: any, index: number) => (
            <div key={index} className="p-3 rounded-lg border border-border/50 bg-secondary/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Benefit #{index + 1}</span>
                <button onClick={() => removeBenefit(index)} className="text-xs text-destructive hover:underline">Remove</button>
              </div>
              <Input
                value={benefit.icon || ''}
                onChange={(e) => updateBenefit(index, 'icon', e.target.value)}
                placeholder="Emoji/Icon"
                className="h-7 text-xs"
              />
              <Input
                value={benefit.title || ''}
                onChange={(e) => updateBenefit(index, 'title', e.target.value)}
                placeholder="Benefit title"
                className="h-7 text-xs"
              />
              <Input
                value={benefit.description || ''}
                onChange={(e) => updateBenefit(index, 'description', e.target.value)}
                placeholder="Description"
                className="h-7 text-xs"
              />
            </div>
          ))}
          <button onClick={addBenefit} className="w-full py-2 text-xs text-primary hover:underline">
            + Add Benefit
          </button>
        </div>
      )}

      {/* Custom Rich Text */}
      {section.type === 'custom' && (
        <div className="space-y-1.5">
          <Label className="text-xs">Content (HTML)</Label>
          <textarea
            value={section.content.richText || ''}
            onChange={(e) => updateContent('richText', e.target.value)}
            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-mono"
            rows={8}
            placeholder="<p>Write your custom HTML content here...</p>"
          />
        </div>
      )}

      {/* Jobs — minimal config */}
      {section.type === 'jobs' && (
        <div className="text-xs text-muted-foreground">
          This section automatically displays your active job listings. Manage jobs from the Jobs page.
        </div>
      )}
    </div>
  );
}
