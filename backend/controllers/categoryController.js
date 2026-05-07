const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');
const logActivity = require('../utils/activityLogger');

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  res.json({ success: true, categories });
});

const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  await logActivity({ user: req.user._id, action: 'create_category', description: `Created category ${category.name}`, entityType: 'Category', entityId: category._id });
  res.status(201).json({ success: true, category });
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
  await logActivity({ user: req.user._id, action: 'update_category', description: `Updated category ${category.name}`, entityType: 'Category', entityId: category._id });
  res.json({ success: true, category });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
  await logActivity({ user: req.user._id, action: 'delete_category', description: `Deleted category ${category.name}`, entityType: 'Category', entityId: category._id });
  res.json({ success: true, message: 'Category deleted' });
});

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
