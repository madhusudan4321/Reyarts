const mongoose = require('mongoose');

const timelineEventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    year: {
      type: Number,
    },
    category: {
      type: String,
      enum: ['First Work', 'Milestone', 'Award', 'Exhibition', 'Learning', 'Personal', 'Other'],
      default: 'Milestone',
    },
    image: {
      type: String,
    },
    imagePublicId: {
      type: String,
    },
    isHighlighted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Auto-set year from date
timelineEventSchema.pre('save', function (next) {
  if (this.date) {
    this.year = new Date(this.date).getFullYear();
  }
  next();
});

module.exports = mongoose.model('TimelineEvent', timelineEventSchema);
