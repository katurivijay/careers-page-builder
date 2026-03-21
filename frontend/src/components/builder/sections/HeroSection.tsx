import { SectionContent } from '@/stores/builderStore';
import { Theme } from '@/stores/themeStore';
import { motion } from 'framer-motion';

interface Props { content: SectionContent; theme: Theme | null; }

export default function HeroSection({ content, theme }: Props) {
  const bgImage = content.backgroundImage || theme?.bannerUrl;
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative overflow-hidden"
      style={{
        background: bgImage
          ? `linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url(${bgImage}) center/cover`
          : `linear-gradient(135deg, ${theme?.primaryColor || '#6366F1'}, ${theme?.secondaryColor || '#8B5CF6'})`,
        minHeight: '420px',
      }}
    >
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-24 min-h-[420px]">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold mb-4 max-w-3xl"
          style={{ fontFamily: theme?.fontHeading ? `"${theme.fontHeading}", sans-serif` : undefined, color: '#fff' }}
        >
          {content.title || 'Join Our Team'}
        </motion.h1>

        {content.subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl mb-4 max-w-2xl"
            style={{ color: 'rgba(255,255,255,0.8)' }}
          >
            {content.subtitle}
          </motion.p>
        )}

        {content.description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-base mb-8 max-w-xl"
            style={{ color: 'rgba(255,255,255,0.65)' }}
          >
            {content.description}
          </motion.p>
        )}

        {content.ctaText && (
          <motion.a
            href={content.ctaLink || '#jobs'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="px-8 py-3 rounded-lg font-semibold text-white transition-transform hover:scale-105"
            style={{ backgroundColor: theme?.primaryColor || '#6366F1' }}
          >
            {content.ctaText}
          </motion.a>
        )}
      </div>
    </motion.section>
  );
}
