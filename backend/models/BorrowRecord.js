const mongoose = require('mongoose');

const borrowRecordSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    borrowedDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    returnedDate: { type: Date },
    status: { type: String, enum: ['borrowed', 'returned', 'overdue'], default: 'borrowed' },
    issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    receivedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    overdueDays: { type: Number, default: 0 },
    fineAmount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('BorrowRecord', borrowRecordSchema);
