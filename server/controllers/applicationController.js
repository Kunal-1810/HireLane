const Application = require('../models/Application');
const Job = require('../models/Job');

// POST /api/applications/:jobId  (multipart: resume, coverLetter)
exports.apply = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job || job.status !== 'open') return res.status(404).json({ message: 'This job is no longer open' });
    if (!req.file) return res.status(400).json({ message: 'Please attach your resume (PDF)' });

    const application = await Application.create({
      job: job._id,
      candidate: req.user._id,
      resumeUrl: `/uploads/${req.file.filename}`,
      coverLetter: req.body.coverLetter || '',
    });
    res.status(201).json({ application });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'You have already applied to this job' });
    next(err);
  }
};

exports.myApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ candidate: req.user._id })
      .populate('job', 'title company location type status')
      .sort({ createdAt: -1 });
    res.json({ applications });
  } catch (err) { next(err); }
};

// Recruiter: applicants of one of their own jobs
exports.jobApplicants = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (!job.postedBy.equals(req.user._id)) return res.status(403).json({ message: 'Not your job posting' });

    const applications = await Application.find({ job: job._id })
      .populate('candidate', 'name email')
      .sort({ createdAt: -1 });
    res.json({ job, applications });
  } catch (err) { next(err); }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id).populate('job');
    if (!application) return res.status(404).json({ message: 'Application not found' });
    if (!application.job.postedBy.equals(req.user._id)) return res.status(403).json({ message: 'Not your job posting' });

    const { status } = req.body;
    if (!['applied', 'shortlisted', 'rejected', 'hired'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    application.status = status;
    await application.save();
    res.json({ application });
  } catch (err) { next(err); }
};
