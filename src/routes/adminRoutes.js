const express = require("express");
const AdminController = require("../controllers/adminController");
/*
this const's will be usable when the jwt is implemented
const { authenticate, authorizeAdmin } = require("../middleware/authMiddleware");
*/
const router = express.Router();
router.put("/:id/role", (req, res) => AdminController.changeUserRole(req, res));

module.exports = router;