const express = require('express');
const router = express.Router();
const {
  getAnalyticsData,
  getAdminOrders,
  updateOrderStatus,
  exportOrdersCSV,
  getAdminUsers
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/adminOnly');

router.use(protect, adminOnly);

router.get('/analytics', getAnalyticsData);
router.get('/orders', getAdminOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.get('/orders/export-csv', exportOrdersCSV);
router.get('/users', getAdminUsers);

module.exports = router;
