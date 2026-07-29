const express = require('express');
const router = express.Router();
const {
  getActiveFestival,
  getAllFestivals,
  switchActiveFestival,
  updateFestivalTheme
} = require('../controllers/festivalController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/adminOnly');

router.get('/active', getActiveFestival);
router.get('/admin/all', protect, adminOnly, getAllFestivals);
router.post('/admin/switch', protect, adminOnly, switchActiveFestival);
router.post('/admin/update', protect, adminOnly, updateFestivalTheme);

module.exports = router;
