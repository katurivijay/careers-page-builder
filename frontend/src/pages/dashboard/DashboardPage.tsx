import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompanyStore } from '@/stores/companyStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button } from '@/components/ui';
import { motion } from 'framer-motion';
import { Eye, MousePointerClick, Briefcase, ArrowRight, Paintbrush, Building2, BarChart3 } from 'lucide-react';
import api from '@/lib/axios';

interface AnalyticsOverview {
  totalViews: number;
  totalJobClicks: number;
  activeJobsCount: number;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { company } = useCompanyStore();
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get('/api/v1/analytics/summary');
        setAnalytics(response.data.data.overview);
      } catch (error) {
        // Analytics might not be available yet
      }
    };
    if (company) fetchAnalytics();
  }, [company]);

  const statCards = [
    {
      title: 'Page Views',
      value: analytics?.totalViews ?? 0,
      icon: Eye,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Job Clicks',
      value: analytics?.totalJobClicks ?? 0,
      icon: MousePointerClick,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
    },
    {
      title: 'Active Jobs',
      value: analytics?.activeJobsCount ?? 0,
      icon: Briefcase,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
  ];

  const quickActions = [
    {
      title: 'Edit Company Profile',
      description: 'Update your brand info and logo',
      icon: Building2,
      path: '/dashboard/company',
    },
    {
      title: 'Page Builder',
      description: 'Customize your careers page sections',
      icon: Paintbrush,
      path: '/dashboard/builder',
    },
    {
      title: 'Manage Jobs',
      description: 'Add, edit, or remove job listings',
      icon: Briefcase,
      path: '/dashboard/jobs',
    },
    {
      title: 'View Analytics',
      description: 'Track page views and engagement',
      icon: BarChart3,
      path: '/dashboard/analytics',
    },
  ];

  if (!company) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[60vh] text-center"
      >
        <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
          <Building2 className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-3">Welcome to CareerCraft!</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          Let's get started by creating your company profile. This will be the foundation for your careers page.
        </p>
        <Button onClick={() => navigate('/dashboard/company')} className="px-6">
          <Building2 className="w-4 h-4 mr-2" />
          Create Company Profile
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70 mb-2">
          Welcome back{company?.name ? `, ${company.name}` : ''} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's an overview of your careers page performance.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-white/5 bg-[#0F0F1A]/60 backdrop-blur-xl shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)] hover:border-white/10 transition-all duration-300 relative overflow-hidden group">
                <div className={`absolute inset-0 bg-gradient-to-br from-transparent to-${stat.color.split('-')[1]}-500/5 opacity-0 group-hover:opacity-100 transition-opacity`} />
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#94A3B8] font-medium">{stat.title}</p>
                      <p className="text-4xl font-bold mt-2 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">{stat.value.toLocaleString()}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-2xl ${stat.bgColor} flex items-center justify-center border border-white/5 shadow-inner`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card
                  className="border-white/5 bg-[#0F0F1A]/60 backdrop-blur-xl cursor-pointer hover:border-[#6366F1]/30 hover:shadow-[0_8px_32px_-8px_rgba(99,102,241,0.15)] transition-all duration-300 group relative overflow-hidden"
                  onClick={() => navigate(action.path)}
                >
                  <CardContent className="p-5 flex items-center justify-between relative z-10">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-[#1E293B]/50 flex items-center justify-center group-hover:bg-[#6366F1]/10 group-hover:scale-110 transition-all duration-300 border border-white/5">
                        <Icon className="w-6 h-6 text-[#94A3B8] group-hover:text-[#6366F1] transition-colors" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#F1F5F9]">{action.title}</p>
                        <p className="text-sm text-[#94A3B8] mt-0.5">{action.description}</p>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/0 group-hover:bg-white/5 transition-colors">
                      <ArrowRight className="w-5 h-5 text-[#94A3B8] group-hover:text-[#F1F5F9] group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
