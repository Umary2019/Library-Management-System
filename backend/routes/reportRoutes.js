const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { getBooksReport, getBorrowedReport, getReturnedReport, getOverdueReport, getUsersReport, getMonthlyReport } = require('../controllers/reportController');

const router = express.Router();

router.use(protect, authorizeRoles('admin', 'librarian'));
router.get('/books', getBooksReport);
router.get('/borrowed', getBorrowedReport);
router.get('/returned', getReturnedReport);
router.get('/overdue', getOverdueReport);
router.get('/users', getUsersReport);
router.get('/monthly', getMonthlyReport);

module.exports = router;
