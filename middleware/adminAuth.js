const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const adminAuthMiddleware = async (req, res, next) => {
  try {
    // Retrieve the token from the Authorization header
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        message: 'Authentication required',
      });
    }

    const decodedUser = decodeJWT(token); 

    if (!decodedUser) {
      return res.status(401).json({
        message: 'Invalid or expired token',
      });
    }


    const user = await prisma.user.findFirst({
      where: {
        id: decodedUser.id, 
        role: 'admin', // Ensure this user is an admin
      },
    });

    if (!user) {
      return res.status(403).json({
        message: 'Admin privileges required',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};

module.exports = adminAuthMiddleware;
