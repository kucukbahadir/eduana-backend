const { UserType } = require("@prisma/client");
const UserService = require("../services/userService");


/**
 * Middleware that checks if the authenticated user has one of the required roles.
 * 
 * @param {UserType|Array<UserType>} requiredRoles - The role(s) required to access the route
 * @returns {Function} Express middleware function that:
 *  - Checks if user is authenticated
 *  - Verifies user exists in the database
 *  - Ensures user has one of the required roles
 *  - Returns appropriate status codes and error messages if checks fail:
 *    - 401 if no user is authenticated or user not found in database
 *    - 403 if user doesn't have required role(s)
 *    - 500 if database error occurs
 * 
 * @example
 * // Require admin role
 * router.get('/admin-only', hasRoleMiddleware('admin'), adminController.method);
 * 
 * @example
 * // Require either admin or teacher role
 * router.get('/protected', hasRoleMiddleware(['admin', 'teacher']), controller.method);
 */
function hasRoleMiddleware(requiredRoles) {
  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  
  return async (req, res, next) => {
    if (!req.user || !req.user.id) return res.status(401).json({ message: "Unauthorized: No user found" });

    try {
      const user = await UserService.findById(req.user.id);
      
      if (!user) return res.status(401).json({ message: "Unauthorized: User not found" });
      
      // Check if user's role is included in the array of required roles
      if (!roles.includes(user.role)) {
        const rolesString = roles.length > 1 
          ? roles.slice(0, -1).join(', ') + ' or ' + roles.slice(-1) 
          : roles[0];
        
        return res.status(403).json({ 
          message: `Forbidden: Only ${rolesString.toLowerCase()} allowed` 
        });
      }

      next();
    } catch (error) {
      console.error("RBAC Database Error:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
}

module.exports = {
  hasRole: hasRoleMiddleware
};