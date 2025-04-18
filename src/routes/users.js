const express = require("express");
const UserController = require("../controllers/userController");
const { authenticateUser } = require("../middelware/authMiddleware");
const { hasRole } = require("../middelware/rbacMiddlewares");

const router = express.Router();

router.get("/:userId", authenticateUser, (req, res) => UserController.getUser(req, res));
router.put("/:userId/role", authenticateUser, hasRole("ADMIN"), (req, res) => UserController.updateRole(req, res));

// TODO: Update student profile for a user record
// TODO: Update parent profile for a user record
// TODO: Update teacher profile for a user record
// TODO: Update coordinator profile for a user record
// TODO: Update admin profile for a user record

module.exports = router;
