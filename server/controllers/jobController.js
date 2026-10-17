const Job = require('../models/Job');
const Application = require('../models/Application');

const parseSkills = (skills) =>
  Array.isArray(skills) ? skills : String(skills || '').split(',').map((s) => s.trim()).filter(Boolean);

// GET /api/jobs?q=&location=&type=&minSalary=&page=&limit=
exports.getJobs = async (req, res, next) => {
  try {
    const { q, location, type, minSalary, page = 1, limit = 9 } = req.query;
    const filter = { status: 'open' };
    if (q) filter.$text = { $search: q };
    if (location) filter.location = new RegExp(location.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    if (type) filter.type = type;
    if (minSalary) filter.salaryMax = { $gte: Number(minSalary) };

    const pageNum = Math.max(Number(page), 1);
    const perPage = Math.min(Number(limit), 30);
    const [jobs, total] = await Promise.all([
      Job.find(filter).sort({ createdAt: -1 }).skip((pageNum - 1) * perPage).limit(perPage),
      Job.countDocuments(filter),
    ]);
    res.json({ jobs, total, page: pageNum, pages: Math.ceil(total / perPage) });
  } catch (err) { next(err); }
};

exports.getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ job });
  } catch (err) { next(err); }
};

exports.createJob = async (req, res, next) => {
  try {
    const { title, location, type, salaryMin, salaryMax, experience, description, skills } = req.body;
    const job = await Job.create({
      title, location, type, salaryMin, salaryMax, experience, description,
      skills: parseSkills(skills),
      company: req.user.company,
      postedBy: req.user._id,
    });
    res.status(201).json({ job });
  } catch (err) { next(err); }
};

exports.updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (!job.postedBy.equals(req.user._id)) return res.status(403).json({ message: 'You can only edit your own jobs' });

    const fields = ['title', 'location', 'type', 'salaryMin', 'salaryMax', 'experience', 'description', 'status'];
    fields.forEach((f) => { if (req.body[f] !== undefined) job[f] = req.body[f]; });
    if (req.body.skills !== undefined) job.skills = parseSkills(req.body.skills);
    await job.save();
    res.json({ job });
  } catch (err) { next(err); }
};

exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (!job.postedBy.equals(req.user._id)) return res.status(403).json({ message: 'You can only delete your own jobs' });
    await Application.deleteMany({ job: job._id });
    await job.deleteOne();
    res.json({ message: 'Job deleted' });
  } catch (err) { next(err); }
};

// Recruiter's own jobs with applicant counts
exports.myJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 }).lean();
    const counts = await Application.aggregate([
      { $match: { job: { $in: jobs.map((j) => j._id) } } },
      { $group: { _id: '$job', count: { $sum: 1 } } },
    ]);
    const map = Object.fromEntries(counts.map((c) => [String(c._id), c.count]));
    res.json({ jobs: jobs.map((j) => ({ ...j, applicants: map[String(j._id)] || 0 })) });
  } catch (err) { next(err); }
};
