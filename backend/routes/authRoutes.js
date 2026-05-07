const express = require('express');
const { body } = require('express-validator');
const { register, login, me, updateProfile, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validationMiddleware');

const router = express.Router();

router.post(
  '/register',
  [body('fullName').notEmpty(), body('email').isEmail(), body('password').isLength({ min: 8 })],
  validateRequest,
  register
);
router.post('/login', [body('email').isEmail(), body('password').notEmpty()], validateRequest, login);
router.get('/me', protect, me);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;
