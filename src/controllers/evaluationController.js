const evaluationService = require("../services/evaluationService");
const TeacherService = require("../services/teacherService");

/**
 * Handles the submission of student evaluations.
 *
 * @async
 * @function submitEvaluation
 * @param {Object} req - Express request object
 * @param {Object} req.body - JSON body containing evaluation details
 * @param {Object} res - Express response object
 * @returns {Object} 201 status with success message if evaluation is stored
 * @returns {Object} 400 status if request validation fails
 * @returns {Object} 403 status if unauthorized access occurs
 * @returns {Object} 500 status if a server error occurs
 */
async function submitEvaluation(req, res) {
    try {
        const teacherId = req.params.teacherId;
        if (!teacherId) return res.status(400).json({ message: "Teacher ID is required" });
        if (isNaN(teacherId)) return res.status(400).json({ message: "Invalid teacher ID" });

        const teacher = await TeacherService.findById(parseInt(teacherId));
        if (!teacher) return res.status(404).json({ message: "Teacher not found" });

        const {sessionId, evaluations} = req.body;

        if (!sessionId || isNaN(sessionId)) {
            return res.status(400).json({message: "Valid session ID is required"});
        }

        if (!Array.isArray(evaluations) || evaluations.length === 0) {
            return res.status(400).json({message: "Evaluation data is required and must be an array"});
        }

        const result = await evaluationService.createEvaluations(teacherId, sessionId, evaluations);

        return res.status(201).json({message: "Evaluations submitted successfully", result});
    } catch (error) {
        console.error("Error submitting evaluation: ", error);
        return res.status(500).json({message: "Internal server error", error: error.message});
    }
}

module.exports = {submitEvaluation};
