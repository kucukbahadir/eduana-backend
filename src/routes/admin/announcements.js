const express = require('express');
const { authenticateUser } = require("../../middleware/authMiddleware");
const { hasRole } = require("../../middleware/rbacMiddlewares");
const AnnouncementController = require("../../controllers/announcementController");
const router = express.Router();

router.get("/", authenticateUser, hasRole("ADMIN"), AnnouncementController.getAnnouncements);
router.post("/", authenticateUser, hasRole("ADMIN"), AnnouncementController.createAnnouncement);
router.delete("/:id", authenticateUser, hasRole("ADMIN"), AnnouncementController.deleteAnnouncement);

module.exports = router;
