const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { validateRequest } = require('../middleware/validationMiddleware');
const { getUsers, getUserById, createLibrarian, updateUser, deleteUser, updateUserStatus } = require('../controllers/userController');

const router = express.Router();

router.use(protect);

router.get('/', authorizeRoles('admin', 'librarian'), getUsers);
router.get('/:id', authorizeRoles('admin', 'librarian'), getUserById);
router.post('/librarian', authorizeRoles('admin'), [body('fullName').notEmpty(), body('email').isEmail(), body('password').isLength({ min: 8 })], validateRequest, createLibrarian);
router.put('/:id', authorizeRoles('admin'), updateUser);
router.delete('/:id', authorizeRoles('admin'), deleteUser);
router.patch('/:id/status', authorizeRoles('admin'), updateUserStatus);

module.exports = router;
