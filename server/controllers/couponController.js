const Coupon = require('../models/Coupon');

// @desc Validate coupon code at checkout
// @route POST /api/coupons/validate
const validateCoupon = async (req, res) => {
  const { code, cartSubtotal } = req.body;
  if (!code) return res.status(400).json({ message: 'Coupon code is required' });

  try {
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) {
      return res.status(404).json({ message: 'Invalid or expired coupon code' });
    }

    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({ message: 'This coupon has expired' });
    }

    if (coupon.timesUsed >= coupon.totalUsageLimit) {
      return res.status(400).json({ message: 'Coupon usage limit reached' });
    }

    if (cartSubtotal < coupon.minOrderAmount) {
      return res.status(400).json({
        message: `Minimum order value of ₹${coupon.minOrderAmount} required for this coupon`
      });
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = Math.round((cartSubtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscount > 0 && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    if (discountAmount > cartSubtotal) {
      discountAmount = cartSubtotal;
    }

    res.status(200).json({
      success: true,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount,
      message: `Coupon '${coupon.code}' applied! You saved ₹${discountAmount}`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Claim single-use 10% Instagram follow coupon for logged in user
// @route POST /api/coupons/claim-instagram
const claimInstagramCoupon = async (req, res) => {
  try {
    const userId = req.user._id;

    // Check if user already claimed an Instagram coupon
    const existingCoupon = await Coupon.findOne({
      isInstagramCoupon: true,
      assignedToUser: userId
    });

    if (existingCoupon) {
      return res.status(200).json({
        success: true,
        code: existingCoupon.code,
        message: 'You have already unlocked your 10% Instagram coupon!',
        alreadyClaimed: true
      });
    }

    // Generate unique single-use code
    const uniqueSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    const code = `PARAMPARA-INSTA10-${uniqueSuffix}`;

    const newCoupon = new Coupon({
      code,
      discountType: 'percentage',
      discountValue: 10,
      minOrderAmount: 299,
      maxDiscount: 500,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      usageLimitPerUser: 1,
      totalUsageLimit: 1,
      isInstagramCoupon: true,
      assignedToUser: userId
    });

    await newCoupon.save();

    res.status(201).json({
      success: true,
      code: newCoupon.code,
      discountValue: 10,
      message: 'Congratulations! Your 10% off Instagram coupon is unlocked.',
      alreadyClaimed: false
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all coupons (Admin)
// @route GET /api/coupons/admin/all
const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, coupons });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create coupon (Admin)
// @route POST /api/coupons/admin/create
const createCoupon = async (req, res) => {
  try {
    const { code, discountType, discountValue, minOrderAmount, maxDiscount, expiryDate, totalUsageLimit } = req.body;

    const couponExists = await Coupon.findOne({ code: code.toUpperCase() });
    if (couponExists) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }

    const coupon = new Coupon({
      code: code.toUpperCase(),
      discountType,
      discountValue,
      minOrderAmount: minOrderAmount || 0,
      maxDiscount: maxDiscount || 0,
      expiryDate: expiryDate || new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      totalUsageLimit: totalUsageLimit || 1000
    });

    await coupon.save();
    res.status(201).json({ success: true, coupon });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Toggle coupon status / delete (Admin)
// @route DELETE /api/coupons/admin/:id
const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });

    await coupon.deleteOne();
    res.status(200).json({ success: true, message: 'Coupon deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  validateCoupon,
  claimInstagramCoupon,
  getCoupons,
  createCoupon,
  deleteCoupon
};
