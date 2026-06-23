const Artwork = require('../models/Artwork');
const { cloudinary } = require('../config/cloudinary');

// @desc    Get all artworks (with filter, sort, search, pagination)
// @route   GET /api/artworks
// @access  Public
const getArtworks = async (req, res) => {
  try {
    const { category, medium, year, sort, search, page = 1, limit = 12, featured } = req.query;

    const query = { isPublished: true };

    if (category) query.category = category;
    if (medium) query.medium = { $regex: medium, $options: 'i' };
    if (year) query.year = Number(year);
    if (featured === 'true') query.isFeatured = true;
    if (search) query.title = { $regex: search, $options: 'i' };

    let sortOption = { createdAt: -1 }; // default: newest
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'most-viewed') sortOption = { views: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Artwork.countDocuments(query);
    const artworks = await Artwork.find(query).sort(sortOption).skip(skip).limit(Number(limit));

    res.json({
      artworks,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single artwork
// @route   GET /api/artworks/:id
// @access  Public
const getArtworkById = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) return res.status(404).json({ message: 'Artwork not found' });

    // Increment view count
    artwork.views += 1;
    await artwork.save();

    res.json(artwork);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create artwork
// @route   POST /api/artworks
// @access  Admin
const createArtwork = async (req, res) => {
  try {
    const { title, description, category, medium, year, dimensions, tags, isFeatured } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an artwork image' });
    }

    const artwork = await Artwork.create({
      title,
      description,
      imageUrl: req.file.path,
      imagePublicId: req.file.filename,
      category,
      medium,
      year: year ? Number(year) : undefined,
      dimensions: dimensions ? JSON.parse(dimensions) : undefined,
      tags: tags ? JSON.parse(tags) : [],
      isFeatured: isFeatured === 'true',
    });

    res.status(201).json(artwork);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update artwork
// @route   PUT /api/artworks/:id
// @access  Admin
const updateArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) return res.status(404).json({ message: 'Artwork not found' });

    const { title, description, category, medium, year, dimensions, tags, isFeatured, isPublished } = req.body;

    artwork.title = title || artwork.title;
    artwork.description = description || artwork.description;
    artwork.category = category || artwork.category;
    artwork.medium = medium || artwork.medium;
    artwork.year = year ? Number(year) : artwork.year;
    artwork.dimensions = dimensions ? JSON.parse(dimensions) : artwork.dimensions;
    artwork.tags = tags ? JSON.parse(tags) : artwork.tags;
    artwork.isFeatured = isFeatured !== undefined ? isFeatured === 'true' : artwork.isFeatured;
    artwork.isPublished = isPublished !== undefined ? isPublished === 'true' : artwork.isPublished;

    // If new image uploaded, delete old from cloudinary
    if (req.file) {
      if (artwork.imagePublicId) {
        await cloudinary.uploader.destroy(artwork.imagePublicId);
      }
      artwork.imageUrl = req.file.path;
      artwork.imagePublicId = req.file.filename;
    }

    const updated = await artwork.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete artwork
// @route   DELETE /api/artworks/:id
// @access  Admin
const deleteArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) return res.status(404).json({ message: 'Artwork not found' });

    if (artwork.imagePublicId) {
      await cloudinary.uploader.destroy(artwork.imagePublicId);
    }

    await artwork.deleteOne();
    res.json({ message: 'Artwork deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Like / Unlike artwork
// @route   POST /api/artworks/:id/like
// @access  Private
const toggleLike = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) return res.status(404).json({ message: 'Artwork not found' });

    const userId = req.user._id;
    const isLiked = artwork.likes.includes(userId);

    if (isLiked) {
      artwork.likes = artwork.likes.filter((id) => id.toString() !== userId.toString());
    } else {
      artwork.likes.push(userId);
    }

    await artwork.save();
    res.json({ likes: artwork.likes.length, isLiked: !isLiked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get related artworks by category
// @route   GET /api/artworks/:id/related
// @access  Public
const getRelatedArtworks = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) return res.status(404).json({ message: 'Artwork not found' });

    const related = await Artwork.find({
      _id: { $ne: artwork._id },
      category: artwork.category,
      isPublished: true,
    }).limit(4);

    res.json(related);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getArtworks, getArtworkById, createArtwork, updateArtwork, deleteArtwork, toggleLike, getRelatedArtworks };
