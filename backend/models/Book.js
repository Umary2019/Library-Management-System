const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    isbn: { type: String, required: true, unique: true, trim: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    publisher: { type: String, trim: true },
    publicationYear: { type: Number },
    totalCopies: { type: Number, required: true, min: 0, default: 1 },
    availableCopies: { type: Number, required: true, min: 0, default: 1 },
    shelfLocation: { type: String, trim: true },
    description: { type: String, trim: true },
    status: { type: String, enum: ['available', 'unavailable'], default: 'available' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Book', bookSchema);
