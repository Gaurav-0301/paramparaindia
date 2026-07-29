const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  discountType: { type: String, enum: ['percentage', 'flat'], required: true },
  discountValue: { type: Number, required: true, min: 0 },
  minOrderAmount: { type: Number, default: 0 },
  maxDiscount: { type: Number, default: 0 }, // max discount limit for percentage coupons
  expiryDate: { type: Date, required: true },
  usageLimitPerUser: { type: Number, default: 1 },
  totalUsageLimit: { type: Number, default: 1000 },
  timesUsed: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isInstagramCoupon: { type: Boolean, default: false },
  assignedToUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);
