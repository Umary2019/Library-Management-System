const asyncHandler = require('express-async-handler');
const Book = require('../models/Book');
const User = require('../models/User');
const BorrowRecord = require('../models/BorrowRecord');

const getBooksReport = asyncHandler(async (req, res) => {
  const books = await Book.find().populate('category', 'name');
  res.json({ success: true, total: books.length, books });
});

const getBorrowedReport = asyncHandler(async (req, res) => {
  const records = await BorrowRecord.find({ status: { $in: ['borrowed', 'overdue'] } }).populate('user book');
  res.json({ success: true, total: records.length, records });
});

const getReturnedReport = asyncHandler(async (req, res) => {
  const records = await BorrowRecord.find({ status: 'returned' }).populate('user book');
  res.json({ success: true, total: records.length, records });
});

const getOverdueReport = asyncHandler(async (req, res) => {
  const records = await BorrowRecord.find({ status: 'overdue' }).populate('user book');
  res.json({ success: true, total: records.length, records });
});

const getUsersReport = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.json({ success: true, total: users.length, users });
});

const getMonthlyReport = asyncHandler(async (req, res) => {
  const records = await BorrowRecord.aggregate([
    {
      $group: {
        _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
        borrowed: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } }
  ]);
  res.json({ success: true, records });
});

module.exports = { getBooksReport, getBorrowedReport, getReturnedReport, getOverdueReport, getUsersReport, getMonthlyReport };
