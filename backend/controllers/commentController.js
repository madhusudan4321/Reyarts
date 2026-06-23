const Comment = require('../models/Comment');

// @desc    Get comments for an artwork or blog
// @route   GET /api/comments?artworkId=xxx OR ?blogId=xxx
// @access  Public
const getComments = async (req, res) => {
  try {
    const { artworkId, blogId } = req.query;
    const query = { isApproved: true };

    if (artworkId) query.artwork = artworkId;
    else if (blogId) query.blog = blogId;
    else return res.status(400).json({ message: 'Provide artworkId or blogId' });

    const comments = await Comment.find(query)
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add comment
// @route   POST /api/comments
// @access  Private
const addComment = async (req, res) => {
  try {
    const { text, artworkId, blogId } = req.body;

    if (!text) return res.status(400).json({ message: 'Comment text is required' });
    if (!artworkId && !blogId) return res.status(400).json({ message: 'Provide artworkId or blogId' });

    const comment = await Comment.create({
      text,
      author: req.user._id,
      artwork: artworkId || undefined,
      blog: blogId || undefined,
    });

    const populated = await comment.populate('author', 'name avatar');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update comment (owner only)
// @route   PUT /api/comments/:id
// @access  Private
const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this comment' });
    }

    comment.text = req.body.text || comment.text;
    await comment.save();

    const populated = await comment.populate('author', 'name avatar');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete comment (owner or admin)
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    const isOwner = comment.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all comments (admin)
// @route   GET /api/comments/admin/all
// @access  Admin
const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate('author', 'name email')
      .populate('artwork', 'title')
      .populate('blog', 'title')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getComments, addComment, updateComment, deleteComment, getAllComments };
