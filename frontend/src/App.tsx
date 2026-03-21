import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

// Layouts
import DashboardLayout from '@/components/layout/DashboardLayout';

// Auth Pages
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';

// Dashboard Pages
import DashboardPage from '@/pages/dashboard/DashboardPage';
import CompanyProfilePage from '@/pages/dashboard/CompanyProfilePage';
import JobsPage from '@/pages/dashboard/JobsPage';
import AnalyticsPage from '@/pages/dashboard/AnalyticsPage';

// Builder
import BuilderPage from '@/pages/builder/BuilderPage';

// Public
import CareersPage from '@/pages/public/CareersPage';

function App() {
  const { checkAuth, isLoading } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Public Routes */}
        <Route path="/:slug/careers" element={<CareersPage />} />

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="company" element={<CompanyProfilePage />} />
          <Route path="jobs" element={<JobsPage />} />
          <Route path="builder" element={<BuilderPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
        </Route>

        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
