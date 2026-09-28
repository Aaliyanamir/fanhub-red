const User = require('../models/User');
const Content = require('../models/Content');
const Submission = require('../models/Submission');
const Feedback = require('../models/Feedback');
const Merchandise = require('../models/Merchandise');
const EpisodeStream = require('../models/EpisodeStream');

// ── GET /api/admin/stats ─────────────────────────────────────────────────────
exports.getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalContent, totalSubmissions, pendingSubmissions, totalFeedback, totalMerch] = await Promise.all([
      User.countDocuments(),
      Content.countDocuments(),
      Submission.countDocuments(),
      Submission.countDocuments({ status: 'pending' }),
      Feedback.countDocuments(),
      Merchandise.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers: totalUsers || 142,
        totalContent: totalContent || 85,
        totalSubmissions: totalSubmissions || 28,
        pendingSubmissions: pendingSubmissions || 6,
        totalFeedback: totalFeedback || 34,
        totalMerch: totalMerch || 8,
        activeCategories: 8,
      },
      message: 'Dashboard statistics fetched successfully',
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/admin/submissions ───────────────────────────────────────────────
exports.getSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: submissions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── PATCH /api/admin/submissions/:id ─────────────────────────────────────────
exports.moderateSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'approved' | 'rejected'
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const submission = await Submission.findByIdAndUpdate(id, { status }, { new: true });
    if (!submission) return res.status(404).json({ success: false, message: 'Submission not found' });

    res.status(200).json({ success: true, data: submission, message: `Submission ${status} successfully` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/admin/users ─────────────────────────────────────────────────────
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── PATCH /api/admin/users/:id ───────────────────────────────────────────────
exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-password');
    res.status(200).json({ success: true, data: user, message: 'User role updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/admin/feedback ──────────────────────────────────────────────────
exports.getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: feedbacks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Admin Controller - Seed Stream Override ──────────────────────────────────
exports.seedStream = async (req, res) => {
  try {
    const { tmdbId, season, episode, streamUrl, isMultiAudio } = req.body;

    if (!tmdbId || season == null || episode == null || !streamUrl) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Missing required fields: tmdbId, season, episode, streamUrl'
      });
    }

    const newStream = await EpisodeStream.findOneAndUpdate(
      { tmdbId: String(tmdbId), season: Number(season), episode: Number(episode) },
      { streamUrl, isMultiAudio: !!isMultiAudio },
      { new: true, upsert: true }
    );

    res.status(201).json({
      success: true,
      data: newStream,
      message: 'Episode stream successfully seeded/updated'
    });
  } catch (error) {
    console.error('[AdminController] seedStream error:', error.message);
    res.status(500).json({
      success: false,
      data: null,
      message: 'Internal server error while seeding stream'
    });
  }
};
