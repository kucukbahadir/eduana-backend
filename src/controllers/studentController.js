const StudentService = require("../services/studentService")

class StudentController {
    async getStudentsByClassId(req, res) {
        try {
            const classId = req.class.id

            const students = await StudentService.getStudentsByClassId(classId);

            return res.status(200).json(students);
        } catch (err) {
            return res.status(500).json({error: 'Internal server error'});
        }
    }
}

module.exports = new StudentController();