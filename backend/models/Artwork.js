const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Artwork title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    imageUrl: {
      type: String,
      required: [true, 'Image is required'],
    },
    imagePublicId: {
      type: String, // Cloudinary public_id for deletion
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Oil Painting', 'Watercolor', 'Acrylic', 'Charcoal', 'Pastel', 'Mixed Media', 'Digital', 'Sketch', 'Other'],
    },
    medium: {
      type: String,
      trim: true,
    },
    year: {
      type: Number,
      min: 1900,
      max: new Date().getFullYear(),
    },
    dimensions: {
      width: Number,
      height: Number,
      unit: { type: String, enum: ['cm', 'in'], default: 'cm' },
    },
    tags: [{ type: String, trim: true }],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Virtual for like count
artworkSchema.virtual('likeCount').get(function () {
  return this.likes.length;
});

artworkSchema.set('toJSON', { virtuals: true });
artworkSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Artwork', artworkSchema);
