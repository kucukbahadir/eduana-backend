const lessonService = require("../services/lessonService");
const {getValidatedTeacher} = require("../utils/validateTeacher");

class LessonController {
    /**
     * Retrieves the next scheduled lesson for an authenticated teacher.
     *
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Object} - JSON response with lesson details or an error message
     */
    async getNextLesson(req, res) {
        try {
            const teacher = await getValidatedTeacher(req.params.teacherId, res);
            if (!teacher) return;

            // Fetch next lesson from service
            const lesson = await lessonService.getNextLesson(teacher.id);

            if (!lesson) {
                return res.status(404).json({ message: "No upcoming lessons found" });
            }

            return res.status(200).json({
                message: "Next lesson retrieved successfully",
                lesson,
            });

        } catch (error) {
            console.error("Error fetching next lesson:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}


module.exports = new LessonController();
