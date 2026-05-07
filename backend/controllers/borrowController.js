const asyncHandler = require('express-async-handler');
const BorrowRecord = require('../models/BorrowRecord');
const Book = require('../models/Book');
const User = require('../models/User');
const { calculateOverdueDays, calculateFine } = require('../utils/dateUtils');
const logActivity = require('../utils/activityLogger');

const syncOverdueRecords = async () => {
  const borrowedRecords = await BorrowRecord.find({ status: 'borrowed' }).populate('book user');
  const now = new Date();
  for (const record of borrowedRecords) {
    if (new Date(record.dueDate) < now) {
      record.status = 'overdue';
      record.overdueDays = calculateOverdueDays(record.dueDate, now);
      record.fineAmount = calculateFine(record.overdueDays);
      await record.save();
    }
  }
};

const borrowBook = asyncHandler(async (req, res) => {
  const { userId, bookId, dueDate } = req.body;
  const book = await Book.findById(bookId);
  const user = await User.findById(userId);

  if (!book || !user) return res.status(404).json({ success: false, message: 'User or book not found' });
  if (book.availableCopies <= 0) return res.status(400).json({ success: false, message: 'Book is not available' });

  const activeBorrow = await BorrowRecord.findOne({ user: userId, book: bookId, status: { $in: ['borrowed', 'overdue'] } });
  if (activeBorrow) return res.status(400).json({ success: false, message: 'User already borrowed this book' });

  book.availableCopies -= 1;
  book.status = book.availableCopies > 0 ? 'available' : 'unavailable';
  await book.save();

  const record = await BorrowRecord.create({ user: userId, book: bookId, dueDate, issuedBy: req.user._id, status: 'borrowed' });
  await logActivity({ user: req.user._id, action: 'borrow_book', description: `Issued ${book.title} to ${user.fullName}`, entityType: 'BorrowRecord', entityId: record._id });

  res.status(201).json({ success: true, record });
});

const getBorrowRecords = asyncHandler(async (req, res) => {
  await syncOverdueRecords();
  const records = await BorrowRecord.find().populate('user book issuedBy receivedBy', 'fullName email title author');
  res.json({ success: true, records });
});

const getMyRecords = asyncHandler(async (req, res) => {
  await syncOverdueRecords();
  const records = await BorrowRecord.find({ user: req.user._id }).populate('book', 'title author isbn');
  res.json({ success: true, records });
});

const getActiveBorrowRecords = asyncHandler(async (req, res) => {
  await syncOverdueRecords();
  const records = await BorrowRecord.find({ status: { $in: ['borrowed', 'overdue'] } }).populate('user book', 'fullName title author');
  res.json({ success: true, records });
});

const getOverdueRecords = asyncHandler(async (req, res) => {
  await syncOverdueRecords();
  const records = await BorrowRecord.find({ status: 'overdue' }).populate('user book', 'fullName title author');
  res.json({ success: true, records });
});

const returnBook = asyncHandler(async (req, res) => {
  const record = await BorrowRecord.findById(req.params.id).populate('book user');
  if (!record) return res.status(404).json({ success: false, message: 'Borrow record not found' });
  if (record.status === 'returned') return res.status(400).json({ success: false, message: 'Book already returned' });

  const returnedDate = new Date();
  const overdueDays = calculateOverdueDays(record.dueDate, returnedDate);
  const fineAmount = calculateFine(overdueDays);

  record.returnedDate = returnedDate;
  record.status = overdueDays > 0 ? 'overdue' : 'returned';
  record.receivedBy = req.user._id;
  record.overdueDays = overdueDays;
  record.fineAmount = fineAmount;
  await record.save();

  const book = await Book.findById(record.book._id);
  book.availableCopies += 1;
  book.status = book.availableCopies > 0 ? 'available' : 'unavailable';
  await book.save();

  await logActivity({ user: req.user._id, action: 'return_book', description: `Returned ${book.title} from ${record.user.fullName}`, entityType: 'BorrowRecord', entityId: record._id });

  res.json({ success: true, record });
});

const getBorrowRecordById = asyncHandler(async (req, res) => {
  const record = await BorrowRecord.findById(req.params.id).populate('user book issuedBy receivedBy', 'fullName email title author');
  if (!record) return res.status(404).json({ success: false, message: 'Borrow record not found' });
  res.json({ success: true, record });
});

module.exports = { borrowBook, getBorrowRecords, getMyRecords, getActiveBorrowRecords, getOverdueRecords, returnBook, getBorrowRecordById };
