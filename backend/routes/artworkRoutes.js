const express = require('express');
const router = express.Router();
const {
  getArtworks, getArtworkById, createArtwork, updateArtwork, deleteArtwork, toggleLike, getRelatedArtworks,
} = require('../controllers/artworkController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const { uploadArtwork } = require('../config/cloudinary');

router.get('/', getArtworks);
router.post('/', protect, adminOnly, uploadArtwork.single('image'), createArtwork);
router.get('/:id', getArtworkById);
router.put('/:id', protect, adminOnly, uploadArtwork.single('image'), updateArtwork);
router.delete('/:id', protect, adminOnly, deleteArtwork);
router.post('/:id/like', protect, toggleLike);
router.get('/:id/related', getRelatedArtworks);

module.exports = router;
