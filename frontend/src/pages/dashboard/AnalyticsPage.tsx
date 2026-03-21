import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { motion } from 'framer-motion';
import { Eye, MousePointerClick, Briefcase, TrendingUp } from 'lucide-react';
import api from '@/lib/axios';

interface AnalyticsData {
  overview: {
    totalViews: number;
    totalJobClicks: number;
    totalApplyClicks: number;
    last30DaysViews: number;
    last7DaysViews: number;
    activeJobsCount: number;
  };
  dailyViews: Array<{ _id: string; count: number }>;
  topJobs: Array<{ _id: string; clicks: number; title: string; department: string }>;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/api/v1/analytics/summary');
        setData(response.data.data);
      } catch (error) {
        console.error('Failed to fetch analytics');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const overview = data?.overview;
  const maxDailyCount = Math.max(...(data?.dailyViews?.map(d => d.count) || [1]));

  const stats = [
    { label: 'Total Page Views', value: overview?.totalViews ?? 0, icon: Eye, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Job Clicks', value: overview?.totalJobClicks ?? 0, icon: MousePointerClick, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Apply Clicks', value: overview?.totalApplyClicks ?? 0, icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Active Jobs', value: overview?.activeJobsCount ?? 0, icon: Briefcase, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70 mb-2">Analytics</h1>
        <p className="text-[#94A3B8] mt-1">Track your careers page performance and engagement.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card className="border-white/5 bg-[#0F0F1A]/60 backdrop-blur-xl shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)] hover:border-white/10 transition-all duration-300">
                <CardContent className="p-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#94A3B8] font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold mt-2 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">{stat.value.toLocaleString()}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center border border-white/5 shadow-inner`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Views Chart (simple bar chart) */}
        <Card className="lg:col-span-2 border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Page Views — Last 30 Days</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.dailyViews && data.dailyViews.length > 0 ? (
              <div className="flex items-end gap-1 h-48">
                {data.dailyViews.map((day) => (
                  <div key={day._id} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-card border border-border text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                      {day._id}: {day.count} views
                    </div>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(day.count / maxDailyCount) * 100}%` }}
                      transition={{ duration: 0.5, delay: 0.01 }}
                      className="w-full bg-primary/60 rounded-t-sm min-h-[4px] hover:bg-primary transition-colors cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
                No view data yet. Share your careers page to start tracking!
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Clicked Jobs */}
        <Card className="border-white/5 bg-[#0F0F1A]/60 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-lg">Top Clicked Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.topJobs && data.topJobs.length > 0 ? (
              <div className="space-y-4">
                {data.topJobs.map((job, i) => (
                  <div key={job._id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-muted-foreground w-5">{i + 1}</span>
                      <div>
                        <p className="text-sm font-medium">{job.title}</p>
                        <p className="text-xs text-muted-foreground">{job.department}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-primary">{job.clicks}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground text-sm">
                No click data available yet.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Period Comparison */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <Card className="border-white/5 bg-[#0F0F1A]/60 backdrop-blur-xl">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground mb-1">Last 7 Days Views</p>
            <p className="text-2xl font-bold">{(overview?.last7DaysViews ?? 0).toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="border-white/5 bg-[#0F0F1A]/60 backdrop-blur-xl">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground mb-1">Last 30 Days Views</p>
            <p className="text-2xl font-bold">{(overview?.last30DaysViews ?? 0).toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
