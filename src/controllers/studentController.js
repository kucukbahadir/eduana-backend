class StudentController {
    async getStudentsByClassId(req, res) {
        try {
            const classId = req.params.classId;

            if (!classId) {
                return res.status(400).json({ error: 'classId is required' });
            }

            const students = await StudentService.getStudentsByClassId(classId);

            if (!students.length) {
                return res.status(404).json({ error: 'No students found or class does not exist' });
            }

            return res.status(200).json(students);
        } catch (err) {
            console.error("Error fetching students:", err);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = new StudentController();