import SessionEvaluationService from "../services/sessionEvaluationService";

class SessionEvaluationController {
    static async getAllSessionEvaluations(req, res) {
        try {
            const evaluations = await SessionEvaluationService.getAllSessionEvaluations();
            res.status(200).json(evaluations);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch session evaluations" });
        }
    }

    static async submitSessionEvaluation(req, res) {
        try {
            const evaluationData = req.body;
            const newEvaluation = await SessionEvaluationService.createSessionEvaluation(evaluationData);
            res.status(201).json(newEvaluation);
        } catch (error) {
            res.status(500).json({ error: "Failed to create session evaluation" });
        }
    }

    static async deleteSessionEvaluation(req, res) {
        try {
            const { id } = req.params;
            await SessionEvaluationService.deleteSessionEvaluation(id);
            res.status(200).json({ message: "Session evaluation deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: "Failed to delete session evaluation" });
        }
    }

    static async finalizeSession(req, res) {
        try {
            const { sessionId } = req.body;
            const finalizedEvaluation = await SessionEvaluationService.finalizeSession(sessionId);
            res.status(200).json(finalizedEvaluation);
        } catch (error) {
            res.status(500).json({ error: "Failed to finalize session" });
        }
    }
}

export default SessionEvaluationController;
