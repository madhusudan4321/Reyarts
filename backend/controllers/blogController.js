const Blog = require('../models/Blog');
const { cloudinary } = require('../config/cloudinary');

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
const getBlogs = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 9, featured } = req.query;

    const query = { isPublished: true };

    if (category) query.category = category;
    if (featured === 'true') query.isFeatured = true;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select('-content');

    res.json({ blogs, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single blog by id or slug
// @route   GET /api/blogs/:id
// @access  Public
const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).catch(() => null)
      || await Blog.findOne({ slug: req.params.id });

    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create blog
// @route   POST /api/blogs
// @access  Admin
const createBlog = async (req, res) => {
  try {
    const { title, excerpt, content, category, tags, isFeatured, isPublished, readTime } = req.body;

    const blog = await Blog.create({
      title,
      excerpt,
      content,
      category,
      tags: tags ? JSON.parse(tags) : [],
      isFeatured: isFeatured === 'true',
      isPublished: isPublished !== 'false',
      readTime: readTime ? Number(readTime) : 5,
      coverImage: req.file ? req.file.path : undefined,
      coverImagePublicId: req.file ? req.file.filename : undefined,
    });

    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Admin
const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const { title, excerpt, content, category, tags, isFeatured, isPublished, readTime } = req.body;

    blog.title = title || blog.title;
    blog.excerpt = excerpt || blog.excerpt;
    blog.content = content || blog.content;
    blog.category = category || blog.category;
    blog.tags = tags ? JSON.parse(tags) : blog.tags;
    blog.isFeatured = isFeatured !== undefined ? isFeatured === 'true' : blog.isFeatured;
    blog.isPublished = isPublished !== undefined ? isPublished !== 'false' : blog.isPublished;
    blog.readTime = readTime ? Number(readTime) : blog.readTime;

    if (req.file) {
      if (blog.coverImagePublicId) {
        await cloudinary.uploader.destroy(blog.coverImagePublicId);
      }
      blog.coverImage = req.file.path;
      blog.coverImagePublicId = req.file.filename;
    }

    const updated = await blog.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Admin
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    if (blog.coverImagePublicId) {
      await cloudinary.uploader.destroy(blog.coverImagePublicId);
    }

    await blog.deleteOne();
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getBlogs, getBlogById, createBlog, updateBlog, deleteBlog };
