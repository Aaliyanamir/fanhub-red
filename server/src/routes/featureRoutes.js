const express = require('express');
const router = express.Router();
const featureController = require('../controllers/featureController');
const { protect } = require('../middleware/auth');

// Optional auth middleware helper
const optionalProtect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return protect(req, res, next);
  }
  next();
};

// Merchandise
router.get('/merchandise', featureController.getMerchandise);
router.post('/merchandise/:id/view', featureController.trackMerchView);

// Events
router.get('/events', featureController.getEvents);

// Submissions
router.post('/submissions', protect, featureController.createSubmission);
router.get('/submissions/my', protect, featureController.getUserSubmissions);

// Feedback
router.post('/feedback', optionalProtect, featureController.createFeedback);

// Chatbot
router.post('/chatbot', featureController.chatbotQuery);

module.exports = router;
