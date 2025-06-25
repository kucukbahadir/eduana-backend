const express = require('express');
const { authenticateUser } = require("../../middleware/authMiddleware");
const { hasRole } = require("../../middleware/rbacMiddlewares");
const TeacherController = require("../../controllers/teacherController");
const router = express.Router();

router.get("/", authenticateUser, hasRole("ADMIN"), TeacherController.getAllTeachers);
router.post("/teaching", authenticateUser, hasRole("ADMIN"), TeacherController.assignTeacher);
router.delete("/teaching/:id", authenticateUser, hasRole("ADMIN"), TeacherController.unassignTeacher);

module.exports = router;
