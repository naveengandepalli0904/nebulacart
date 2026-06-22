const express = require('express');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// @GET /api/users - Admin get all users
router.get('/', protect, adminOnly, asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  res.json(users);
}));

// @PUT /api/users/:id - Admin toggle user status
router.put('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) { res.status(404); throw new Error('User not found'); }
  user.role = req.body.role || user.role;
  user.isActive = req.body.isActive !== undefined ? req.body.isActive : user.isActive;
  await user.save();
  res.json({ message: 'User updated' });
}));

// @POST /api/users/address - Add address
router.post('/address', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (req.body.isDefault) {
    user.addresses.forEach(addr => { addr.isDefault = false; });
  }
  user.addresses.push(req.body);
  await user.save();
  res.status(201).json(user.addresses);
}));

// @DELETE /api/users/address/:addressId - Delete address
router.delete('/address/:addressId', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.addresses = user.addresses.filter(a => a._id.toString() !== req.params.addressId);
  await user.save();
  res.json(user.addresses);
}));

// @PUT /api/users/wishlist/:productId - Toggle wishlist
router.put('/wishlist/:productId', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const idx = user.wishlist.indexOf(req.params.productId);
  if (idx > -1) { user.wishlist.splice(idx, 1); }
  else { user.wishlist.push(req.params.productId); }
  await user.save();
  res.json(user.wishlist);
}));

module.exports = router;
