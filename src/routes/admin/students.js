const express = require('express');
const { authenticateUser } = require("../../middleware/authMiddleware");
const { hasRole } = require("../../middleware/rbacMiddlewares");
const StudentController = require("../../controllers/studentController");
const router = express.Router();

router.get("/", authenticateUser, hasRole("ADMIN"), StudentController.getStudents);
router.post("/", authenticateUser, hasRole("ADMIN"), StudentController.addStudent);
router.post("/bulk-upload", authenticateUser, hasRole("ADMIN"), StudentController.bulkUpload);
router.post("/enrollments", authenticateUser, hasRole("ADMIN"), StudentController.enrollStudents);

module.exports = router;
