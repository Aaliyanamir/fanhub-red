const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    user_name: {
      type: String,
      default: 'Anonymous Fan',
    },
    user_email: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      enum: ['bug', 'suggestion', 'query'],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    status: {
      type: String,
      enum: ['new', 'reviewed', 'resolved'],
      default: 'new',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Feedback', feedbackSchema);
