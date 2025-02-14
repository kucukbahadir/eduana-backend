const authService = require('../services/authService');

const register = async (req, res) => {
  try {
    const { username, password, email, role } = req.body;

    // Input validation
    if (!username || !password || !email || !role) {
      return res.status(400).json({
        message: 'Username, password, email, and role are required',
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: 'Invalid email format',
      });
    }

    // Password strength validation
    if (
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[0-9]/.test(password)
    ) {
      return res.status(400).json({
        message:
          'Password must be at least 8 characters long and contain uppercase letters and numbers',
      });
    }

    const user = await authService.registerUser({
      username,
      password,
      email,
      role,
    });

    res.status(201).json({
      message: 'User created successfully',
      user,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      message: error.message || 'Internal server error',
    });
  }
};

module.exports = {
  register,
};
