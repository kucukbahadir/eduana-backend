const UserService = require("../services/userService");

/**
 * Middleware function that checks if a user has the required role.
 * 
 * @param {string} requiredRole - The role that the user must have to access the route
 * @returns {Function} Express middleware function that:
 *   - Checks if the user exists in the request
 *   - Retrieves the user's role from the database
 *   - Verifies if the user has the required role
 *   - Calls next() if authorized or returns appropriate error responses
 * 
 * @throws {Error} Returns 401 if no user is found in the request or database
 * @throws {Error} Returns 403 if the user doesn't have the required role
 * @throws {Error} Returns 500 if there's a database error
 */
function roleMiddleware(requiredRole) {
  return async (req, res, next) => {
    if (!req.user || !req.user.id) return res.status(401).json({ message: "Unauthorized: No user found" });

    try {
      const user = await UserService.findRoleById(req.user.id);
      
      if (!user) return res.status(401).json({ message: "Unauthorized: User not found" });
      if (user.role !== requiredRole) return res.status(403).json({ message: `Forbidden: Only ${requiredRole}s allowed` });

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
