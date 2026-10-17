# HireLane – MERN Job Portal

A full-stack job portal with two roles. **Candidates** search jobs, upload a PDF resume and track application status. **Recruiters** post jobs, review applicants and move them through a hiring pipeline.

## Tech stack
React (Vite), React Router, Axios · Node.js, Express · MongoDB + Mongoose · JWT auth, bcrypt · Multer (resume upload)

## Features
- Register and log in as candidate or recruiter (JWT, hashed passwords, role-based routes)
- Job search by keyword (MongoDB text index), location, type and minimum salary, with pagination
- Candidates: apply with PDF resume and cover letter, one application per job, status tracking
- Recruiters: post, edit, close/reopen and delete jobs, view applicants, set status (applied, shortlisted, rejected, hired)
- Ownership checks: recruiters can only change their own jobs and applicants

## Run locally
Requires Node 18+ and a MongoDB database (local or Atlas).

```bash
# 1. API
cd server
npm install
cp .env.example .env      # then edit MONGO_URI and JWT_SECRET
npm run seed              # optional demo data: recruiter@demo.com / demo1234
npm run dev               # http://localhost:5000

# 2. Client (new terminal)
cd client
npm install
npm run dev               # http://localhost:5173
```

On Windows, use `copy .env.example .env` instead of `cp`.

## API overview
| Method | Route | Access |
|---|---|---|
| POST | /api/auth/register, /api/auth/login | Public |
| GET | /api/auth/me | Logged in |
| GET | /api/jobs?q=&location=&type=&minSalary=&page= | Public |
| GET | /api/jobs/:id | Public |
| POST / PUT / DELETE | /api/jobs, /api/jobs/:id | Recruiter (owner) |
| GET | /api/jobs/mine/list | Recruiter |
| POST | /api/applications/:jobId (multipart: resume) | Candidate |
| GET | /api/applications/mine | Candidate |
| GET | /api/applications/job/:jobId | Recruiter (owner) |
| PATCH | /api/applications/:id/status | Recruiter (owner) |

## Deployment
- **Database:** MongoDB Atlas. Allow your host's IPs in Network Access and use the connection string as `MONGO_URI`.
- **API:** deploy `server/` on Render or Railway. Set `MONGO_URI`, `JWT_SECRET` and `CLIENT_URL` (your frontend URL).
- **Client:** deploy `client/` on Vercel and set `VITE_API_URL` to your API URL.
- Uploaded resumes are saved on the server disk, which is wiped on redeploy on most free hosts. For production, switch `middleware/upload.js` to Cloudinary or S3.

## Ideas to extend
Email notifications (Nodemailer) on status change, saved jobs, recruiter company profile, admin panel, Cloudinary uploads.
