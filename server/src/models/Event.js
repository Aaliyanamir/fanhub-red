const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Anime', 'Gaming', 'Movies', 'TV Shows', 'K-Pop', 'Comics', 'Manga', 'Cosplay'],
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      default: 'USA',
    },
    location_name: {
      type: String,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    image_url: {
      type: String,
      default: '',
    },
    ticket_link: {
      type: String,
      default: '#',
    },
    organizer: {
      type: String,
      default: 'Fandom Community',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
