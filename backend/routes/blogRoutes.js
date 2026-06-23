const express = require('express');
const router = express.Router();
const { getBlogs, getBlogById, createBlog, updateBlog, deleteBlog } = require('../controllers/blogController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const { uploadBlog } = require('../config/cloudinary');

router.get('/', getBlogs);
router.post('/', protect, adminOnly, uploadBlog.single('coverImage'), createBlog);
router.get('/:id', getBlogById);
router.put('/:id', protect, adminOnly, uploadBlog.single('coverImage'), updateBlog);
router.delete('/:id', protect, adminOnly, deleteBlog);

module.exports = router;
