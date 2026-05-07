const asyncHandler = require('express-async-handler');
const Book = require('../models/Book');
const User = require('../models/User');
const BorrowRecord = require('../models/BorrowRecord');
const ActivityLog = require('../models/ActivityLog');

const getAdminDashboard = asyncHandler(async (req, res) => {
  const [totalBooks, totalUsers, totalLibrarians, totalStudents, borrowedBooks, returnedBooks, overdueBooks, recentActivities] = await Promise.all([
    Book.countDocuments(),
    User.countDocuments(),
    User.countDocuments({ role: 'librarian' }),
    User.countDocuments({ role: 'student' }),
    BorrowRecord.countDocuments({ status: { $in: ['borrowed', 'overdue'] } }),
    BorrowRecord.countDocuments({ status: 'returned' }),
    BorrowRecord.countDocuments({ status: 'overdue' }),
    ActivityLog.find().populate('user', 'fullName role').sort({ createdAt: -1 }).limit(10)
  ]);

  const borrowStats = await BorrowRecord.aggregate([
    {
      $group: {
        _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  const availabilityStats = [
    { name: 'Available', value: await Book.countDocuments({ availableCopies: { $gt: 0 } }) },
    { name: 'Unavailable', value: await Book.countDocuments({ availableCopies: 0 }) }
  ];

  res.json({
    success: true,
    stats: { totalBooks, totalUsers, totalLibrarians, totalStudents, borrowedBooks, returnedBooks, overdueBooks },
    recentActivities,
    borrowStats,
    availabilityStats
  });
});

const getLibrarianDashboard = asyncHandler(async (req, res) => {
  const [totalBooks, availableBooks, borrowedBooks, returnedBooks, overdueBooks, recentBorrowRecords, recentReturnRecords] = await Promise.all([
    Book.countDocuments(),
    Book.countDocuments({ availableCopies: { $gt: 0 } }),
    BorrowRecord.countDocuments({ status: { $in: ['borrowed', 'overdue'] } }),
    BorrowRecord.countDocuments({ status: 'returned' }),
    BorrowRecord.countDocuments({ status: 'overdue' }),
    BorrowRecord.find({ status: { $in: ['borrowed', 'overdue'] } }).populate('user book', 'fullName title').sort({ createdAt: -1 }).limit(5),
    BorrowRecord.find({ status: 'returned' }).populate('user book', 'fullName title').sort({ returnedDate: -1 }).limit(5)
  ]);

  res.json({ success: true, stats: { totalBooks, availableBooks, borrowedBooks, returnedBooks, overdueBooks }, recentBorrowRecords, recentReturnRecords });
});

const getStudentDashboard = asyncHandler(async (req, res) => {
  const [availableBooks, myBorrowedBooks, overdueBooks, recommendedBooks] = await Promise.all([
    Book.countDocuments({ availableCopies: { $gt: 0 } }),
    BorrowRecord.find({ user: req.user._id }).populate('book', 'title author dueDate').sort({ createdAt: -1 }).limit(10),
    BorrowRecord.find({ user: req.user._id, status: 'overdue' }).populate('book', 'title author dueDate'),
    Book.find({ availableCopies: { $gt: 0 } }).populate('category', 'name').sort({ createdAt: -1 }).limit(6)
  ]);

  res.json({ success: true, stats: { availableBooks, myBorrowedCount: myBorrowedBooks.length, overdueCount: overdueBooks.length }, myBorrowedBooks, overdueBooks, recommendedBooks });
});

module.exports = { getAdminDashboard, getLibrarianDashboard, getStudentDashboard };
