import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Search, MapPin, Briefcase, Clock, ChevronLeft, ChevronRight, Filter, X } from 'lucide-react';
import api from '@/lib/axios';
import SectionRenderer from '@/components/builder/SectionRenderer';

interface CareersData {
  company: any;
  sections: any[];
  theme: any;
  jobCount: number;
}

const DEPARTMENTS = ['Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'Operations', 'HR', 'Finance', 'Legal', 'Customer Support', 'Data', 'Other'];
const WORK_POLICIES = ['remote', 'hybrid', 'onsite'];
const EMPLOYMENT_TYPES = ['full-time', 'part-time', 'contract'];

export default function CareersPage() {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<CareersData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Job listing state
  const [jobs, setJobs] = useState<any[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [pagination, setPagination] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ department: '', workPolicy: '', employmentType: '' });
  const [showFilters, setShowFilters] = useState(false);

  // Fetch careers page data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/api/v1/public/${slug}/careers`);
        setData(response.data.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Page not found');
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchData();
  }, [slug]);

  // Fetch jobs
  const fetchJobs = async (page = 1) => {
    if (!slug) return;
    setJobsLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), per_page: '10' });
      if (search) params.set('search', search);
      if (filters.department) params.set('department', filters.department);
      if (filters.workPolicy) params.set('workPolicy', filters.workPolicy);
      if (filters.employmentType) params.set('employmentType', filters.employmentType);

      const response = await api.get(`/api/v1/public/${slug}/jobs?${params}`);
      setJobs(response.data.data);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error('Failed to fetch jobs');
    } finally {
      setJobsLoading(false);
    }
  };

  useEffect(() => { if (data) fetchJobs(); }, [data, search, filters]);

  // Track job click
  const trackJobClick = (jobId: string) => {
    api.post(`/api/v1/public/${slug}/analytics`, { event: 'job_click', jobId }).catch(() => {});
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="w-8 h-8 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-gray-400">{error || 'This careers page does not exist or is not published.'}</p>
      </div>
    );
  }

  const { company, sections, theme } = data;
  const nonJobSections = sections.filter((s: any) => s.type !== 'jobs');
  const hasJobSection = sections.some((s: any) => s.type === 'jobs');
  const jobSection = sections.find((s: any) => s.type === 'jobs');

  // Build dynamic theme styles
  const themeStyle: React.CSSProperties = theme ? {
    backgroundColor: theme.bgColor || '#0A0A0F',
    color: theme.textColor || '#F1F5F9',
    fontFamily: `"${theme.fontBody || 'Inter'}", sans-serif`,
  } : {};

  // JSON-LD structured data for job postings
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: company.name,
    url: company.website || window.location.href,
    ...(company.logo && { logo: company.logo }),
    jobPosting: jobs.map((job) => ({
      '@type': 'JobPosting',
      title: job.title,
      description: job.description,
      datePosted: job.postedAt,
      employmentType: job.employmentType?.toUpperCase().replace('-', '_'),
      jobLocation: { '@type': 'Place', address: job.location },
      hiringOrganization: { '@type': 'Organization', name: company.name },
    })),
  };

  const clearFilters = () => setFilters({ department: '', workPolicy: '', employmentType: '' });
  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <>
      <Helmet>
        <title>{company.name} — Careers</title>
        <meta name="description" content={`Explore career opportunities at ${company.name}. ${company.description?.slice(0, 140) || ''}`} />
        <meta property="og:title" content={`${company.name} — Careers`} />
        <meta property="og:description" content={company.description?.slice(0, 200) || ''} />
        {company.logo && <meta property="og:image" content={company.logo} />}
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div style={themeStyle} className="min-h-screen">
        {/* Render all non-job sections */}
        {nonJobSections.map((section: any) => (
          <SectionRenderer key={section._id} section={section} theme={theme} company={company} />
        ))}

        {/* Jobs Section — always render with search & filters */}
        {hasJobSection && (
          <section id="jobs" className="py-20 px-6" style={{ backgroundColor: theme?.surfaceColor || '#12121A' }}>
            <div className="max-w-4xl mx-auto">
              <h2
                className="text-3xl md:text-4xl font-bold mb-4 text-center"
                style={{ fontFamily: theme?.fontHeading ? `"${theme.fontHeading}", sans-serif` : undefined }}
              >
                {jobSection?.content?.title || 'Open Positions'}
              </h2>
              {jobSection?.content?.description && (
                <p className="text-center mb-8" style={{ color: theme?.textMutedColor }}>
                  {jobSection.content.description}
                </p>
              )}

              {/* Search & Filters */}
              <div className="mb-6 space-y-3">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: theme?.textMutedColor }} />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search by title or keyword..."
                      className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm bg-transparent focus:outline-none focus:ring-2 transition-all"
                      style={{
                        borderColor: `${theme?.textMutedColor || '#94A3B8'}22`,
                        color: theme?.textColor,
                        boxShadow: `0 2px 8px rgba(0,0,0,0.15) inset`,
                      }}
                    />
                  </div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-4 py-2.5 rounded-lg border text-sm font-medium flex items-center gap-2 transition-colors"
                    style={{
                      borderColor: `${theme?.textMutedColor || '#94A3B8'}33`,
                      backgroundColor: activeFilterCount > 0 ? `${theme?.primaryColor}22` : 'transparent',
                    }}
                  >
                    <Filter className="w-4 h-4" />
                    Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
                  </button>
                </div>

                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-wrap gap-3 p-4 rounded-lg"
                    style={{ backgroundColor: `${theme?.bgColor || '#0A0A0F'}` }}
                  >
                    <select
                      value={filters.department}
                      onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                      className="px-3 py-2 rounded-lg border text-sm bg-transparent"
                      style={{ borderColor: `${theme?.textMutedColor}33`, color: theme?.textColor }}
                    >
                      <option value="" style={{ background: theme?.surfaceColor }}>All Departments</option>
                      {DEPARTMENTS.map((d) => <option key={d} value={d} style={{ background: theme?.surfaceColor }}>{d}</option>)}
                    </select>
                    <select
                      value={filters.workPolicy}
                      onChange={(e) => setFilters({ ...filters, workPolicy: e.target.value })}
                      className="px-3 py-2 rounded-lg border text-sm bg-transparent capitalize"
                      style={{ borderColor: `${theme?.textMutedColor}33`, color: theme?.textColor }}
                    >
                      <option value="" style={{ background: theme?.surfaceColor }}>All Locations</option>
                      {WORK_POLICIES.map((w) => <option key={w} value={w} style={{ background: theme?.surfaceColor }} className="capitalize">{w}</option>)}
                    </select>
                    <select
                      value={filters.employmentType}
                      onChange={(e) => setFilters({ ...filters, employmentType: e.target.value })}
                      className="px-3 py-2 rounded-lg border text-sm bg-transparent"
                      style={{ borderColor: `${theme?.textMutedColor}33`, color: theme?.textColor }}
                    >
                      <option value="" style={{ background: theme?.surfaceColor }}>All Types</option>
                      {EMPLOYMENT_TYPES.map((t) => <option key={t} value={t} style={{ background: theme?.surfaceColor }} className="capitalize">{t}</option>)}
                    </select>
                    {activeFilterCount > 0 && (
                      <button onClick={clearFilters} className="text-sm flex items-center gap-1" style={{ color: theme?.primaryColor }}>
                        <X className="w-3.5 h-3.5" /> Clear All
                      </button>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Job Cards */}
              {jobsLoading ? (
                <div className="flex justify-center py-12">
                  <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: theme?.primaryColor }} />
                </div>
              ) : jobs.length > 0 ? (
                <div className="space-y-3">
                  {jobs.map((job, index) => (
                    <motion.div
                      key={job._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04 }}
                      className="p-5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 group cursor-pointer transition-all duration-300 hover:scale-[1.01] border"
                      style={{
                        backgroundColor: theme?.bgColor || '#0A0A0F',
                        borderRadius: theme?.borderRadius || '12px',
                        borderColor: `${theme?.textMutedColor || '#94A3B8'}15`,
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = `${theme?.primaryColor || '#6366F1'}50`; (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px -8px ${theme?.primaryColor || '#6366F1'}20`; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = `${theme?.textMutedColor || '#94A3B8'}15`; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
                      onClick={() => trackJobClick(job._id)}
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-base mb-1.5">{job.title}</h3>
                        <div className="flex items-center gap-3 flex-wrap text-sm" style={{ color: theme?.textMutedColor }}>
                          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
                          <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" />{job.department}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{job.employmentType}</span>
                          <span className="capitalize px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: `${theme?.primaryColor}22`, color: theme?.primaryColor }}>
                            {job.workPolicy}
                          </span>
                        </div>
                        {job.salaryRange && <p className="text-sm mt-1.5" style={{ color: theme?.textMutedColor }}>{job.salaryRange}</p>}
                      </div>
                      <button
                        className="text-sm font-medium px-5 py-2.5 rounded-lg text-center transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white"
                        style={{ backgroundColor: theme?.primaryColor, color: '#fff' }}
                      >
                        View & Apply
                      </button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12" style={{ color: theme?.textMutedColor }}>
                  <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p>No open positions matching your criteria.</p>
                </div>
              )}

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-8">
                  <button
                    disabled={!pagination.hasPrev}
                    onClick={() => fetchJobs(pagination.page - 1)}
                    className="px-4 py-2 rounded-lg border text-sm disabled:opacity-30 flex items-center gap-1"
                    style={{ borderColor: `${theme?.textMutedColor}33` }}
                  >
                    <ChevronLeft className="w-4 h-4" /> Prev
                  </button>
                  <span className="text-sm" style={{ color: theme?.textMutedColor }}>
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    disabled={!pagination.hasNext}
                    onClick={() => fetchJobs(pagination.page + 1)}
                    className="px-4 py-2 rounded-lg border text-sm disabled:opacity-30 flex items-center gap-1"
                    style={{ borderColor: `${theme?.textMutedColor}33` }}
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="py-10 px-6 text-center text-sm border-t" style={{ borderColor: `${theme?.textMutedColor}15`, color: theme?.textMutedColor }}>
          <p className="opacity-60">© {new Date().getFullYear()} {company.name}. Powered by <span className="font-semibold" style={{ color: theme?.primaryColor }}>CareerCraft</span></p>
        </footer>
      </div>
    </>
  );
}
