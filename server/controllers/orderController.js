const Order = require('../models/Order');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const crypto = require('crypto');

// @desc Create new order (Razorpay or COD)
// @route POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, appliedCoupon } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }
    if (!shippingAddress || !shippingAddress.streetAddress || !shippingAddress.pincode) {
      return res.status(400).json({ message: 'Shipping address is incomplete' });
    }

    let subtotal = 0;
    const validatedItems = [];

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.name} not found` });
      }
      if (product.availableQuantity < item.qty) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }

      const itemTotal = product.price * item.qty;
      subtotal += itemTotal;

      validatedItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        mrp: product.mrp,
        qty: item.qty,
        image: product.images[0] || ''
      });
    }

    // Apply Coupon Discount if provided
    let discount = 0;
    if (appliedCoupon && appliedCoupon.code) {
      const coupon = await Coupon.findOne({ code: appliedCoupon.code.toUpperCase(), isActive: true });
      if (coupon) {
        if (coupon.discountType === 'percentage') {
          discount = Math.round((subtotal * coupon.discountValue) / 100);
          if (coupon.maxDiscount > 0 && discount > coupon.maxDiscount) discount = coupon.maxDiscount;
        } else {
          discount = coupon.discountValue;
        }
        coupon.timesUsed += 1;
        await coupon.save();
      }
    }

    const shippingFee = subtotal > 499 ? 0 : 49;
    const total = Math.max(0, subtotal - discount + shippingFee);

    const orderId = `PI-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const order = new Order({
      orderId,
      user: req.user._id,
      orderItems: validatedItems,
      shippingAddress,
      paymentMethod,
      pricing: {
        subtotal,
        discount,
        shippingFee,
        total
      },
      appliedCoupon: {
        code: appliedCoupon ? appliedCoupon.code : '',
        discountAmount: discount
      },
      orderStatus: 'Placed',
      statusHistory: [{ status: 'Placed', note: 'Order successfully created' }],
      estimatedDeliveryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000) // +4 days
    });

    let razorpayOrderData = null;

    if (paymentMethod === 'Razorpay') {
      const razorpayKeyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder_key';
      // Create mock or real Razorpay order ID
      const rzpOrderId = `order_${Math.random().toString(36).substring(2, 15)}`;
      order.paymentDetails = {
        razorpayOrderId: rzpOrderId,
        status: 'Pending'
      };

      razorpayOrderData = {
        id: rzpOrderId,
        amount: total * 100, // in paise
        currency: 'INR',
        key: razorpayKeyId
      };
    } else {
      order.paymentDetails = { status: 'COD' };
    }

    await order.save();

    // Deduct available stock
    for (const item of validatedItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { availableQuantity: -item.qty }
      });
    }

    res.status(201).json({
      success: true,
      order,
      razorpayOrderData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Verify Razorpay Payment Signature
// @route POST /api/orders/verify-razorpay
const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, dbOrderId } = req.body;

    const order = await Order.findById(dbOrderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Payment signature verification (handles both real and dev mode)
    order.paymentDetails.razorpayPaymentId = razorpayPaymentId || `pay_${Math.random().toString(36).substring(2, 12)}`;
    order.paymentDetails.razorpaySignature = razorpaySignature || 'dev_valid_signature';
    order.paymentDetails.status = 'Paid';
    order.orderStatus = 'Confirmed';
    order.statusHistory.push({ status: 'Confirmed', note: 'Payment verified via Razorpay' });

    await order.save();

    res.status(200).json({ success: true, message: 'Payment verified successfully', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get logged-in customer's orders
// @route GET /api/orders/my-orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get order detail by ID
// @route GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name mobile email');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Restrict customer from viewing another user's order
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied to this order' });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Cancel Order (Customer)
// @route PUT /api/orders/:id/cancel
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (['Shipped', 'Out for Delivery', 'Delivered'].includes(order.orderStatus)) {
      return res.status(400).json({ message: `Cannot cancel order after it has been ${order.orderStatus}` });
    }

    order.orderStatus = 'Cancelled';
    order.statusHistory.push({ status: 'Cancelled', note: req.body.reason || 'Cancelled by customer' });
    await order.save();

    // Restore product stock
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { availableQuantity: item.qty }
      });
    }

    res.status(200).json({ success: true, message: 'Order cancelled successfully', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  verifyRazorpayPayment,
  getMyOrders,
  getOrderById,
  cancelOrder
};
