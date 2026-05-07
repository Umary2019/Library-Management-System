const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const logActivity = require('../utils/activityLogger');

const sanitizeUser = (user) => ({
  _id: user._id,
  fullName: user.fullName,
  email: user.email,
  role: user.role,
  phone: user.phone,
  registrationNumber: user.registrationNumber,
  department: user.department,
  level: user.level,
  address: user.address,
  status: user.status,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

const register = asyncHandler(async (req, res) => {
  const { fullName, email, password, phone, registrationNumber, department, level, address } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ success: false, message: 'User already exists' });
  }

  const user = await User.create({
    fullName,
    email,
    password,
    phone,
    registrationNumber,
    department,
    level,
    address,
    role: 'student'
  });

  await logActivity({ user: user._id, action: 'register', description: 'New student registered', entityType: 'User', entityId: user._id });

  res.status(201).json({ success: true, token: generateToken(user._id), user: sanitizeUser(user) });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');

  if (!user || user.status !== 'active') {
    return res.status(401).json({ success: false, message: 'Invalid credentials or inactive account' });
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  await logActivity({ user: user._id, action: 'login', description: 'User logged in', entityType: 'User', entityId: user._id });

  res.json({ success: true, token: generateToken(user._id), user: sanitizeUser(user) });
});

const me = asyncHandler(async (req, res) => {
  res.json({ success: true, user: sanitizeUser(req.user) });
});

const updateProfile = asyncHandler(async (req, res) => {
  const fields = ['fullName', 'phone', 'registrationNumber', 'department', 'level', 'address'];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      req.user[field] = req.body[field];
    }
  });

  const updated = await req.user.save();
  await logActivity({ user: updated._id, action: 'update_profile', description: 'Profile updated', entityType: 'User', entityId: updated._id });
  res.json({ success: true, user: sanitizeUser(updated) });
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');
  const isMatch = await user.matchPassword(currentPassword);

  if (!isMatch) {
    return res.status(400).json({ success: false, message: 'Current password is incorrect' });
  }

  user.password = newPassword;
  await user.save();
  await logActivity({ user: user._id, action: 'change_password', description: 'Password changed', entityType: 'User', entityId: user._id });
  res.json({ success: true, message: 'Password updated successfully' });
});

module.exports = { register, login, me, updateProfile, changePassword, sanitizeUser };
