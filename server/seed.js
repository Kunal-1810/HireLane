// server/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Job = require('./models/Job');

async function seed() {
  try {
    if (!process.env.MONGO_URI) throw new Error('MONGO_URI is missing. Run this from the server folder.');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to:', mongoose.connection.host, '/', mongoose.connection.name);

    await User.deleteMany({ email: 'recruiter@demo.com' });
    const recruiter = await User.create({
      name: 'Demo Recruiter',
      email: 'recruiter@demo.com',
      password: 'demo1234',
      role: 'recruiter',
      company: 'Northwind Labs',
    });

    await Job.deleteMany({ postedBy: recruiter._id });
    await Job.insertMany(
      [
        { title: 'Junior MERN Stack Developer', location: 'Chandigarh', type: 'Full-time', salaryMin: 300000, salaryMax: 500000, experience: '0-2 years', skills: ['React', 'Node.js', 'MongoDB'], description: 'Build and maintain REST APIs and React interfaces for our client projects.' },
        { title: 'Frontend Developer (React)', location: 'Remote', type: 'Remote', salaryMin: 400000, salaryMax: 700000, experience: '1-3 years', skills: ['React', 'CSS', 'JavaScript'], description: 'Own the UI of our dashboard product and collaborate closely with designers.' },
        { title: 'Backend Intern (Node.js)', location: 'Delhi', type: 'Internship', salaryMin: 120000, salaryMax: 180000, experience: 'Fresher', skills: ['Node.js', 'Express', 'MongoDB'], description: 'Work with senior engineers on API design, testing and deployment.' },
        { title: 'Full Stack Developer', company: 'CloudNest', location: 'Gurugram', type: 'Full-time', salaryMin: 600000, salaryMax: 1000000, experience: '2-4 years', skills: ['React', 'Node.js', 'MongoDB', 'AWS'], description: 'Ship features end to end across our React frontend and Express APIs.' },
  { title: 'React Developer', company: 'Pixel Labs', location: 'Noida', type: 'Full-time', salaryMin: 450000, salaryMax: 800000, experience: '1-3 years', skills: ['React', 'Redux', 'Tailwind CSS'], description: 'Build reusable components and improve performance of a large SaaS dashboard.' },
  { title: 'Node.js Backend Developer', company: 'DataBridge', location: 'Bengaluru', type: 'Full-time', salaryMin: 700000, salaryMax: 1200000, experience: '2-5 years', skills: ['Node.js', 'Express', 'PostgreSQL', 'Redis'], description: 'Design scalable REST APIs and background jobs for a fintech platform.' },
  { title: 'Frontend Intern', company: 'Pixel Labs', location: 'Remote', type: 'Internship', salaryMin: 100000, salaryMax: 150000, experience: 'Fresher', skills: ['HTML', 'CSS', 'JavaScript'], description: 'Convert Figma designs into responsive pages under a mentor.' },
  { title: 'MERN Stack Intern', location: 'Chandigarh', type: 'Internship', salaryMin: 120000, salaryMax: 200000, experience: 'Fresher', skills: ['React', 'Node.js', 'MongoDB'], description: 'Work on real features for our internal tools and learn code review practices.' },
  { title: 'UI Developer', company: 'BrightPath', location: 'Pune', type: 'Full-time', salaryMin: 350000, salaryMax: 600000, experience: '0-2 years', skills: ['JavaScript', 'React', 'SASS'], description: 'Create accessible, pixel-accurate interfaces for an education platform.' },
  { title: 'Senior React Engineer', company: 'Orbit Systems', location: 'Remote', type: 'Remote', salaryMin: 1200000, salaryMax: 1800000, experience: '5+ years', skills: ['React', 'TypeScript', 'Testing', 'GraphQL'], description: 'Lead frontend architecture and mentor a team of four developers.' },
  { title: 'Backend Developer (MongoDB)', company: 'CloudNest', location: 'Hyderabad', type: 'Full-time', salaryMin: 500000, salaryMax: 900000, experience: '1-3 years', skills: ['Node.js', 'MongoDB', 'Mongoose', 'JWT'], description: 'Model data, write aggregation pipelines and secure authentication flows.' },
  { title: 'Web Developer', company: 'Craftly Studio', location: 'Delhi', type: 'Full-time', salaryMin: 300000, salaryMax: 450000, experience: '0-1 years', skills: ['HTML', 'CSS', 'JavaScript', 'React'], description: 'Build marketing sites and small web apps for startup clients.' },
  { title: 'Full Stack Intern', company: 'DataBridge', location: 'Bengaluru', type: 'Internship', salaryMin: 180000, salaryMax: 240000, experience: 'Fresher', skills: ['React', 'Node.js', 'Git'], description: 'Pair with engineers on production features and bug fixes.' },
  { title: 'Remote Node.js Developer', company: 'Orbit Systems', location: 'Remote', type: 'Remote', salaryMin: 800000, salaryMax: 1400000, experience: '3-5 years', skills: ['Node.js', 'Express', 'Docker', 'MongoDB'], description: 'Own microservices for a global logistics product, with async-first collaboration.' },
  { title: 'Next.js Developer', company: 'Pixel Labs', location: 'Gurugram', type: 'Full-time', salaryMin: 600000, salaryMax: 1000000, experience: '2-4 years', skills: ['Next.js', 'React', 'SEO', 'Tailwind CSS'], description: 'Build fast, SEO-friendly storefronts and content sites.' },
  { title: 'API Developer', company: 'DataBridge', location: 'Noida', type: 'Full-time', salaryMin: 450000, salaryMax: 750000, experience: '1-3 years', skills: ['Node.js', 'Express', 'REST', 'Postman'], description: 'Build and document public APIs used by partner companies.' },
  { title: 'Software Engineer Trainee', company: 'BrightPath', location: 'Pune', type: 'Full-time', salaryMin: 250000, salaryMax: 400000, experience: 'Fresher', skills: ['JavaScript', 'Node.js', 'SQL'], description: 'Six-month structured training followed by a role on a product team.' },
  { title: 'Frontend Developer (Remote)', company: 'Craftly Studio', location: 'Remote', type: 'Remote', salaryMin: 500000, salaryMax: 850000, experience: '2-3 years', skills: ['React', 'JavaScript', 'REST APIs'], description: 'Work with a distributed team on a booking and scheduling product.' },
      ].map((j) => ({ ...j, company: recruiter.company, postedBy: recruiter._id }))
    );

    console.log('Seeded. Login: recruiter@demo.com / demo1234');
  } catch (err) {
    console.error('Seed failed:', err.name, '-', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seed();