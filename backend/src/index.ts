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
import fs from 'fs';
import path from 'path';
import { Job } from './models/Job';
import { Company } from './models/Company';
import { CareerPage } from './models/CareerPage';

const app = express();

// Middleware
const FRONTEND_URLS = env.FRONTEND_URL.split(',').map(url => url.trim().replace(/\/+$/, ''));

app.use(cors({
  origin: FRONTEND_URLS,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
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

// Database seed route (Temporary for testing)
app.get('/api/v1/seed', async (req, res) => {
  try {
    const CSV_PATH = path.join(__dirname, '../../Sample Jobs Data - Sample Jobs Data.csv');
    
    // Find ALL companies
    const companies = await Company.find({});
    if (companies.length === 0) {
      return res.status(404).json({ error: 'No companies found. Log in and create one first.' });
    }

    const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
    const lines = csvContent.split('\n').filter(line => line.trim() !== '');
    
    const parseDate = (postedStr: string) => {
      const date = new Date();
      if (postedStr === 'Posted today') return date;
      const match = postedStr.match(/(\d+)/);
      if (match) date.setDate(date.getDate() - parseInt(match[1], 10));
      return date;
    };

    const seededSlugs: string[] = [];

    for (const company of companies) {
      const jobs = [];
      for (let i = 1; i < lines.length; i++) {
        const row = lines[i].match(/(?:\"([^\"]*)\")|([^\,]+)/g)?.map(val => val.replace(/^"|"$/g, '').trim()) || [];
        if (row.length < 10) continue;

        let workPolicy = row[1].toLowerCase();
        if (workPolicy === 'on-site') workPolicy = 'onsite';
        let employmentType = row[4].toLowerCase().replace(' ', '-');
        const description = `This is a sample description for the ${row[0]} role. We are looking for talented individuals to join our team in ${row[2]}.`;

        jobs.push({
          companyId: company._id,
          title: row[0],
          slug: row[8] + '-' + i,
          department: row[3],
          location: row[2],
          workPolicy,
          employmentType,
          experienceLevel: row[5].toLowerCase(),
          jobType: row[6].toLowerCase(),
          salaryRange: row[7],
          description,
          isActive: true,
          postedAt: parseDate(row[9])
        });
      }

      await Job.deleteMany({ companyId: company._id });
      await Job.insertMany(jobs);

      // Ensure career page exists and is published
      let careerPage = await CareerPage.findOne({ companyId: company._id });
      if (!careerPage) {
        careerPage = await CareerPage.create({ companyId: company._id, isPublished: true, publishedAt: new Date() });
      } else if (!careerPage.isPublished) {
        careerPage.isPublished = true;
        careerPage.publishedAt = new Date();
        await careerPage.save();
      }

      seededSlugs.push(company.slug);
    }

    res.json({ success: true, message: `Successfully seeded 150 jobs for ${companies.length} companies.`, slugs: seededSlugs });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

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
