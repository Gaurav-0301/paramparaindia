const express = require('express');
const router = express.Router();
const {
  validateCoupon,
  claimInstagramCoupon,
  getCoupons,
  createCoupon,
  deleteCoupon
} = require('../controllers/couponController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/adminOnly');

router.post('/validate', validateCoupon);
router.post('/claim-instagram', protect, claimInstagramCoupon);

// Admin routes
router.get('/admin/all', protect, adminOnly, getCoupons);
router.post('/admin/create', protect, adminOnly, createCoupon);
router.delete('/admin/:id', protect, adminOnly, deleteCoupon);

module.exports = router;
