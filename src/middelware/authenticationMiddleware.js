const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

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
 * Middleware for token-based authentication and admin authorization.
 * If the token is valid and the user is an admin, the user object is attached to the request.
 * Otherwise, a 401 Unauthorized or 403 Forbidden response is returned.
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
async function handleTokenBasedAuthentication(req, res, next) {
    const authenticationToken = req.headers["authorization"];

    if (!authenticationToken) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const jwtToken = verifyJwtToken(authenticationToken.replace("Bearer ", ""));
    if (!jwtToken) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    try {
        // Retrieve user using Prisma with the userId from the JWT token
        const user = await prisma.user.findUnique({
            where: { id: jwtToken.userId }
        });

        if (!user) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        // Attach the user object to the request
        req.user = user;

        // Check if the user is an admin
        if (user.role !== 'ADMIN') {
            return res.status(403).json({ message: "Forbidden: Admins only" });
        }

        next();  // Continue to the next middleware/controller
    } catch (error) {
        console.error("Prisma Database Error:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

/**
 * Extracts the user ID from a JWT token.
 *
 * @param {string} token - JWT token
 * @returns {number|undefined} - User ID or undefined if invalid
 */
function getUserIdByToken(token) {
    const payload = verifyJwtToken(token);
    return payload ? payload.userId : undefined;
}

module.exports = { handleTokenBasedAuthentication, getUserIdByToken };
