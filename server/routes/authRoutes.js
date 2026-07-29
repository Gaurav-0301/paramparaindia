const express = require('express');
const router = express.Router();
const {
  sendOTP,
  verifyOTP,
  getMe,
  updateProfile,
  addAddress,
  deleteAddress,
  toggleWishlist
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/address', protect, addAddress);
router.delete('/address/:addressId', protect, deleteAddress);
router.put('/wishlist/:productId', protect, toggleWishlist);

module.exports = router;
