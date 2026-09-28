const mongoose = require('mongoose');

const FANDOM_CATEGORIES = [
  'Anime',
  'Gaming',
  'Movies',
  'TV Shows',
  'K-Pop',
  'Comics',
  'Manga',
  'Cosplay',
];

const contentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Content title is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: FANDOM_CATEGORIES,
    },
    type: {
      type: String,
      enum: ['video', 'article', 'audio', 'image'],
      default: 'video',
    },
    genre: {
      type: String,
      default: 'General',
    },
    description: {
      type: String,
      default: '',
    },
    release_year: {
      type: Number,
      default: new Date().getFullYear(),
    },
    popularity_score: {
      type: Number,
      default: 0,
    },
    image_url: {
      type: String,
      default: '',
    },
    embed_url: {
      type: String,
      default: '',
    },
    tags: [String],
    is_featured: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    tmdb_id: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

contentSchema.index({ category: 1, type: 1 });
contentSchema.index({ title: 'text', description: 'text', genre: 'text' });

const Content = mongoose.model('Content', contentSchema);
module.exports = Content;
module.exports.FANDOM_CATEGORIES = FANDOM_CATEGORIES;
