import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Section, useBuilderStore } from '@/stores/builderStore';
import { Button } from '@/components/ui';
import { GripVertical, Trash2, Eye, EyeOff, LayoutTemplate, Type, Image, Heart, Briefcase, FileText } from 'lucide-react';

const SECTION_ICONS: Record<string, React.ReactNode> = {
  hero: <LayoutTemplate className="w-4 h-4" />,
  about: <Type className="w-4 h-4" />,
  culture: <Image className="w-4 h-4" />,
  benefits: <Heart className="w-4 h-4" />,
  jobs: <Briefcase className="w-4 h-4" />,
  custom: <FileText className="w-4 h-4" />,
};

const SECTION_LABELS: Record<string, string> = {
  hero: 'Hero Banner',
  about: 'About Us',
  culture: 'Culture',
  benefits: 'Benefits',
  jobs: 'Job Listings',
  custom: 'Custom Block',
};

interface Props {
  section: Section;
  isActive: boolean;
  onClick: () => void;
}

export default function SortableSection({ section, isActive, onClick }: Props) {
  const { updateSection, deleteSection } = useBuilderStore();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const toggleVisibility = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateSection(section._id, { isVisible: !section.isVisible });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Delete this section?')) {
      deleteSection(section._id);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-all cursor-pointer group ${
        isActive
          ? 'border-primary bg-primary/5'
          : 'border-border/50 bg-secondary/30 hover:border-primary/30 hover:bg-secondary/50'
      } ${!section.isVisible ? 'opacity-50' : ''}`}
      onClick={onClick}
    >
      <button {...attributes} {...listeners} className="cursor-grab text-muted-foreground hover:text-foreground touch-none">
        <GripVertical className="w-4 h-4" />
      </button>

      <span className="text-muted-foreground">{SECTION_ICONS[section.type]}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">
          {section.content?.title || SECTION_LABELS[section.type]}
        </p>
        <p className="text-xs text-muted-foreground capitalize">{section.type}</p>
      </div>

      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={toggleVisibility}>
          {section.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-destructive" onClick={handleDelete}>
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
