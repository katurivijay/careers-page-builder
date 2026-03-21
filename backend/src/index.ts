import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db';
import { env } from './config/env';
import { errorHandler, notFound } from './middleware/errorHandler';

// Route imports
import authRoutes from './routes/v1/auth.routes';
import companyRoutes from './routes/v1/company.routes';
import careerPageRoutes from './routes/v1/careerPage.routes';
import sectionRoutes from './routes/v1/section.routes';
import jobRoutes from './routes/v1/job.routes';
import themeRoutes from './routes/v1/theme.routes';
import publicRoutes from './routes/v1/public.routes';
import analyticsRoutes from './routes/v1/analytics.routes';

const app = express();

// Middleware
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes (v1)
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/company', companyRoutes);
app.use('/api/v1/career-page', careerPageRoutes);
app.use('/api/v1/sections', sectionRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/theme', themeRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

// Public routes (no /api prefix for clean URLs)
app.use('/api/v1/public', publicRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = parseInt(env.PORT);

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📍 Environment: ${env.NODE_ENV}`);
  });
};

startServer().catch(console.error);

export default app;
