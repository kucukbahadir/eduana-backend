const jwt = require("jsonwebtoken");
const UserService = require("../services/userService");

/**
 * Verifies a JWT token and returns its payload.
 *
 * @param {string} token - JWT token
 * @returns {Object|undefined} - Decoded token payload or undefined if invalid
 */
function verifyJwtToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    return undefined;
  }
}

/**
 * Middleware to authenticate users via JWT.
 * Attaches the user object to the request if valid.
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
async function authenticateUser(req, res, next) {
  const authenticationToken = req.headers["authorization"];
  if (!authenticationToken) return res.status(401).json({ message: "Unauthorized: No token provided" });

  const jwtToken = verifyJwtToken(authenticationToken.replace("Bearer ", ""));
  if (!jwtToken) return res.status(401).json({ message: "Unauthorized: Invalid token" });

  try {
    const user = await UserService.findById(jwtToken.userId);
    if (!user) return res.status(401).json({ message: "Unauthorized: User not found" });

    req.user = user;
    next();
  } catch (error) {
    console.error("Prisma Database Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = { authenticateUser };
