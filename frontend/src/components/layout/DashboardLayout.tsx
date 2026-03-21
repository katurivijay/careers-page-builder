import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useCompanyStore } from '@/stores/companyStore';
import { LayoutDashboard, Building2, Briefcase, Paintbrush, BarChart3, LogOut, Loader2, ExternalLink } from 'lucide-react';
import { useEffect } from 'react';

export default function DashboardLayout() {
  const { user, isAuthenticated, isLoading, logout } = useAuthStore();
  const { company, fetchCompany } = useCompanyStore();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) fetchCompany();
  }, [isAuthenticated, fetchCompany]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0F]">
        <Loader2 className="w-8 h-8 animate-spin text-[#6366F1]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Company Profile', path: '/dashboard/company', icon: Building2 },
    { name: 'Job Openings', path: '/dashboard/jobs', icon: Briefcase },
    { name: 'Page Builder', path: '/dashboard/builder', icon: Paintbrush },
    { name: 'Analytics', path: '/dashboard/analytics', icon: BarChart3 },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#0A0A0F] text-[#F1F5F9]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#1E293B] bg-[#0F0F1A] flex-col hidden md:flex">
        <div className="p-6 flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-[#6366F1] to-[#4F46E5] rounded-xl flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(99,102,241,0.5),inset_0_1px_rgba(255,255,255,0.3)]">
            C
          </div>
          <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">CareerCraft</span>
        </div>

        <div className="px-4 py-2">
          <div className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2 px-2">Main Menu</div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2.5 transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-[#6366F1]/15 to-transparent text-white font-medium border-l-2 border-[#6366F1]'
                      : 'text-[#94A3B8] hover:bg-white/5 hover:text-[#F1F5F9] border-l-2 border-transparent'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#6366F1]' : 'text-[#94A3B8] group-hover:text-[#F1F5F9]'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {company && (
          <div className="px-4 py-2 mt-4">
            <div className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2 px-2">Go Public</div>
            <a
              href={`/${company.slug}/careers`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#F1F5F9] transition-all duration-200 group"
            >
              <ExternalLink className="w-5 h-5 group-hover:text-[#F1F5F9]" />
              <span>View Live Page</span>
            </a>
          </div>
        )}

        <div className="mt-auto p-4 border-t border-[#1E293B]">
          <div className="flex items-center mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-[#1E293B] flex items-center justify-center text-sm font-medium mr-3">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-[#94A3B8] truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => logout()}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-[#94A3B8] hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative bg-[#0A0A0F]">
        {/* Glow Effects */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#6366F1]/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] opacity-50 pointer-events-none" />
        
        <div className="p-8 max-w-7xl mx-auto relative z-10 w-full min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
