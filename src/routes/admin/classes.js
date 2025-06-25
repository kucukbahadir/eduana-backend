const express = require('express');
const { authenticateUser } = require("../../middleware/authMiddleware");
const { hasRole } = require("../../middleware/rbacMiddlewares");
const ClassController = require("../../controllers/classController");
const router = express.Router();

router.get("/", authenticateUser, hasRole("ADMIN"), ClassController.getAllClasses);
router.post("/", authenticateUser, hasRole("ADMIN"), ClassController.createClass);
router.patch("/:id", authenticateUser, hasRole("ADMIN"), ClassController.updateClass);
router.delete("/:id", authenticateUser, hasRole("ADMIN"), ClassController.deleteClass);

module.exports = router;
