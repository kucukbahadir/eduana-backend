const AdminService = require("../services/adminService"); // Use require

class AdminController {
    changeUserRole(req, res) {
        AdminService.changeUserRole(req, res); // Call the function
        console.log("User role changed.");
    }
}

module.exports = new AdminController(); // Use module.exports instead of export default
