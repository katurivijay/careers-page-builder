import { SectionContent } from '@/stores/builderStore';
import { Theme } from '@/stores/themeStore';
import { motion } from 'framer-motion';

interface Props { content: SectionContent; theme: Theme | null; }

export default function AboutSection({ content, theme }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-20 px-6"
    >
      <div className="max-w-3xl mx-auto text-center">
        <h2
          className="text-3xl md:text-4xl font-bold mb-6"
          style={{ fontFamily: theme?.fontHeading ? `"${theme.fontHeading}", sans-serif` : undefined }}
        >
          {content.title || 'About Us'}
        </h2>
        <p
          className="text-lg leading-relaxed whitespace-pre-line"
          style={{ color: theme?.textMutedColor || '#94A3B8' }}
        >
          {content.description || 'Tell your company story...'}
        </p>
      </div>
    </motion.section>
  );
}
