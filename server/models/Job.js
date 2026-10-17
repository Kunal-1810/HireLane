const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    type: { type: String, enum: ['Full-time', 'Part-time', 'Internship', 'Contract', 'Remote'], default: 'Full-time' },
    salaryMin: { type: Number, default: 0 },
    salaryMax: { type: Number, default: 0 },
    experience: { type: String, default: 'Fresher' },
    description: { type: String, required: true },
    skills: [{ type: String, trim: true }],
    status: { type: String, enum: ['open', 'closed'], default: 'open' },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

jobSchema.index({ title: 'text', company: 'text', description: 'text', skills: 'text' });

module.exports = mongoose.model('Job', jobSchema);
