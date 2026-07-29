const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductByIdentifier,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/adminOnly');

// Public routes
router.get('/', getProducts);
router.get('/:identifier', getProductByIdentifier);

// Admin routes
router.post('/admin/create', protect, adminOnly, createProduct);
router.put('/admin/:id', protect, adminOnly, updateProduct);
router.delete('/admin/:id', protect, adminOnly, deleteProduct);

module.exports = router;
