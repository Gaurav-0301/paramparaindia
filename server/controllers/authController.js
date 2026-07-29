const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'parampara_secret_key_2026_festive_luxury', {
    expiresIn: '30d'
  });
};

// @desc Send OTP to mobile number
// @route POST /api/auth/send-otp
const sendOTP = async (req, res) => {
  const { mobile } = req.body;
  if (!mobile || mobile.length < 10) {
    return res.status(400).json({ message: 'Please provide a valid 10-digit mobile number' });
  }

  const cleanMobile = mobile.replace(/\D/g, '').slice(-10);
  const dummyOTP = cleanMobile === '9999999999' ? '999999' : '123456'; // Default dev OTP
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  try {
    let user = await User.findOne({ mobile: cleanMobile });
    if (!user) {
      // Auto-assign admin role to specific seed mobile number if requested
      const role = cleanMobile === '9999999999' ? 'admin' : 'customer';
      const name = role === 'admin' ? 'Parampara Admin' : 'Festive Shopper';
      user = new User({
        mobile: cleanMobile,
        name,
        role,
        otp: dummyOTP,
        otpExpires
      });
    } else {
      user.otp = dummyOTP;
      user.otpExpires = otpExpires;
    }

    await user.save();

    // If Twilio credentials are standard live environment, try Twilio call, otherwise log OTP
    console.log(`[AUTH-OTP] Sent OTP ${dummyOTP} to mobile +91-${cleanMobile}`);

    res.status(200).json({
      success: true,
      message: `OTP sent successfully to +91 ${cleanMobile}`,
      devNotice: 'In test mode, enter 123456 (or 999999 for Admin)'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Verify OTP & generate JWT token
// @route POST /api/auth/verify-otp
const verifyOTP = async (req, res) => {
  const { mobile, otp } = req.body;
  if (!mobile || !otp) {
    return res.status(400).json({ message: 'Mobile and OTP are required' });
  }

  const cleanMobile = mobile.replace(/\D/g, '').slice(-10);

  try {
    const user = await User.findOne({ mobile: cleanMobile });
    if (!user) {
      return res.status(404).json({ message: 'Mobile number not found. Request a new OTP.' });
    }

    // Verify OTP (allow '123456' in dev or matching stored OTP)
    if (user.otp !== otp && otp !== '123456' && !(cleanMobile === '9999999999' && otp === '999999')) {
      return res.status(400).json({ message: 'Invalid OTP entered. Please try again.' });
    }

    if (user.otpExpires && user.otpExpires < new Date()) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new code.' });
    }

    // Clear OTP after successful login
    user.otp = undefined;
    user.otpExpires = undefined;
    user.isVerified = true;
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        mobile: user.mobile,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        savedAddresses: user.savedAddresses,
        wishlist: user.wishlist
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get Current Logged In User
// @route GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update Profile Info
// @route PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = req.body.name || user.name;
    user.email = req.body.email !== undefined ? req.body.email : user.email;
    user.profileImage = req.body.profileImage || user.profileImage;

    await user.save();
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Address Book Management
// @route POST /api/auth/address
const addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { label, fullName, mobile, streetAddress, landmark, city, state, pincode, isDefault } = req.body;

    if (isDefault) {
      user.savedAddresses.forEach(addr => addr.isDefault = false);
    }

    const newAddress = {
      label: label || 'Home',
      fullName,
      mobile,
      streetAddress,
      landmark: landmark || '',
      city,
      state,
      pincode,
      isDefault: isDefault || user.savedAddresses.length === 0
    };

    user.savedAddresses.push(newAddress);
    await user.save();
    res.status(201).json({ success: true, savedAddresses: user.savedAddresses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route DELETE /api/auth/address/:addressId
const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.savedAddresses = user.savedAddresses.filter(addr => addr._id.toString() !== req.params.addressId);
    await user.save();
    res.status(200).json({ success: true, savedAddresses: user.savedAddresses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/auth/wishlist/:productId
const toggleWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const productId = req.params.productId;
    const index = user.wishlist.indexOf(productId);

    if (index > -1) {
      user.wishlist.splice(index, 1);
    } else {
      user.wishlist.push(productId);
    }

    await user.save();
    const updatedUser = await User.findById(req.user._id).populate('wishlist');
    res.status(200).json({ success: true, wishlist: updatedUser.wishlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendOTP,
  verifyOTP,
  getMe,
  updateProfile,
  addAddress,
  deleteAddress,
  toggleWishlist
};
