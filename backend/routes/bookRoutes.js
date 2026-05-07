const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { validateRequest } = require('../middleware/validationMiddleware');
const { getBooks, getBookById, createBook, updateBook, deleteBook, searchBooks, getBooksByCategory } = require('../controllers/bookController');

const router = express.Router();

router.get('/', protect, getBooks);
router.get('/search', protect, searchBooks);
router.get('/category/:category', protect, getBooksByCategory);
router.get('/:id', protect, getBookById);
router.post('/', protect, authorizeRoles('admin', 'librarian'), [body('title').notEmpty(), body('author').notEmpty(), body('isbn').notEmpty(), body('category').notEmpty()], validateRequest, createBook);
router.put('/:id', protect, authorizeRoles('admin', 'librarian'), updateBook);
router.delete('/:id', protect, authorizeRoles('admin', 'librarian'), deleteBook);

module.exports = router;
