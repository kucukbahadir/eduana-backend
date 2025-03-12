const TeacherService = require("../services/teacherService")

class TeacherController{
    async getClassByTeacherId(req, res){
        try {
            const teacherId = req.params.classId;

            if (!teacherId) {
                return res.status(400).json({ error: 'teacherId is required' });
            }

            const classes = await TeacherService.getClassesByTeacherId(teacherId);

            if (!classes.length) {
                return res.status(404).json({ error: 'No classes found or class does not exist' });
            }

            return res.status(200).json(classes);
        } catch (err) {
            console.error("Error fetching classes:", err);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}
module.exports = new TeacherController();