const AdminService = require("../services/adminService");
const logger = require("../utils/logger");

class AdminController {
    async changeUserRole(req, res) {
        try {
            const updatedUser = await AdminService.changeUserRole(req, res);
            logger.info(`User role updated: ${updatedUser.id} -> ${updatedUser.role}`);
            res.status(200).json(updatedUser);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = new AdminController();