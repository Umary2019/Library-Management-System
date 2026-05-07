const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { getAdminDashboard, getLibrarianDashboard, getStudentDashboard } = require('../controllers/dashboardController');

const router = express.Router();

router.use(protect);
router.get('/admin', authorizeRoles('admin'), getAdminDashboard);
router.get('/librarian', authorizeRoles('admin', 'librarian'), getLibrarianDashboard);
router.get('/student', authorizeRoles('student'), getStudentDashboard);

module.exports = router;
