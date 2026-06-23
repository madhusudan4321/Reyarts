const Artwork = require('../models/Artwork');
const Blog = require('../models/Blog');
const User = require('../models/User');
const Comment = require('../models/Comment');
const Exhibition = require('../models/Exhibition');

const getDashboardStats = async (req, res) => {
  try {
    const [totalArtworks, totalBlogs, totalUsers, totalComments, totalExhibitions] = await Promise.all([
      Artwork.countDocuments(),
      Blog.countDocuments(),
      User.countDocuments(),
      Comment.countDocuments(),
      Exhibition.countDocuments(),
    ]);

    // Total likes across all artworks
    const likesAgg = await Artwork.aggregate([
      { $project: { likeCount: { $size: '$likes' } } },
      { $group: { _id: null, total: { $sum: '$likeCount' } } },
    ]);
    const totalLikes = likesAgg.length > 0 ? likesAgg[0].total : 0;

    // Most viewed artwork
    const mostViewedArtwork = await Artwork.findOne().sort({ views: -1 }).select('title imageUrl views category');

    // Recent artworks
    const recentArtworks = await Artwork.find().sort({ createdAt: -1 }).limit(5).select('title imageUrl category createdAt');

    // Recent users
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('name email role createdAt');

    res.json({
      stats: {
        totalArtworks,
        totalBlogs,
        totalUsers,
        totalComments,
        totalExhibitions,
        totalLikes,
      },
      mostViewedArtwork,
      recentArtworks,
      recentUsers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };
