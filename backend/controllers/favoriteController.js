const Favorite = require('../models/Favorite');
const Artwork = require('../models/Artwork');

const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id }).populate('artwork').sort({ createdAt: -1 });
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addFavorite = async (req, res) => {
  try {
    const { artworkId } = req.body;
    const artwork = await Artwork.findById(artworkId);
    if (!artwork) return res.status(404).json({ message: 'Artwork not found' });

    const existing = await Favorite.findOne({ user: req.user._id, artwork: artworkId });
    if (existing) return res.status(400).json({ message: 'Already in favorites' });

    const favorite = await Favorite.create({ user: req.user._id, artwork: artworkId });
    const populated = await favorite.populate('artwork');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findOneAndDelete({ user: req.user._id, artwork: req.params.artworkId });
    if (!favorite) return res.status(404).json({ message: 'Favorite not found' });
    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const checkFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findOne({ user: req.user._id, artwork: req.params.artworkId });
    res.json({ isFavorited: !!favorite });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getFavorites, addFavorite, removeFavorite, checkFavorite };
