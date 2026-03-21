import { SectionContent } from '@/stores/builderStore';
import { Theme } from '@/stores/themeStore';
import { motion } from 'framer-motion';

interface Props { content: SectionContent; theme: Theme | null; }

export default function CustomSection({ content, theme }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-16 px-6"
    >
      <div className="max-w-3xl mx-auto">
        {content.title && (
          <h2
            className="text-3xl font-bold mb-6 text-center"
            style={{ fontFamily: theme?.fontHeading ? `"${theme.fontHeading}", sans-serif` : undefined }}
          >
            {content.title}
          </h2>
        )}
        {content.richText && (
          <div
            className="prose prose-invert max-w-none [&_h1]:text-2xl [&_h2]:text-xl [&_h3]:text-lg [&_p]:leading-relaxed [&_a]:underline [&_ul]:list-disc [&_ol]:list-decimal [&_li]:ml-4"
            style={{ color: theme?.textColor || '#F1F5F9' }}
            dangerouslySetInnerHTML={{ __html: content.richText }}
          />
        )}
      </div>
    </motion.section>
  );
}
