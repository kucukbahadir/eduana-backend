const express = require("express");
const AdminController = require("../controllers/adminController");
const { authenticate, authorizeAdmin } = require("../middleware/authMiddleware");

const router = express.Router();
router.put("/:id/role", authenticate, authorizeAdmin, (req, res) => AdminController.changeUserRole(req, res));

module.exports = router;