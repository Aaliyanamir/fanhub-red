const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    author_name: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Anime', 'Gaming', 'Movies', 'TV Shows', 'K-Pop', 'Comics', 'Manga', 'Cosplay'],
    },
    type: {
      type: String,
      enum: ['article', 'fan_art', 'cosplay_photo', 'review'],
      default: 'article',
    },
    content: {
      type: String,
      required: true,
    },
    media_url: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Submission', submissionSchema);
