const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const adminAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        message: 'Authentication required'
      });
    }

    const user = await prisma.user.findFirst({
      where: {
        role: 'admin'
      }
    });

    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        message: 'Admin privileges required'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

module.exports = adminAuthMiddleware;
