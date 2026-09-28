const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'fanhub_super_secret_key_change_in_production';
const JWT_EXPIRES_IN = '7d';

// ── POST /api/auth/register ──────────────────────────────────────────────────
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'All fields are required.' });

    if (password.length < 6)
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          favorite_fandoms: user.favorite_fandoms,
        },
      },
    });
  } catch (err) {
    console.error('[Register Error]', err.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ── POST /api/auth/login ─────────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password are required.' });

    let user = await User.findOne({ email }).select('+password');
    
    // Auto-seed default demo accounts if not created yet
    if (!user) {
      if (email === 'admin@fanhub.com' && password === 'admin123') {
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash('admin123', salt);
        user = await User.create({
          name: 'System Admin',
          email: 'admin@fanhub.com',
          password: hashedPassword,
          role: 'admin',
          favorite_fandoms: ['Anime', 'Gaming', 'Movies', 'TV Shows'],
        });
        user = await User.findOne({ email: 'admin@fanhub.com' }).select('+password');
      } else if (email === 'user@fanhub.com' && password === 'user123') {
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash('user123', salt);
        user = await User.create({
          name: 'Regular Fan',
          email: 'user@fanhub.com',
          password: hashedPassword,
          role: 'user',
          favorite_fandoms: ['Anime', 'K-Pop', 'Cosplay'],
        });
        user = await User.findOne({ email: 'user@fanhub.com' }).select('+password');
      }
    }

    if (!user)
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });

    user.last_login = new Date();
    await user.save({ validateBeforeSave: false });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.status(200).json({
      success: true,
      message: 'Login successful!',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          favorite_fandoms: user.favorite_fandoms,
        },
      },
    });
  } catch (err) {
    console.error('[Login Error]', err.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ── PATCH /api/auth/profile  (protected) ────────────────────────────────────
exports.updateProfile = async (req, res) => {
  try {
    const { name, avatar, favorite_fandoms } = req.body;
    const userId = req.user.id;

    const validFandoms = ['Anime', 'Gaming', 'Movies', 'TV Shows', 'K-Pop', 'Comics', 'Manga', 'Cosplay'];

    const update = {};
    if (name) {
      if (name.length < 3 || name.length > 30)
        return res.status(400).json({ success: false, message: 'Name must be between 3 and 30 characters.' });
      update.name = name.trim();
    }
    if (avatar !== undefined) update.avatar = avatar;
    if (Array.isArray(favorite_fandoms)) {
      const invalid = favorite_fandoms.filter((f) => !validFandoms.includes(f));
      if (invalid.length)
        return res.status(400).json({ success: false, message: `Invalid fandoms: ${invalid.join(', ')}` });
      update.favorite_fandoms = favorite_fandoms;
    }

    const user = await User.findByIdAndUpdate(userId, update, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          favorite_fandoms: user.favorite_fandoms,
        },
      },
    });
  } catch (err) {
    console.error('[UpdateProfile Error]', err.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ── PATCH /api/auth/change-password  (protected) ────────────────────────────
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword)
      return res.status(400).json({ success: false, message: 'Both password fields are required.' });

    if (newPassword.length < 6)
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });

    const user = await User.findById(req.user.id).select('+password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: 'Current password is incorrect.' });

    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save({ validateBeforeSave: false });

    res.status(200).json({ success: true, message: 'Password changed successfully!', data: null });
  } catch (err) {
    console.error('[ChangePassword Error]', err.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ── POST /api/auth/forgot-password ──────────────────────────────────────────
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ success: false, message: 'Email is required.' });

    const user = await User.findOne({ email });
    if (!user)
      // Return success anyway to not reveal if email exists
      return res.status(200).json({ success: true, message: 'If this email is registered, a reset link has been sent.' });

    // Generate a simple reset token (in production use crypto.randomBytes)
    const crypto = require('crypto');
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    user.reset_password_token = token;
    user.reset_password_expires = expires;
    await user.save({ validateBeforeSave: false });

    // In production: send email with reset link
    // For now: return token in response (demo mode)
    console.log(`[ForgotPassword] Reset token for ${email}: ${token}`);

    res.status(200).json({
      success: true,
      message: 'If this email is registered, a reset link has been sent.',
      // Remove this in production:
      data: process.env.NODE_ENV !== 'production' ? { reset_token: token } : null,
    });
  } catch (err) {
    console.error('[ForgotPassword Error]', err.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ── POST /api/auth/reset-password ───────────────────────────────────────────
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword)
      return res.status(400).json({ success: false, message: 'Token and new password are required.' });

    if (newPassword.length < 6)
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });

    const user = await User.findOne({
      reset_password_token: token,
      reset_password_expires: { $gt: new Date() },
    });

    if (!user)
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token.' });

    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(newPassword, salt);
    user.reset_password_token = null;
    user.reset_password_expires = null;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({ success: true, message: 'Password reset successfully! You can now log in.', data: null });
  } catch (err) {
    console.error('[ResetPassword Error]', err.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};
