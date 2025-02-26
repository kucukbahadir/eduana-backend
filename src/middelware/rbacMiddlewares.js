const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

/**
 * Middleware to enforce role-based access control.
 * Fetches user role from the database and checks permissions.
 *
 * @param {string} requiredRole - The role required to access the resource
 */
function roleMiddleware(requiredRole) {
    return async (req, res, next) => {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized: No user found" });
        }

        try {
            // Retrieve the user's role from the database
            const user = await prisma.user.findUnique({
                where: { id: req.user.id },
                select: { role: true },
            });

            if (!user) {
                return res.status(401).json({ message: "Unauthorized: User not found" });
            }

            if (user.role !== requiredRole) {
                return res.status(403).json({ message: `Forbidden: Only ${requiredRole}s allowed` });
            }

            next(); // User has the correct role, proceed
        } catch (error) {
            console.error("RBAC Database Error:", error.message);
            res.status(500).json({ message: "Internal Server Error" });
        }
    };
}

// Export specific role-based middlewares
module.exports = {
    adminMiddleware: roleMiddleware("ADMIN"),
    teacherMiddleware: roleMiddleware("TEACHER"),
    parentMiddleware: roleMiddleware("PARENT"),
    studentMiddleware: roleMiddleware("STUDENT"),
    coordinatorMiddleware: roleMiddleware("COORDINATOR"),
};
