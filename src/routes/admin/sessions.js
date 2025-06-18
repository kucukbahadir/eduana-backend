const express = require('express');
const { authenticateUser } = require("../../middleware/authMiddleware");
const { hasRole } = require("../../middleware/rbacMiddlewares");
const SessionController = require("../../controllers/sessionController");
const router = express.Router();

router.get("/", authenticateUser, hasRole("ADMIN"), SessionController.getSessions);
router.post("/", authenticateUser, hasRole("ADMIN"), SessionController.createSession);
router.patch("/:id", authenticateUser, hasRole("ADMIN"), SessionController.updateSession);
router.delete("/:id", authenticateUser, hasRole("ADMIN"), SessionController.deleteSession);

module.exports = router;
