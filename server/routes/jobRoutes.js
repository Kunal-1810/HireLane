const router = require('express').Router();
const { getJobs, getJob, createJob, updateJob, deleteJob, myJobs } = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getJobs);
router.get('/mine/list', protect, authorize('recruiter'), myJobs); // keep above '/:id'
router.get('/:id', getJob);
router.post('/', protect, authorize('recruiter'), createJob);
router.put('/:id', protect, authorize('recruiter'), updateJob);
router.delete('/:id', protect, authorize('recruiter'), deleteJob);

module.exports = router;
