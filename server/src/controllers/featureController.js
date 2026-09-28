const Merchandise = require('../models/Merchandise');
const Event = require('../models/Event');
const Submission = require('../models/Submission');
const Feedback = require('../models/Feedback');

// ── MERCHANDISE ─────────────────────────────────────────────────────────────
exports.getMerchandise = async (req, res) => {
  try {
    const { category, tag, upcoming } = req.query;
    const filter = {};
    if (category && category !== 'All') filter.category = category;
    if (tag && tag !== 'All') filter.tag = tag;
    if (upcoming === 'true') filter.is_upcoming = true;

    const items = await Merchandise.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: items, message: 'Merchandise fetched' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.trackMerchView = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Merchandise.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });
    res.status(200).json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── EVENTS ──────────────────────────────────────────────────────────────────
exports.getEvents = async (req, res) => {
  try {
    const { city, category } = req.query;
    const filter = {};
    if (city && city !== 'All') filter.city = new RegExp(city, 'i');
    if (category && category !== 'All') filter.category = category;

    const events = await Event.find(filter).sort({ start_date: 1 });
    res.status(200).json({ success: true, data: events, message: 'Events fetched' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── SUBMISSIONS ─────────────────────────────────────────────────────────────
exports.createSubmission = async (req, res) => {
  try {
    const { title, category, type, content, media_url } = req.body;
    const submission = await Submission.create({
      user_id: req.user.id,
      author_name: req.user.name || 'Anonymous Fan',
      title,
      category,
      type,
      content,
      media_url: media_url || '',
    });
    res.status(201).json({ success: true, data: submission, message: 'Submission received! Awaiting admin approval.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getUserSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ user_id: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: submissions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── FEEDBACK ────────────────────────────────────────────────────────────────
exports.createFeedback = async (req, res) => {
  try {
    const { type, message, rating } = req.body;
    const feedback = await Feedback.create({
      user_id: req.user ? req.user.id : null,
      user_name: req.user ? req.user.name : 'Anonymous Fan',
      user_email: req.user ? req.user.email : '',
      type,
      message,
      rating: rating || 5,
    });
    res.status(201).json({ success: true, data: feedback, message: 'Thank you for your feedback!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── AI CHATBOT ASSISTANT ────────────────────────────────────────────────────
exports.chatbotQuery = async (req, res) => {
  try {
    const { message } = req.body;
    const msg = (message || '').toLowerCase();

    let response = "I'm your Fan Hub Plus AI Assistant! You can ask me about categories (Anime, Gaming, K-Pop, etc.), merchandise drops, upcoming events, streaming content, or character profiles!";

    if (msg.includes('anime') || msg.includes('naruto') || msg.includes('demon slayer')) {
      response = "⛩️ Anime is one of our top fandoms! Check out Demon Slayer, Naruto, Attack on Titan, or browse our dedicated Anime Fandom Hub for trending series!";
    } else if (msg.includes('merch') || msg.includes('buy') || msg.includes('store') || msg.includes('figure')) {
      response = "🛍️ We have an active Merchandise Showcase featuring Limited Edition figures, Pre-Orders, and Hot Drops across all 8 fandom categories! Visit our Merchandise page to discover collectibles.";
    } else if (msg.includes('event') || msg.includes('convention') || msg.includes('cosplay') || msg.includes('meetup')) {
      response = "📍 Looking for nearby conventions or Cosplay meetups? Check out our Location-Aware Event Discovery & Calendar page to find screening events and ticket links by city!";
    } else if (msg.includes('submit') || msg.includes('article') || msg.includes('fan art')) {
      response = "✍️ Want to contribute? You can submit your own fan articles, reviews, or cosplay photos directly via our Fan Submission page for admin review!";
    } else if (msg.includes('recommend') || msg.includes('watch') || msg.includes('movie')) {
      response = "🔥 High recommendation for you: Check out 'Money Heist', 'Demon Slayer: Hashira Training', or discover Top Rated Movies in our Advanced Search Filter!";
    } else if (msg.includes('admin') || msg.includes('control')) {
      response = "🛡️ Admins can log in to manage platform content, moderate fan submissions, track analytics, and handle user permissions.";
    }

    res.status(200).json({
      success: true,
      data: {
        reply: response,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
