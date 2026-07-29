const express = require('express');
const router = express.Router();
const {
  createReview,
  getProductReviews,
  getAdminReviews,
  deleteReview
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/adminOnly');

router.post('/', protect, createReview);
router.get('/product/:productId', getProductReviews);

// Admin moderation
router.get('/admin/all', protect, adminOnly, getAdminReviews);
router.delete('/admin/:id', protect, adminOnly, deleteReview);

module.exports = router;
