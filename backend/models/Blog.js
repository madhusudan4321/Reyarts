const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    excerpt: {
      type: String,
      maxlength: [300, 'Excerpt cannot exceed 300 characters'],
    },
    content: {
      type: String,
      required: [true, 'Blog content is required'],
    },
    coverImage: {
      type: String,
    },
    coverImagePublicId: {
      type: String,
    },
    category: {
      type: String,
      enum: ['Painting Story', 'Creative Process', 'Book Inspiration', 'Personal Reflection', 'Exhibition Notes', 'Other'],
      default: 'Personal Reflection',
    },
    tags: [{ type: String, trim: true }],
    author: {
      type: String,
      default: 'Reya Saran',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    readTime: {
      type: Number, // minutes
      default: 5,
    },
  },
  { timestamps: true }
);

// Auto-generate slug from title
blogSchema.pre('save', function (next) {
  if (this.isModified('title') || this.isNew) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-') + '-' + Date.now();
  }
  next();
});

module.exports = mongoose.model('Blog', blogSchema);
