const AdminController = require("../controllers/adminController"); // Use require instead of import
const express = require("express");

const router = express.Router();

router.post("/role", (req, res) => AdminController.changeUserRole(req, res));

module.exports = router; // Use module.exports instead of export default
