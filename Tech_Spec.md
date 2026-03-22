# Technical Specification

## Assumptions
 Before I this project building, I made a few simple assumptions:

* Recruiters are the main users (candidates don’t need accounts)
* One recruiter manages one company only
* No payment system for now
* MongoDB Atlas is used for easy setup
* JWT auth using HTTP-only cookies
* Section-based builder instead of full drag-and-drop
* Seed data from CSV for testing


## Architecture
The project follows a simple client-server setup:

Frontend (React) → Backend (Express) → MongoDB (Atlas)
I kept things straightforward so it’s easy to run and understand.

## Why This Stack

* React + Vite → fast development
* Tailwind → quick styling
* Zustand → simple state management
* Express → flexible backend
* MongoDB → works well for dynamic data like sections

## Database Design

Main collections:

* User
* Company
* CareerPage
* Section
* Job
* Theme
* Analytics

All data is scoped using `companyId`.


## API Design

All APIs follow `/api/v1/...`

Includes:

* Auth routes
* Company management
* Jobs CRUD
* Sections management
* Public APIs for careers page


## Testing Approach

I mainly did manual testing:

* Signup / login / logout
* Job creation and updates
* Page builder updates
* Public careers page rendering
* Search and filters
* Mobile responsiveness
* Basic accessibility checks

## Notes

* No automated tests due to time constraints
* Focus was on building a working product
