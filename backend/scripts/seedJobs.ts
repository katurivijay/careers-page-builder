import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

// Import models
import { Job } from '../src/models/Job';
import { Company } from '../src/models/Company';

const CSV_PATH = path.join(__dirname, '../../Sample Jobs Data - Sample Jobs Data.csv');

function parseDate(postedStr: string): Date {
  const date = new Date();
  if (postedStr === 'Posted today') {
    return date;
  }
  const match = postedStr.match(/(\d+)/);
  if (match) {
    const days = parseInt(match[1], 10);
    date.setDate(date.getDate() - days);
  }
  return date;
}

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('✅ Connected to MongoDB');

    // Find the test company
    const company = await Company.findOne({ name: 'Test Company' });
    if (!company) {
      console.error('❌ Test Company not found. Please log in to the UI and create it first.');
      process.exit(1);
    }
    console.log('Found company ID:', company._id);

    // Read and parse CSV
    const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
    const lines = csvContent.split('\n').filter(line => line.trim() !== '');
    const headers = lines[0].split(',').map(h => h.trim());

    const jobs = [];
    
    for (let i = 1; i < lines.length; i++) {
        // Handle commas inside quotes in CSV (e.g., "Berlin, Germany")
        const row = lines[i].match(/(?:\"([^\"]*)\")|([^\,]+)/g)?.map(val => val.replace(/^"|"$/g, '').trim()) || [];
        
        if (row.length < 10) continue;

        // Custom manual parser based on exact column index:
        // 0: title, 1: work_policy, 2: location, 3: department, 4: employment_type, 5: experience_level, 6: job_type, 7: salary_range, 8: job_slug, 9: posted_days_ago
        
        let workPolicy = row[1].toLowerCase();
        if (workPolicy === 'on-site') workPolicy = 'onsite';

        let employmentType = row[4].toLowerCase().replace(' ', '-');
        
        const description = `This is a sample description for the ${row[0]} role. We are looking for talented individuals to join our team in ${row[2]}.`;

        jobs.push({
            companyId: company._id,
            title: row[0],
            slug: row[8] + '-' + i, // ensuring uniqueness
            department: row[3],
            location: row[2],
            workPolicy: workPolicy,
            employmentType: employmentType,
            experienceLevel: row[5].toLowerCase(),
            jobType: row[6].toLowerCase(),
            salaryRange: row[7],
            description: description,
            isActive: true,
            postedAt: parseDate(row[9])
        });
    }

    console.log(`Prepared ${jobs.length} jobs to insert.`);

    // Clear existing jobs for this company first
    await Job.deleteMany({ companyId: company._id });
    console.log('Cleared old jobs for this company.');

    // Insert new ones
    await Job.insertMany(jobs);
    console.log('✅ Successfully seeded all jobs!');

    mongoose.disconnect();
    
    // Also restart the backend processes just in case
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seedDatabase();
