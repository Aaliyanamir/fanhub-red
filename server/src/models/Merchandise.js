const mongoose = require('mongoose');

const merchandiseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Merchandise name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Anime', 'Gaming', 'Movies', 'TV Shows', 'K-Pop', 'Comics', 'Manga', 'Cosplay'],
    },
    price: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    image_url: {
      type: String,
      required: true,
    },
    gallery: [String],
    description: {
      type: String,
      default: '',
    },
    tag: {
      type: String,
      enum: ['Limited Edition', 'Pre-Order', 'Collectible', 'Hot Drop', 'Standard'],
      default: 'Standard',
    },
    is_upcoming: {
      type: Boolean,
      default: false,
    },
    release_date: {
      type: Date,
      default: Date.now,
    },
    views: {
      type: Number,
      default: 0,
    },
    buy_link: {
      type: String,
      default: '#',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Merchandise', merchandiseSchema);
