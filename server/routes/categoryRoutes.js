const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryByIdentifier,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/adminOnly');

// Public routes
router.get('/', getCategories);
router.get('/:identifier', getCategoryByIdentifier);

// Admin routes
router.post('/admin/create', protect, adminOnly, createCategory);
router.put('/admin/:id', protect, adminOnly, updateCategory);
router.delete('/admin/:id', protect, adminOnly, deleteCategory);

module.exports = router;
