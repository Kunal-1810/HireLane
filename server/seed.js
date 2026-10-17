// Optional: npm run seed  -> creates a demo recruiter and a few jobs
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Job = require('./models/Job');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Promise.all([User.deleteMany({ email: 'recruiter@demo.com' })]);
  const recruiter = await User.create({
    name: 'Demo Recruiter', email: 'recruiter@demo.com', password: 'demo1234', role: 'recruiter', company: 'Northwind Labs',
  });
  await Job.deleteMany({ postedBy: recruiter._id });
  await Job.insertMany([
    { title: 'Junior MERN Stack Developer', location: 'Chandigarh', type: 'Full-time', salaryMin: 300000, salaryMax: 500000, experience: '0-2 years', skills: ['React', 'Node.js', 'MongoDB'], description: 'Build and maintain REST APIs and React interfaces for our client projects.' },
    { title: 'Frontend Developer (React)', location: 'Remote', type: 'Remote', salaryMin: 400000, salaryMax: 700000, experience: '1-3 years', skills: ['React', 'CSS', 'JavaScript'], description: 'Own the UI of our dashboard product and collaborate closely with designers.' },
    { title: 'Backend Intern (Node.js)', location: 'Delhi', type: 'Internship', salaryMin: 120000, salaryMax: 180000, experience: 'Fresher', skills: ['Node.js', 'Express', 'MongoDB'], description: 'Work with senior engineers on API design, testing and deployment.' },
  ].map((j) => ({ ...j, company: recruiter.company, postedBy: recruiter._id })));
  console.log('Seeded. Login: recruiter@demo.com / demo1234');
  process.exit(0);
})();
