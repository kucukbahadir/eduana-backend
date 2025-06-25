const express = require('express');
const { authenticateUser } = require("../../middleware/authMiddleware");
const { hasRole } = require("../../middleware/rbacMiddlewares");
const EvaluationController = require("../../controllers/evaluationController");
const router = express.Router();

router.post("/session-evaluations", authenticateUser, hasRole("ADMIN", "TEACHER"), EvaluationController.submitEvaluation);
router.get("/session-evaluations", authenticateUser, hasRole("ADMIN", "TEACHER"), EvaluationController.getSessionEvaluations);
router.patch("/session-evaluations/:id", authenticateUser, hasRole("ADMIN", "TEACHER"), EvaluationController.updateEvaluation);

module.exports = router;
