import { useEffect, useState } from 'react';
import { useBuilderStore, Section } from '@/stores/builderStore';
import { useThemeStore } from '@/stores/themeStore';
import { useCompanyStore } from '@/stores/companyStore';
import { DndContext, closestCenter, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableSection from '@/components/builder/SortableSection';
import SectionEditor from '@/components/builder/SectionEditor';
import ThemeCustomizer from '@/components/builder/ThemeCustomizer';
import LivePreview from '@/components/builder/LivePreview';
import { Button, Card, CardContent } from '@/components/ui';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Eye, EyeOff, Globe, GlobeLock, Paintbrush, Layers,
  Loader2, LayoutTemplate, Type, Heart, Briefcase, FileText, Image
} from 'lucide-react';

const SECTION_OPTIONS: { type: Section['type']; label: string; icon: React.ReactNode }[] = [
  { type: 'hero', label: 'Hero Banner', icon: <LayoutTemplate className="w-4 h-4" /> },
  { type: 'about', label: 'About Us', icon: <Type className="w-4 h-4" /> },
  { type: 'culture', label: 'Culture', icon: <Image className="w-4 h-4" /> },
  { type: 'benefits', label: 'Benefits', icon: <Heart className="w-4 h-4" /> },
  { type: 'jobs', label: 'Job Listings', icon: <Briefcase className="w-4 h-4" /> },
  { type: 'custom', label: 'Custom Block', icon: <FileText className="w-4 h-4" /> },
];

export default function BuilderPage() {
  const {
    sections, isLoading, fetchSections, createSection, reorderSections,
    activeSectionId, setActiveSection, isPublished, fetchPublishStatus, publishPage, unpublishPage,
  } = useBuilderStore();
  const { fetchTheme } = useThemeStore();
  const { company } = useCompanyStore();

  const [showAddMenu, setShowAddMenu] = useState(false);
  const [activeTab, setActiveTab] = useState<'sections' | 'theme'>('sections');
  const [showPreview, setShowPreview] = useState(true);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  useEffect(() => {
    fetchSections();
    fetchTheme();
    fetchPublishStatus();
  }, [fetchSections, fetchTheme, fetchPublishStatus]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sections.findIndex((s) => s._id === active.id);
    const newIndex = sections.findIndex((s) => s._id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const newOrder = [...sections];
    const [moved] = newOrder.splice(oldIndex, 1);
    newOrder.splice(newIndex, 0, moved);
    reorderSections(newOrder.map((s) => s._id));
  };

  const handleAddSection = (type: Section['type']) => {
    createSection(type);
    setShowAddMenu(false);
  };

  const handlePublishToggle = async () => {
    if (isPublished) {
      await unpublishPage();
    } else {
      await publishPage();
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[calc(100vh-4rem)] flex flex-col -m-8 bg-[#0F0F1A]">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-[#0F0F1A]/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-2">
          <Button
            variant={activeTab === 'sections' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('sections')}
          >
            <Layers className="w-4 h-4 mr-1" /> Sections
          </Button>
          <Button
            variant={activeTab === 'theme' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('theme')}
          >
            <Paintbrush className="w-4 h-4 mr-1" /> Theme
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setShowPreview(!showPreview)}>
            {showPreview ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
            {showPreview ? 'Hide' : 'Show'} Preview
          </Button>
          {company && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(`/${company.slug}/careers`, '_blank')}
            >
              <Globe className="w-4 h-4 mr-1" /> View Live
            </Button>
          )}
          <Button
            variant={isPublished ? 'outline' : 'default'}
            size="sm"
            onClick={handlePublishToggle}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-1" />
            ) : isPublished ? (
              <GlobeLock className="w-4 h-4 mr-1" />
            ) : (
              <Globe className="w-4 h-4 mr-1" />
            )}
            {isPublished ? 'Unpublish' : 'Publish'}
          </Button>
        </div>
      </div>

      {/* Builder Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel — Sections / Theme */}
        <div className="w-80 border-r border-white/5 bg-[#0F0F1A] overflow-y-auto flex-shrink-0 relative z-10 custom-scrollbar shadow-[4px_0_24px_rgba(0,0,0,0.2)]">
          <AnimatePresence mode="wait">
            {activeTab === 'sections' ? (
              <motion.div key="sections" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4">
                {/* Add Section */}
                <div className="mb-4 relative">
                  <Button className="w-full" variant="outline" onClick={() => setShowAddMenu(!showAddMenu)}>
                    <Plus className="w-4 h-4 mr-2" /> Add Section
                  </Button>
                  <AnimatePresence>
                    {showAddMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-xl z-20 overflow-hidden"
                      >
                        {SECTION_OPTIONS.map((opt) => (
                          <button
                            key={opt.type}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-secondary transition-colors text-left"
                            onClick={() => handleAddSection(opt.type)}
                          >
                            <span className="text-muted-foreground">{opt.icon}</span>
                            <span>{opt.label}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Section List */}
                {isLoading && sections.length === 0 ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : sections.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground text-sm">
                    <Layers className="w-8 h-8 mx-auto mb-3 opacity-50" />
                    No sections yet. Add one to get started!
                  </div>
                ) : (
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={sections.map((s) => s._id)} strategy={verticalListSortingStrategy}>
                      <div className="space-y-2">
                        {sections.map((section) => (
                          <SortableSection
                            key={section._id}
                            section={section}
                            isActive={activeSectionId === section._id}
                            onClick={() => setActiveSection(activeSectionId === section._id ? null : section._id)}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}

                {/* Section Editor — below the list when a section is selected */}
                <AnimatePresence>
                  {activeSectionId && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                      <div className="mt-4 pt-4 border-t border-border">
                        <SectionEditor />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div key="theme" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ThemeCustomizer />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Panel — Live Preview */}
        {showPreview && (
          <div className="flex-1 overflow-y-auto relative bg-[#0A0A0F]">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-100 pointer-events-none" />
            <div className="p-8 min-h-full w-full flex justify-center">
              <div className="w-full max-w-5xl bg-white rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.6)] overflow-hidden border border-white/10 transition-all duration-300 transform-gpu my-auto">
                <LivePreview />
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
