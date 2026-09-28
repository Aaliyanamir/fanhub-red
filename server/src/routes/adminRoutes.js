const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

// Protected admin routes
router.get('/dashboard-stats', adminController.getDashboardStats);
router.get('/submissions', protect, adminOnly, adminController.getSubmissions);
router.patch('/submissions/:id', protect, adminOnly, adminController.moderateSubmission);
router.get('/users', protect, adminOnly, adminController.getUsers);
router.patch('/users/:id', protect, adminOnly, adminController.updateUserRole);
router.get('/feedback', protect, adminOnly, adminController.getFeedbacks);
router.post('/seed-stream', protect, adminOnly, adminController.seedStream);

module.exports = router;
