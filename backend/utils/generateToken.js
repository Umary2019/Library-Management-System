const jwt = require('jsonwebtoken');

const generateToken = (id) =>
	jwt.sign({ id }, process.env.JWT_SECRET || 'dev_library_management_secret', {
		expiresIn: process.env.JWT_EXPIRES_IN || '7d'
	});

module.exports = generateToken;
