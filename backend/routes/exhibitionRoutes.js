const express = require('express');
const router = express.Router();
const {
  getExhibitions, getExhibitionById, createExhibition, updateExhibition, deleteExhibition,
} = require('../controllers/exhibitionController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const { uploadExhibition } = require('../config/cloudinary');

router.get('/', getExhibitions);
router.post('/', protect, adminOnly, uploadExhibition.array('images', 10), createExhibition);
router.get('/:id', getExhibitionById);
router.put('/:id', protect, adminOnly, updateExhibition);
router.delete('/:id', protect, adminOnly, deleteExhibition);

module.exports = router;
