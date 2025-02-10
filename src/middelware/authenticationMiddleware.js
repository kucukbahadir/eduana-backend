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
 * Middleware for token-based authentication.
 * If the token is valid, the user object is attached to the request.
 * Otherwise, a 401 Unauthorized response is returned.
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

    const jwtToken = verifyJwtToken(authenticationToken);
    if (!jwtToken) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    try {
        // Retrieve user with related cart and address using Prisma
        const user = await prisma.user.findUnique({
            where: { userid: jwtToken.userId }
        });

        if (!user) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        req.user = user;
        next();
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
