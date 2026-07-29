const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { Parser } = require('json2csv');

// @desc Aggregated graph analytics for admin dashboard
// @route GET /api/admin/analytics
const getAnalyticsData = async (req, res) => {
  try {
    // KPI summary stats
    const totalOrdersCount = await Order.countDocuments();
    
    const revenueAgg = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$pricing.total' } } }
    ]);
    const totalRevenue = revenueAgg[0] ? revenueAgg[0].totalRevenue : 0;

    const pendingCodAgg = await Order.aggregate([
      { $match: { paymentMethod: 'COD', orderStatus: { $nin: ['Delivered', 'Cancelled'] } } },
      { $group: { _id: null, totalPending: { $sum: '$pricing.total' } } }
    ]);
    const pendingCodRevenue = pendingCodAgg[0] ? pendingCodAgg[0].totalPending : 0;

    const uniqueCustomersCount = await User.countDocuments({ role: 'customer' });
    const lowStockCount = await Product.countDocuments({ availableQuantity: { $lte: 10 } });

    // 1. Revenue & Orders Over Time (Last 30 Days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyStats = await Order.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo }, orderStatus: { $ne: 'Cancelled' } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$pricing.total' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // 2. Order Status Breakdown
    const statusBreakdown = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
    ]);

    // 3. Payment Method Split
    const paymentSplit = await Order.aggregate([
      { $group: { _id: '$paymentMethod', count: { $sum: 1 }, totalAmount: { $sum: '$pricing.total' } } }
    ]);

    // 4. Top Selling Products
    const topProducts = await Order.aggregate([
      { $unwind: '$orderItems' },
      {
        $group: {
          _id: '$orderItems.name',
          totalUnitsSold: { $sum: '$orderItems.qty' },
          totalRevenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.qty'] } }
        }
      },
      { $sort: { totalUnitsSold: -1 } },
      { $limit: 8 }
    ]);

    res.status(200).json({
      success: true,
      kpis: {
        totalOrdersCount,
        totalRevenue,
        pendingCodRevenue,
        uniqueCustomersCount,
        lowStockCount
      },
      dailyStats,
      statusBreakdown,
      paymentSplit,
      topProducts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all orders with filtering & search for admin
// @route GET /api/admin/orders
const getAdminOrders = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.orderStatus = status;
    }
    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { 'shippingAddress.fullName': { $regex: search, $options: 'i' } },
        { 'shippingAddress.mobile': { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const count = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name mobile email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      orders,
      page: Number(page),
      pages: Math.ceil(count / Number(limit)),
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update Order Status
// @route PUT /api/admin/orders/:id/status
const updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.orderStatus = status;
    order.statusHistory.push({
      status,
      note: note || `Order status updated to ${status} by admin`
    });

    await order.save();

    console.log(`[TWILIO-SMS] Triggered order status notification for ${order.shippingAddress.mobile}: "Your order ${order.orderId} is now ${status}."`);

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Export Orders as downloadable CSV file
// @route GET /api/admin/orders/export-csv
const exportOrdersCSV = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.orderStatus = status;
    }
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const orders = await Order.find(query).populate('user', 'name mobile email').sort({ createdAt: -1 });

    const csvData = orders.map(order => ({
      'Order ID': order.orderId,
      'Customer Name': order.shippingAddress.fullName,
      'Mobile': order.shippingAddress.mobile,
      'City': order.shippingAddress.city,
      'State': order.shippingAddress.state,
      'Pincode': order.shippingAddress.pincode,
      'Payment Method': order.paymentMethod,
      'Payment Status': order.paymentDetails ? order.paymentDetails.status : 'N/A',
      'Order Status': order.orderStatus,
      'Subtotal (INR)': order.pricing.subtotal,
      'Discount (INR)': order.pricing.discount,
      'Total Amount (INR)': order.pricing.total,
      'Items Count': order.orderItems.length,
      'Order Items': order.orderItems.map(i => `${i.name} (x${i.qty})`).join('; '),
      'Created Date': new Date(order.createdAt).toLocaleString('en-IN')
    }));

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(csvData);

    res.header('Content-Type', 'text/csv');
    res.attachment(`Parampara_Orders_${new Date().toISOString().slice(0,10)}.csv`);
    return res.send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all registered customers for admin
// @route GET /api/admin/users
const getAdminUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'customer' }).sort({ createdAt: -1 });
    
    // Calculate total spend and order counts per user
    const usersWithStats = await Promise.all(users.map(async (u) => {
      const userOrders = await Order.find({ user: u._id, orderStatus: { $ne: 'Cancelled' } });
      const totalSpend = userOrders.reduce((sum, o) => sum + o.pricing.total, 0);
      return {
        _id: u._id,
        name: u.name,
        mobile: u.mobile,
        email: u.email,
        createdAt: u.createdAt,
        orderCount: userOrders.length,
        totalSpend
      };
    }));

    res.status(200).json({ success: true, users: usersWithStats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAnalyticsData,
  getAdminOrders,
  updateOrderStatus,
  exportOrdersCSV,
  getAdminUsers
};
