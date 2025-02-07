router.post('/register', async (req, res) => {
  try {
    console.log('Registration attempt with data:', {
      username: req.body.username,
      email: req.body.email,
      role: req.body.role,
      password: '***hidden***'
    });

    const { username, password, email, role } = req.body;
    
    // Input validation
    if (!username || !password || !email || !role) {
      return res.status(400).json({
        message: 'Username, password, email, and role are required'
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: 'Invalid email format'
      });
    }

    // Password strength validation
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long and contain uppercase letters and numbers'
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    console.log('Existing user check result:', existingUser ? 'User exists' : 'User does not exist');
    
    if (existingUser) {
      return res.status(400).json({
        message: 'Email already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('Password hashed successfully');

    // Create user
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role
      }
    });
    console.log('New user created with data:', {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
});