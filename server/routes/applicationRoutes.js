const router = require('express').Router();
const { apply, myApplications, jobApplicants, updateStatus, getResume } = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/mine', protect, authorize('candidate'), myApplications);
router.get('/:id/resume', protect, getResume);
router.get('/job/:jobId', protect, authorize('recruiter'), jobApplicants);
router.post('/:jobId', protect, authorize('candidate'), upload.single('resume'), apply);
router.patch('/:id/status', protect, authorize('recruiter'), updateStatus);

module.exports = router;
