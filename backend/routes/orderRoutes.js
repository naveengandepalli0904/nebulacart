const express = require('express');
const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// @POST /api/orders - Create order
router.post('/', protect, asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, couponCode } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400); throw new Error('No order items');
  }

  // Calculate prices
  const itemsPrice = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingPrice = itemsPrice > 999 ? 0 : 99;
  const taxPrice = Math.round(itemsPrice * 0.18);
  let discountAmount = 0;

  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
    if (coupon) {
      const validity = coupon.isValid(itemsPrice);
      if (validity.valid) {
        discountAmount = coupon.calculateDiscount(itemsPrice);
        coupon.usedCount += 1;
        await coupon.save();
      }
    }
  }

  const totalPrice = itemsPrice + shippingPrice + taxPrice - discountAmount;

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    discountAmount,
    totalPrice,
    couponCode: couponCode?.toUpperCase(),
  });

  // Update product stock
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity, sold: item.quantity },
    });
  }

  res.status(201).json(order);
}));

// @GET /api/orders/my - Get current user orders
router.get('/my', protect, asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
}));

// @GET /api/orders/:id
router.get('/:id', protect, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) { res.status(404); throw new Error('Order not found'); }
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403); throw new Error('Not authorized');
  }
  res.json(order);
}));

// @PUT /api/orders/:id/pay - Mark as paid
router.put('/:id/pay', protect, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error('Order not found'); }
  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = { id: req.body.id, status: req.body.status, updateTime: req.body.update_time, emailAddress: req.body.email };
  const updated = await order.save();
  res.json(updated);
}));

// ADMIN ROUTES
// @GET /api/orders/admin/all
router.get('/admin/all', protect, adminOnly, asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const query = status ? { status } : {};
  const total = await Order.countDocuments(query);
  const orders = await Order.find(query)
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit));
  res.json({ orders, total });
}));

// @PUT /api/orders/:id/status - Update order status (admin)
router.put('/:id/status', protect, adminOnly, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error('Order not found'); }
  order.status = req.body.status;
  if (req.body.status === 'Delivered') order.deliveredAt = Date.now();
  if (req.body.trackingNumber) order.trackingNumber = req.body.trackingNumber;
  const updated = await order.save();
  res.json(updated);
}));

// @GET /api/orders/admin/analytics
router.get('/admin/analytics', protect, adminOnly, asyncHandler(async (req, res) => {
  const totalRevenue = await Order.aggregate([
    { $match: { isPaid: true } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } },
  ]);

  const ordersByStatus = await Order.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const revenueByMonth = await Order.aggregate([
    { $match: { isPaid: true } },
    { $group: { _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } }, revenue: { $sum: '$totalPrice' }, orders: { $sum: 1 } } },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 12 },
  ]);

  const totalOrders = await Order.countDocuments();
  const totalUsers = await require('../models/User').countDocuments({ role: 'user' });
  const totalProducts = await Product.countDocuments({ isActive: true });

  res.json({
    totalRevenue: totalRevenue[0]?.total || 0,
    totalOrders,
    totalUsers,
    totalProducts,
    ordersByStatus,
    revenueByMonth,
  });
}));

module.exports = router;
