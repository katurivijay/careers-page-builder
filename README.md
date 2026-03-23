# Careers Page Builder

This is a platform that helps recruiters create branded careers pages without writing code.
The idea is very simple instead of static job pages, companies can build a proper careers page with their branding, job listings, and basic analytics.

## What I Built

Here’s what the platform can do:

* Recruiters can sign up and manage their company
* Create and manage job postings
* Build a careers page using sections(hero + jobs)
* Customize theme (colors, fonts, etc...)
* Share a public careers link
* Candidates can browse jobs, search, and filter
* Basic analytics for page views and job clicks
* Fully responsive and keyboard accessible


## Tech Stack

Frontend:

* React (Vite)
* React Router v7
* Tailwind CSS
* Zustand
* Framer Motion


Backend:

* Node.js
* Express
* TypeScript
* Mongoose

Database:

* MongoDB Atlas

Authentication:

* JWT (HTTP-only cookies), bcryptjs

Validation:

* Zod (both frontend and backend)


## How to Run

### What You Need
- Node.js v18 or higher
- A MongoDB Atlas account (free tier works fine)
- Git

### 1. Clone the Repo

```bash
git clone https://github.com/katurivijay/careers-page-builder.git
cd careers-page-builder
```

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder. You can copy from the example:

```bash
cp .env.example .env
```

Then fill in your actual values:

```env
PORT=8080
MONGODB_URI=your-mongodb-atlas-connection-string
JWT_SECRET=pick-any-random-secret-string
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Optional — only if you want logo uploads
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

Start the backend:

```bash
npm run dev
```

You should see: ` Server running on http://localhost:8080`

### 3. Set Up the Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

You should see: `Local: http://localhost:5173/`


## How to Use

### Recruiter flow

1. Sign up
2. Create company
3. Add jobs
4. Customize page (sections + theme)
5. View public careers page


### Candidate flow

* Visit `/careers/:slug`
* Browse jobs
* Search and filter


## Project Structure

```
careers-page-builder/
├── backend/
│   ├── src/
│   │   ├── config/           # Database connection, environment variables
│   │   ├── controllers/      # Route handlers (auth, company, jobs, etc.)
│   │   ├── middleware/        # Auth check, input validation, error handler
│   │   ├── models/           # 7 Mongoose schemas
│   │   └── routes/v1/        # 8 route files
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI (builder, layout, shared components)
│   │   ├── lib/              # Axios setup, utility functions
│   │   ├── pages/            # All page components
│   │   └── stores/           # Zustand stores for state management
│   └── package.json
├── Sample Jobs Data.csv      # Seed data
├── Tech_Spec.md              # Technical specification
├── AGENT_LOG.md              # AI usage log
└── README.md                 # You're reading this
```


## Improvements (If I had more time)

* Add job application system
* Email notifications
* Drag-and-drop builder
* Role-based access
* Proper testing (unit + integration)


## Notes

* Seed endpoint is only for demo
* No payment system included
* Cloudinary needed for logo upload

This project was built as part of a full-stack assignment to show product thinking and implementation.
