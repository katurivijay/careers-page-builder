import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { motion, useInView } from 'framer-motion';
import {
  Paintbrush, Search, BarChart3, Target, Globe, Shield,
  ArrowRight, ChevronRight, Sparkles, Zap, Star,
  CheckCircle2, Play, Github, Twitter, Linkedin,
  Menu, X
} from 'lucide-react';

/* ───────── animation helpers ───────── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};
const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

function Section({ children, className = '', id }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.section
      ref={ref}
      id={id}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={stagger}
      className={`relative px-6 md:px-12 lg:px-20 ${className}`}
    >
      {children}
    </motion.section>
  );
}

/* ───────── counter hook ───────── */
function useCounter(end: number, inView: boolean, duration = 2000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end, duration]);
  return count;
}

/* ═══════════════════════════════════════
   LANDING PAGE
   ═══════════════════════════════════════ */
export default function LandingPage() {
  const { isAuthenticated } = useAuthStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true });

  const jobs = useCounter(150, statsInView);
  const companies = useCounter(3, statsInView);
  const uptime = useCounter(99, statsInView);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const ctaLink = isAuthenticated ? '/dashboard' : '/signup';
  const ctaLabel = isAuthenticated ? 'Go to Dashboard' : 'Get Started Free';

  return (
    <div className="min-h-screen bg-[#06060b] text-white overflow-x-hidden">
      {/* ── NAVBAR ── */}
      <nav
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-[#06060b]/80 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-shadow">
              C
            </div>
            <span className="text-lg font-semibold tracking-tight">CareerCraft</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-gray-400 hover:text-white transition-colors">How It Works</a>
            <a href="#pricing" className="text-sm text-gray-400 hover:text-white transition-colors">Pricing</a>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-medium shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all hover:scale-[1.02]"
              >
                Dashboard →
              </Link>
            ) : (
              <>
                <Link to="/login" className="rounded-xl px-4 py-2.5 text-sm text-gray-300 hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-medium shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all hover:scale-[1.02]"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden text-gray-400" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-[#0a0a14]/95 backdrop-blur-xl border-b border-white/5 px-6 pb-6"
          >
            <div className="flex flex-col gap-4 pt-2">
              <a href="#features" className="text-sm text-gray-400 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Features</a>
              <a href="#how-it-works" className="text-sm text-gray-400 hover:text-white" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
              <a href="#pricing" className="text-sm text-gray-400 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
              <Link to={ctaLink} className="mt-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-medium text-center">
                {ctaLabel}
              </Link>
            </div>
          </motion.div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
        {/* Glow orbs */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-40 left-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-6">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex justify-center mb-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-300">
              <Sparkles size={14} />
              Now in Beta — Build your careers page today
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto max-w-4xl text-center text-4xl font-extrabold leading-[1.1] tracking-tight md:text-6xl lg:text-7xl"
          >
            Build stunning{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              career pages
            </span>{' '}
            in minutes
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mx-auto mt-6 max-w-2xl text-center text-lg text-gray-400 leading-relaxed"
          >
            The all-in-one platform for recruiters to create, customize, and share
            beautiful career pages — no code required.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to={ctaLink}
              className="group flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3.5 text-sm font-semibold shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all hover:scale-[1.03]"
            >
              {ctaLabel}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#how-it-works"
              className="group flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-8 py-3.5 text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-all"
            >
              <Play size={14} />
              See How It Works
            </a>
          </motion.div>

          {/* Builder Preview Image */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="mt-16 md:mt-20"
          >
            <div className="relative mx-auto max-w-5xl">
              {/* Glow behind image */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 rounded-2xl blur-3xl -z-10 scale-95" />
              <div className="rounded-2xl border border-white/10 bg-[#0c0c18] p-2 shadow-2xl shadow-black/50">
                <img
                  src="/builder-preview.png"
                  alt="CareerCraft Page Builder Preview"
                  className="w-full rounded-xl"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#0c0c18]/90 backdrop-blur px-4 py-2 text-xs text-gray-400">
                <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                Live drag-and-drop builder
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div ref={statsRef} className="border-y border-white/5 bg-white/[0.02]">
        <div className="mx-auto max-w-5xl grid grid-cols-3 divide-x divide-white/5 py-10">
          {[
            { value: jobs, suffix: '+', label: 'Jobs Listed' },
            { value: companies, suffix: '+', label: 'Companies Active' },
            { value: uptime, suffix: '%', label: 'Uptime' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                {s.value}{s.suffix}
              </div>
              <div className="mt-1 text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <Section id="features" className="py-24 md:py-32">
        <motion.div variants={fadeUp} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-300 mb-4">
            <Zap size={14} />
            Everything you need
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Powerful features,{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              simple interface
            </span>
          </h2>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto">
            Build, customize, and manage your career pages with ease — all from one beautifully designed dashboard.
          </p>
        </motion.div>

        <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: Paintbrush, title: 'Visual Page Builder', desc: 'Drag-and-drop sections with real-time preview. Create stunning pages without writing a single line of code.', color: 'from-indigo-500 to-blue-500' },
            { icon: Search, title: 'Smart Job Listings', desc: 'Candidates can search by title, filter by location, department, or work type, with paginated results.', color: 'from-purple-500 to-pink-500' },
            { icon: BarChart3, title: 'Built-in Analytics', desc: 'Track page views, job clicks, and apply rates in real time. Make data-driven hiring decisions.', color: 'from-emerald-500 to-teal-500' },
            { icon: Target, title: 'Brand Customization', desc: 'Custom colors, typography, logos, and theme presets to match your company\'s unique identity.', color: 'from-orange-500 to-amber-500' },
            { icon: Globe, title: 'Public Careers URL', desc: 'Every company gets a clean, shareable URL like /your-company/careers. Ready to share anywhere.', color: 'from-cyan-500 to-blue-500' },
            { icon: Shield, title: 'Secure & Isolated', desc: 'JWT authentication, data isolation per company, and encrypted credentials. Enterprise-grade security.', color: 'from-rose-500 to-pink-500' },
          ].map(({ icon: Icon, title, desc, color }, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="group relative rounded-2xl border border-white/5 bg-white/[0.02] p-6 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300"
            >
              <div className={`mb-4 inline-flex items-center justify-center h-11 w-11 rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
                <Icon size={20} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ── HOW IT WORKS ── */}
      <Section id="how-it-works" className="py-24 md:py-32">
        <motion.div variants={fadeUp} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-1.5 text-xs font-medium text-purple-300 mb-4">
            <ChevronRight size={14} />
            3 simple steps
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Launch your careers page{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">in minutes</span>
          </h2>
        </motion.div>

        <div className="mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Sign Up', desc: 'Create your free recruiter account in seconds. No credit card required.', icon: Sparkles },
            { step: '02', title: 'Build & Brand', desc: 'Add sections, set your theme colors, and list your open positions.', icon: Paintbrush },
            { step: '03', title: 'Publish & Share', desc: 'Hit publish and share your unique careers URL with the world.', icon: Globe },
          ].map(({ step, title, desc, icon: Icon }, i) => (
            <motion.div key={i} variants={fadeUp} className="relative text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
                <Icon size={28} className="text-purple-400" />
              </div>
              <div className="text-xs font-mono text-purple-400/60 mb-2">STEP {step}</div>
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
              {i < 2 && (
                <div className="hidden md:block absolute top-8 -right-4 text-gray-700">
                  <ArrowRight size={20} />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ── TESTIMONIALS ── */}
      <Section className="py-24 md:py-32 border-y border-white/5 bg-white/[0.01]">
        <motion.div variants={fadeUp} className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Loved by{' '}
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">recruiters</span>
          </h2>
        </motion.div>

        <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Sarah Chen', role: 'Head of Talent, Nexus AI', quote: 'We set up our careers page in 15 minutes. It looked so polished that candidates thought we hired a design agency!', avatar: '👩‍💼' },
            { name: 'Raj Patel', role: 'HR Director, CloudStack', quote: 'The visual builder is incredible. Being able to preview changes live saved us hours of back-and-forth with designers.', avatar: '👨‍💻' },
            { name: 'Emily Torres', role: 'Founder, HireWell', quote: 'Analytics built right in! We can see which jobs get the most views and optimize our listings accordingly.', avatar: '👩‍🚀' },
          ].map(({ name, role, quote, avatar }, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 hover:border-white/10 transition-colors"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={14} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-gray-300 leading-relaxed mb-6">"{quote}"</p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-lg">
                  {avatar}
                </div>
                <div>
                  <div className="text-sm font-medium">{name}</div>
                  <div className="text-xs text-gray-500">{role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ── PRICING ── */}
      <Section id="pricing" className="py-24 md:py-32">
        <motion.div variants={fadeUp} className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Simple,{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">transparent</span>{' '}
            pricing
          </h2>
          <p className="mt-4 text-gray-400">Start free, upgrade when you need more.</p>
        </motion.div>

        <div className="mx-auto max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free */}
          <motion.div variants={fadeUp} className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
            <div className="text-sm font-medium text-gray-400 mb-2">Free</div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-gray-500">/month</span>
            </div>
            <p className="text-sm text-gray-500 mb-8">Everything you need to get started</p>
            <ul className="space-y-3 mb-8">
              {['1 company profile', 'Unlimited job listings', 'Visual page builder', 'Public careers URL', 'Basic analytics', 'Community support'].map((f, i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm text-gray-300">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              to={ctaLink}
              className="block w-full rounded-xl border border-white/10 bg-white/5 py-3 text-center text-sm font-medium hover:bg-white/10 transition-colors"
            >
              {ctaLabel}
            </Link>
          </motion.div>

          {/* Pro */}
          <motion.div variants={fadeUp} className="relative rounded-2xl border border-indigo-500/30 bg-gradient-to-b from-indigo-500/[0.08] to-transparent p-8">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide">
              Coming Soon
            </div>
            <div className="text-sm font-medium text-indigo-300 mb-2">Pro</div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-bold">$29</span>
              <span className="text-gray-500">/month</span>
            </div>
            <p className="text-sm text-gray-500 mb-8">For growing teams and agencies</p>
            <ul className="space-y-3 mb-8">
              {['Everything in Free', 'Custom domain support', 'Advanced analytics', 'Multiple team members', 'Priority support', 'Custom integrations'].map((f, i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm text-gray-300">
                  <CheckCircle2 size={16} className="text-indigo-400 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              disabled
              className="block w-full rounded-xl bg-indigo-600/20 border border-indigo-500/30 py-3 text-center text-sm font-medium text-indigo-300 cursor-not-allowed"
            >
              Notify Me
            </button>
          </motion.div>
        </div>
      </Section>

      {/* ── FINAL CTA ── */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-pink-600/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative mx-auto max-w-3xl text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
              Ready to build your{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                careers page?
              </span>
            </h2>
            <p className="text-gray-400 mb-10 text-lg">
              Join recruiters who've already transformed their hiring with CareerCraft.
            </p>
            <Link
              to={ctaLink}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-10 py-4 text-base font-semibold shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all hover:scale-[1.03]"
            >
              {ctaLabel}
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold">
              C
            </div>
            <span className="text-sm font-semibold">CareerCraft</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-xs text-gray-500">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Documentation</a>
          </div>

          {/* Social */}
          <div className="flex items-center gap-4">
            <a href="https://github.com/katurivijay/careers-page-builder" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition-colors">
              <Github size={18} />
            </a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors">
              <Twitter size={18} />
            </a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors">
              <Linkedin size={18} />
            </a>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-gray-600">
          © {new Date().getFullYear()} CareerCraft. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
