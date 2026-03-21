import { SectionContent } from '@/stores/builderStore';
import { Theme } from '@/stores/themeStore';
import { motion } from 'framer-motion';

interface Props { content: SectionContent; theme: Theme | null; }

export default function CultureSection({ content, theme }: Props) {
  const videoUrl = content.videoUrl || theme?.cultureVideoUrl;
  // Convert YouTube URLs to embed format
  const embedUrl = videoUrl
    ? videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')
    : null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-20 px-6"
      style={{ backgroundColor: `${theme?.surfaceColor || '#12121A'}` }}
    >
      <div className="max-w-4xl mx-auto">
        <h2
          className="text-3xl md:text-4xl font-bold mb-4 text-center"
          style={{ fontFamily: theme?.fontHeading ? `"${theme.fontHeading}", sans-serif` : undefined }}
        >
          {content.title || 'Our Culture'}
        </h2>
        {content.description && (
          <p className="text-center mb-8 max-w-2xl mx-auto" style={{ color: theme?.textMutedColor || '#94A3B8' }}>
            {content.description}
          </p>
        )}

        {embedUrl && (
          <div className="aspect-video rounded-xl overflow-hidden shadow-2xl">
            <iframe
              src={embedUrl}
              title="Culture video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        )}

        {!embedUrl && (
          <div
            className="aspect-video rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${theme?.primaryColor || '#6366F1'}11` }}
          >
            <p style={{ color: theme?.textMutedColor }}>Add a culture video URL to display it here</p>
          </div>
        )}
      </div>
    </motion.section>
  );
}
