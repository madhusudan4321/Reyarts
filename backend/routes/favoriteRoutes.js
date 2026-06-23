const express = require('express');
const router = express.Router();
const { getFavorites, addFavorite, removeFavorite, checkFavorite } = require('../controllers/favoriteController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getFavorites);
router.post('/', protect, addFavorite);
router.delete('/:artworkId', protect, removeFavorite);
router.get('/check/:artworkId', protect, checkFavorite);

module.exports = router;
