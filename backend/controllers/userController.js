const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { sanitizeUser } = require('./authController');
const logActivity = require('../utils/activityLogger');

const getUsers = asyncHandler(async (req, res) => {
  const { role, status, search } = req.query;
  const filter = {};
  if (role) filter.role = role;
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { registrationNumber: { $regex: search, $options: 'i' } }
    ];
  }

  const users = await User.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, users: users.map(sanitizeUser) });
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, user: sanitizeUser(user) });
});

const createLibrarian = asyncHandler(async (req, res) => {
  const payload = { ...req.body, role: 'librarian' };
  const user = await User.create(payload);
  await logActivity({ user: req.user._id, action: 'create_librarian', description: `Created librarian ${user.fullName}`, entityType: 'User', entityId: user._id });
  res.status(201).json({ success: true, user: sanitizeUser(user) });
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  ['fullName', 'email', 'phone', 'registrationNumber', 'department', 'level', 'address', 'role', 'status'].forEach((field) => {
    if (req.body[field] !== undefined) user[field] = req.body[field];
  });
  if (req.body.password) user.password = req.body.password;

  const updated = await user.save();
  await logActivity({ user: req.user._id, action: 'update_user', description: `Updated user ${updated.fullName}`, entityType: 'User', entityId: updated._id });
  res.json({ success: true, user: sanitizeUser(updated) });
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  await logActivity({ user: req.user._id, action: 'delete_user', description: `Deleted user ${user.fullName}`, entityType: 'User', entityId: user._id });
  res.json({ success: true, message: 'User deleted' });
});

const updateUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  user.status = req.body.status;
  const updated = await user.save();
  await logActivity({ user: req.user._id, action: 'status_change', description: `Changed user status to ${updated.status}`, entityType: 'User', entityId: updated._id });
  res.json({ success: true, user: sanitizeUser(updated) });
});

module.exports = { getUsers, getUserById, createLibrarian, updateUser, deleteUser, updateUserStatus };
