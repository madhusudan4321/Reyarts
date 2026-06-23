const express = require('express');
const router = express.Router();
const { getTimeline, createTimelineEvent, updateTimelineEvent, deleteTimelineEvent } = require('../controllers/timelineController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const { uploadTimeline } = require('../config/cloudinary');

router.get('/', getTimeline);
router.post('/', protect, adminOnly, uploadTimeline.single('image'), createTimelineEvent);
router.put('/:id', protect, adminOnly, uploadTimeline.single('image'), updateTimelineEvent);
router.delete('/:id', protect, adminOnly, deleteTimelineEvent);

module.exports = router;
