const express = require('express');
const { authenticateUser } = require("../../middleware/authMiddleware");
const { hasRole } = require("../../middleware/rbacMiddlewares");
const FinalEvaluationController = require("../../controllers/finalEvaluationController");
const router = express.Router();

router.post("/", authenticateUser, hasRole("ADMIN"), FinalEvaluationController.submitFinalEvaluation);
router.get("/", authenticateUser, hasRole("ADMIN"), FinalEvaluationController.getFinalEvaluation);
router.post("/finalize-batch", authenticateUser, hasRole("ADMIN"), FinalEvaluationController.finalizeBatch);

module.exports = router;
