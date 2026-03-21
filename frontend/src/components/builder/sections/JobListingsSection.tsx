import { useEffect, useState } from 'react';
import { SectionContent } from '@/stores/builderStore';
import { Theme } from '@/stores/themeStore';
import { Company } from '@/stores/companyStore';
import { motion } from 'framer-motion';
import { MapPin, Clock, Briefcase } from 'lucide-react';
import api from '@/lib/axios';

interface Props {
  content: SectionContent;
  theme: Theme | null;
  company: Company | null;
  isPreview?: boolean;
}

export default function JobListingsSection({ content, theme, company, isPreview }: Props) {
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        if (isPreview && company) {
          // In preview mode, fetch from authenticated endpoint
          const response = await api.get('/api/v1/jobs?per_page=50');
          setJobs(response.data.data.filter((j: any) => j.isActive));
        }
      } catch (error) {
        console.error('Failed to fetch jobs for preview');
      }
    };
    fetchJobs();
  }, [company, isPreview]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      id="jobs"
      className="py-20 px-6"
      style={{ backgroundColor: `${theme?.surfaceColor || '#12121A'}` }}
    >
      <div className="max-w-4xl mx-auto">
        <h2
          className="text-3xl md:text-4xl font-bold mb-4 text-center"
          style={{ fontFamily: theme?.fontHeading ? `"${theme.fontHeading}", sans-serif` : undefined }}
        >
          {content.title || 'Open Positions'}
        </h2>
        {content.description && (
          <p className="text-center mb-10" style={{ color: theme?.textMutedColor }}>
            {content.description}
          </p>
        )}

        {jobs.length > 0 ? (
          <div className="space-y-3">
            {jobs.map((job, index) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="p-5 rounded-xl flex items-center justify-between group cursor-pointer transition-all hover:scale-[1.01]"
                style={{
                  backgroundColor: theme?.bgColor || '#0A0A0F',
                  borderRadius: theme?.borderRadius || '0.75rem',
                }}
              >
                <div>
                  <h3 className="font-semibold text-base mb-1.5">{job.title}</h3>
                  <div className="flex items-center gap-4 text-sm" style={{ color: theme?.textMutedColor }}>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
                    <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" />{job.department}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{job.employmentType}</span>
                  </div>
                </div>
                <span
                  className="text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                  style={{
                    backgroundColor: `${theme?.primaryColor || '#6366F1'}22`,
                    color: theme?.primaryColor || '#6366F1',
                  }}
                >
                  Apply →
                </span>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center py-8" style={{ color: theme?.textMutedColor }}>
            {isPreview ? 'No active jobs to display. Add jobs from the Jobs page.' : 'Loading jobs...'}
          </p>
        )}
      </div>
    </motion.section>
  );
}
