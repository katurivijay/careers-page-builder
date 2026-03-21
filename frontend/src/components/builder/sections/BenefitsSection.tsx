import { SectionContent } from '@/stores/builderStore';
import { Theme } from '@/stores/themeStore';
import { motion } from 'framer-motion';

interface Props { content: SectionContent; theme: Theme | null; }

export default function BenefitsSection({ content, theme }: Props) {
  const benefits = content.benefits || [];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-20 px-6"
    >
      <div className="max-w-5xl mx-auto">
        <h2
          className="text-3xl md:text-4xl font-bold mb-12 text-center"
          style={{ fontFamily: theme?.fontHeading ? `"${theme.fontHeading}", sans-serif` : undefined }}
        >
          {content.title || 'Benefits & Perks'}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-xl text-center transition-transform hover:scale-105"
              style={{
                backgroundColor: `${theme?.surfaceColor || '#12121A'}`,
                borderRadius: theme?.borderRadius || '0.75rem',
              }}
            >
              <div className="text-3xl mb-3">{benefit.icon}</div>
              <h3 className="font-semibold text-base mb-2">{benefit.title}</h3>
              <p className="text-sm" style={{ color: theme?.textMutedColor || '#94A3B8' }}>
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>

        {benefits.length === 0 && (
          <p className="text-center" style={{ color: theme?.textMutedColor }}>
            No benefits added yet. Use the editor to add benefit cards.
          </p>
        )}
      </div>
    </motion.section>
  );
}
