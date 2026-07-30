const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  parentCategory: { type: String, default: 'Special Collections' },
  image: { type: String, required: true },
  description: { type: String, default: '' },
  displayOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

categorySchema.index({ parentCategory: 1, displayOrder: 1 });

module.exports = mongoose.model('Category', categorySchema);
