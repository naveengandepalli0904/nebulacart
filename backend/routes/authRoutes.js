const express = require('express');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { generateToken, protect } = require('../middleware/authMiddleware');

const router = express.Router();

// @POST /api/auth/register
router.post('/register', asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) { res.status(400); throw new Error('Email already registered'); }

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);

  res.status(201).json({
    _id: user._id, name: user.name, email: user.email,
    role: user.role, token,
  });
}));

// @POST /api/auth/login
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    res.status(401); throw new Error('Invalid email or password');
  }
  if (!user.isActive) { res.status(403); throw new Error('Account has been deactivated'); }

  const token = generateToken(user._id);
  res.json({
    _id: user._id, name: user.name, email: user.email,
    role: user.role, avatar: user.avatar, token,
  });
}));

// @GET /api/auth/me
router.get('/me', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json(user);
}));

// @PUT /api/auth/profile
router.put('/profile', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  if (req.body.password) user.password = req.body.password;
  if (req.body.avatar) user.avatar = req.body.avatar;
  const updated = await user.save();
  const token = generateToken(updated._id);
  res.json({
    _id: updated._id, name: updated.name, email: updated.email,
    role: updated.role, avatar: updated.avatar, token,
  });
}));

module.exports = router;
