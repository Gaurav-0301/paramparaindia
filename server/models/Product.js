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
  tags: [{ type: String }],
  
  // Personalization Config
  isPersonalized: { type: Boolean, default: false },
  customizationLabel: { type: String, default: 'Customization Text (7 Chr)' },
  customizationMaxChars: { type: Number, default: 7 },
  customizationPlaceholder: { type: String, default: 'Plz Enter The Text' },
  customizationInstruction: { type: String, default: 'Type in a Word that You Would Like To Be Engraved onto Your Product (Only 7 Character)' }
}, { timestamps: true });

productSchema.index({ name: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Product', productSchema);
