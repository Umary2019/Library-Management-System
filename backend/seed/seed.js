const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const connectDB = require('../config/database');
const User = require('../models/User');
const Category = require('../models/Category');
const Book = require('../models/Book');
const BorrowRecord = require('../models/BorrowRecord');
const ActivityLog = require('../models/ActivityLog');

const seedDatabase = async () => {
  await connectDB();
  await Promise.all([
    User.deleteMany(),
    Category.deleteMany(),
    Book.deleteMany(),
    BorrowRecord.deleteMany(),
    ActivityLog.deleteMany()
  ]);

  const admin = await User.create({ fullName: 'System Admin', email: 'umarkhalifaabubakar0@gmail.com', password: 'Umar@2019', role: 'admin', phone: '07048140838', registrationNumber: 'ADMIN001', department: 'Administration', level: 'N/A', address: 'Main Campus', status: 'active' });
  const librarian = await User.create({ fullName: 'Main Librarian', email: 'bargazal002@gmail.com', password: 'Umar@2019', role: 'librarian', phone: '08141252763', registrationNumber: 'LIB001', department: 'Library Science', level: 'N/A', address: 'Library Block', status: 'active' });
  const student = await User.create({ fullName: 'Sample Student', email: 'student@library.com', password: 'Umar@2019', role: 'student', phone: '08000000000', registrationNumber: 'STU001', department: 'Computer Science', level: 'ND 1', address: 'Student Hostel', status: 'active' });
  
  const categories = await Category.insertMany([
    { name: 'Computer Science', description: 'Programming and computing books' },
    { name: 'Mathematics', description: 'Mathematics and statistics books' },
    { name: 'General Studies', description: 'General knowledge and communication' }
  ]);

  const books = await Book.insertMany([
    { title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', isbn: '9780262033848', category: categories[0]._id, publisher: 'MIT Press', publicationYear: 2009, totalCopies: 5, availableCopies: 4, shelfLocation: 'CS-A1', description: 'Algorithm design and analysis', status: 'available', createdBy: librarian._id },
    { title: 'Discrete Mathematics and Its Applications', author: 'Kenneth H. Rosen', isbn: '9780073383095', category: categories[1]._id, publisher: 'McGraw-Hill', publicationYear: 2011, totalCopies: 4, availableCopies: 4, shelfLocation: 'MATH-B2', description: 'Core discrete math text', status: 'available', createdBy: librarian._id },
    { title: 'Effective Communication Skills', author: 'John Doe', isbn: '9780000000001', category: categories[2]._id, publisher: 'EduPrint', publicationYear: 2020, totalCopies: 3, availableCopies: 2, shelfLocation: 'GS-C3', description: 'Communication and writing skills', status: 'available', createdBy: librarian._id }
  ]);

  await BorrowRecord.create([
    { user: student._id, book: books[0]._id, borrowedDate: new Date(), dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), status: 'borrowed', issuedBy: librarian._id },
    { user: student._id, book: books[2]._id, borrowedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), status: 'overdue', issuedBy: librarian._id, overdueDays: 3, fineAmount: 150 }
  ]);

  console.log('Database seeded successfully');
  await mongoose.connection.close();
};

seedDatabase().catch(async (error) => {
  console.error(error);
  await mongoose.connection.close();
  process.exit(1);
});
