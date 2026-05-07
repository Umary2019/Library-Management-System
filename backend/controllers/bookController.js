const asyncHandler = require('express-async-handler');
const Book = require('../models/Book');
const logActivity = require('../utils/activityLogger');

const buildFilter = (query) => {
  const filter = {};
  if (query.search) {
    filter.$or = [
      { title: { $regex: query.search, $options: 'i' } },
      { author: { $regex: query.search, $options: 'i' } },
      { isbn: { $regex: query.search, $options: 'i' } }
    ];
  }
  if (query.category) filter.category = query.category;
  if (query.status) filter.status = query.status;
  if (query.availability === 'available') filter.availableCopies = { $gt: 0 };
  if (query.author) filter.author = { $regex: query.author, $options: 'i' };
  return filter;
};

const getBooks = asyncHandler(async (req, res) => {
  const books = await Book.find(buildFilter(req.query)).populate('category createdBy', 'name fullName').sort({ createdAt: -1 });
  res.json({ success: true, books });
});

const getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id).populate('category createdBy', 'name fullName');
  if (!book) return res.status(404).json({ success: false, message: 'Book not found' });
  res.json({ success: true, book });
});

const createBook = asyncHandler(async (req, res) => {
  const book = await Book.create({ ...req.body, createdBy: req.user._id });
  await logActivity({ user: req.user._id, action: 'create_book', description: `Created book ${book.title}`, entityType: 'Book', entityId: book._id });
  res.status(201).json({ success: true, book });
});

const updateBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ success: false, message: 'Book not found' });
  Object.assign(book, req.body);
  if (req.body.availableCopies !== undefined) {
    book.status = req.body.availableCopies > 0 ? 'available' : 'unavailable';
  }
  const updated = await book.save();
  await logActivity({ user: req.user._id, action: 'update_book', description: `Updated book ${updated.title}`, entityType: 'Book', entityId: updated._id });
  res.json({ success: true, book: updated });
});

const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findByIdAndDelete(req.params.id);
  if (!book) return res.status(404).json({ success: false, message: 'Book not found' });
  await logActivity({ user: req.user._id, action: 'delete_book', description: `Deleted book ${book.title}`, entityType: 'Book', entityId: book._id });
  res.json({ success: true, message: 'Book deleted' });
});

const searchBooks = asyncHandler(async (req, res) => {
  const books = await Book.find(buildFilter(req.query)).populate('category', 'name');
  res.json({ success: true, books });
});

const getBooksByCategory = asyncHandler(async (req, res) => {
  const books = await Book.find({ category: req.params.category }).populate('category', 'name');
  res.json({ success: true, books });
});

module.exports = { getBooks, getBookById, createBook, updateBook, deleteBook, searchBooks, getBooksByCategory };
