import finalEvaluationService from '../services/finalEvaluationService.js';

class FinalEvaluationController {
    static async getAllFinalEvaluations(req, res) {
        try {
            const evaluations = await finalEvaluationService.getAllFinalEvaluations();
            res.status(200).json(evaluations);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch final evaluations" });
        }
    }
    
    static async submitFinalEvaluation(req, res) {
        try {
            const evaluationData = req.body;
            const newEvaluation = await finalEvaluationService.createFinalEvaluation(evaluationData);
            res.status(201).json(newEvaluation);
        } catch (error) {
            res.status(500).json({ error: "Failed to create final evaluation" });
        }
    }

    static async deleteFinalEvaluation(req, res) {
        try {
            const { id } = req.params;
            await finalEvaluationService.deleteFinalEvaluation(id);
            res.status(200).json({ message: "Final evaluation deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: "Failed to delete final evaluation" });
        }
    }

    static async finalizeBatch(req, res) {
        try {
            const { batchId } = req.body;
            const finalizedEvaluation = await finalEvaluationService.finalizeBatch(batchId);
            res.status(200).json(finalizedEvaluation);
        } catch (error) {
            res.status(500).json({ error: "Failed to finalize batch" });
        }
    }
}

export default FinalEvaluationController;
