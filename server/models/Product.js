const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, required: true },
  category: { type: String, required: true }, // e.g. 'Rakhis', 'Gifts', 'Sweets', 'Combos'
  subCategory: { type: String, default: '' },
  images: [{ type: String, required: true }],
  price: { type: Number, required: true, min: 0 },
  mrp: { type: Number, required: true, min: 0 },
  availableQuantity: { type: Number, required: true, default: 50 },
  sku: { type: String, required: true, unique: true },
  isActive: { type: Boolean, default: true },
  festivalTag: { type: String, default: 'Raksha Bandhan' }, // e.g., 'Raksha Bandhan', 'Diwali', 'Holi'
  badge: { type: String, default: '' }, // e.g., 'Rakhi Special', 'Limited Edition', 'Bestseller'
  rating: { type: Number, default: 4.8 },
  numReviews: { type: Number, default: 0 },
  tags: [{ type: String }]
}, { timestamps: true });

productSchema.index({ name: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Product', productSchema);
