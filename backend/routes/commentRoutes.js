const express = require('express');
const router = express.Router();
const { getComments, addComment, updateComment, deleteComment, getAllComments } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.get('/', getComments);
router.post('/', protect, addComment);
router.put('/:id', protect, updateComment);
router.delete('/:id', protect, deleteComment);
router.get('/admin/all', protect, adminOnly, getAllComments);

module.exports = router;
