const express = require('express');
const asyncHandler = require('express-async-handler');
const Coupon = require('../models/Coupon');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// @POST /api/coupons/validate - Validate coupon
router.post('/validate', protect, asyncHandler(async (req, res) => {
  const { code, orderAmount } = req.body;
  const coupon = await Coupon.findOne({ code: code.toUpperCase() });
  if (!coupon) { res.status(404); throw new Error('Coupon not found'); }
  const validity = coupon.isValid(orderAmount);
  if (!validity.valid) { res.status(400); throw new Error(validity.message); }
  const discount = coupon.calculateDiscount(orderAmount);
  res.json({ valid: true, discount, coupon: { code: coupon.code, discountType: coupon.discountType, discountValue: coupon.discountValue } });
}));

// ADMIN ROUTES
router.get('/', protect, adminOnly, asyncHandler(async (req, res) => {
  const coupons = await Coupon.find({}).sort({ createdAt: -1 });
  res.json(coupons);
}));

router.post('/', protect, adminOnly, asyncHandler(async (req, res) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json(coupon);
}));

router.put('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!coupon) { res.status(404); throw new Error('Coupon not found'); }
  res.json(coupon);
}));

router.delete('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
  await Coupon.findByIdAndDelete(req.params.id);
  res.json({ message: 'Coupon deleted' });
}));

module.exports = router;
