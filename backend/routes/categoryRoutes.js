const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { validateRequest } = require('../middleware/validationMiddleware');
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');

const router = express.Router();

router.get('/', protect, getCategories);
router.post('/', protect, authorizeRoles('admin', 'librarian'), [body('name').notEmpty()], validateRequest, createCategory);
router.put('/:id', protect, authorizeRoles('admin', 'librarian'), updateCategory);
router.delete('/:id', protect, authorizeRoles('admin'), deleteCategory);

module.exports = router;
