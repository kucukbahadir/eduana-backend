const express = require('express');
const { authenticateUser } = require("../../middleware/authMiddleware");
const { hasRole } = require("../../middleware/rbacMiddlewares");
const CurriculumController = require("../../controllers/curriculumController");
const router = express.Router();

router.get("/", authenticateUser, hasRole("ADMIN"), CurriculumController.getAllCurricula);
router.post("/", authenticateUser, hasRole("ADMIN"), CurriculumController.createCurriculum);
router.put("/:id", authenticateUser, hasRole("ADMIN"), CurriculumController.updateCurriculum);
router.delete("/:id", authenticateUser, hasRole("ADMIN"), CurriculumController.deleteCurriculum);

module.exports = router;
