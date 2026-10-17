const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // The PDF itself is stored in MongoDB; `data` is excluded from normal queries
    resume: {
      data: { type: Buffer, select: false },
      contentType: String,
      filename: String,
    },
    coverLetter: { type: String, default: '' },
    status: { type: String, enum: ['applied', 'shortlisted', 'rejected', 'hired'], default: 'applied' },
  },
  { timestamps: true }
);

// One application per candidate per job
applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
