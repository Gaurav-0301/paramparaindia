const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  label: { type: String, enum: ['Home', 'Work', 'Other'], default: 'Home' },
  fullName: { type: String, required: true },
  mobile: { type: String, required: true },
  streetAddress: { type: String, required: true },
  landmark: { type: String, default: '' },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  name: { type: String, default: 'Festive Shopper' },
  mobile: { type: String, required: true, unique: true },
  email: { type: String, default: '' },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  profileImage: { type: String, default: '' },
  isVerified: { type: Boolean, default: true },
  otp: { type: String },
  otpExpires: { type: Date },
  savedAddresses: [addressSchema],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
