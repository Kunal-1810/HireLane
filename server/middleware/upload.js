const multer = require('multer');

// Keep the PDF in memory (Vercel's filesystem is read-only); it is saved to MongoDB by the controller
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') return cb(null, true);
  cb(new Error('Resume must be a PDF file'));
};

module.exports = multer({ storage: multer.memoryStorage(), fileFilter, limits: { fileSize: 2 * 1024 * 1024 } });
