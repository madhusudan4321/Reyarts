const mongoose = require('mongoose');

const exhibitionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Exhibition title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    images: [{ type: String }],
    imagePublicIds: [{ type: String }],
    isPast: {
      type: Boolean,
      default: false,
    },
    isHighlighted: {
      type: Boolean,
      default: false,
    },
    artworksShown: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artwork',
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Exhibition', exhibitionSchema);
