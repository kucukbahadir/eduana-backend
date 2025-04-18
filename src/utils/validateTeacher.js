const TeacherService = require("../services/teacherService");

async function getValidatedTeacher(teacherId, res) {
    if (!teacherId) {
        res.status(400).json({ message: "Teacher ID is required" });
        return null;
    }

    if (isNaN(teacherId)) {
        res.status(400).json({ message: "Invalid teacher ID" });
        return null;
    }

    const teacher = await TeacherService.findById(parseInt(teacherId));
    if (!teacher) {
        res.status(404).json({ message: "Teacher not found" });
        return null;
    }

    return teacher;
}

module.exports = { getValidatedTeacher };