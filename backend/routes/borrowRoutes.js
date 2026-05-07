const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { validateRequest } = require('../middleware/validationMiddleware');
const { borrowBook, getBorrowRecords, getMyRecords, getActiveBorrowRecords, getOverdueRecords, returnBook, getBorrowRecordById } = require('../controllers/borrowController');

const router = express.Router();

router.use(protect);

router.post('/', authorizeRoles('admin', 'librarian'), [body('userId').notEmpty(), body('bookId').notEmpty(), body('dueDate').isISO8601()], validateRequest, borrowBook);
router.get('/', authorizeRoles('admin', 'librarian'), getBorrowRecords);
router.get('/my-records', getMyRecords);
router.get('/active', authorizeRoles('admin', 'librarian'), getActiveBorrowRecords);
router.get('/overdue', authorizeRoles('admin', 'librarian'), getOverdueRecords);
router.put('/:id/return', authorizeRoles('admin', 'librarian'), returnBook);
router.get('/:id', authorizeRoles('admin', 'librarian'), getBorrowRecordById);

module.exports = router;
