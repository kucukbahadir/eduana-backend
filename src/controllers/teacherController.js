const TeacherService = require("../services/teacherService");
const UserService = require("../services/userService");
const {getValidatedTeacher} = require("../utils/validateTeacher");

class TeacherController {
    /**
     * Creates a teacher profile with the provided information
     *
     * @async
     * @function createTeacherProfile
     * @param {Object} req - Express request object
     * @param {Object} req.body - Request body containing teacher information
     * @param {string} req.body.email - Teacher's email address
     * @param {string} req.body.phoneNumber - Teacher's phone number
     * @param {string} req.body.userId - ID of the user to associate with the teacher profile
     * @param {Object} res - Express response object
     * @returns {Object} 201 status with success message if created successfully
     * @returns {Object} 400 status with error message if required fields are missing or invalid
     * @returns {Object} 404 status with error message if the user is not found
     * @returns {Object} 500 status with error message if server error occurs
     * @throws {Error} When there is an issue creating the teacher profile
     */
    async createTeacherProfile(req, res) {
        try {
            const {email, phoneNumber, userId} = req.body;

            if (!phoneNumber) return res.status(400).json({message: "Phone number is required"});
            if (!userId) return res.status(400).json({message: "User ID is required"});

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email) return res.status(400).json({message: "Email is required"});
            if (!emailRegex.test(email)) return res.status(400).json({message: "Invalid email address"});

            const teacher = await UserService.findById(userId);
            if (!teacher) return res.status(404).json({message: "User not found"});

            await TeacherService.createTeacherProfile(email, phoneNumber, userId);
            return res.status(201).json({message: "Teacher profile created successfully"});
        } catch (error) {
            console.error("Error creating teacher profile: ", error);
            return res.status(500).json({message: "Internal server error"});
        }
    }


    async getClasses(req, res) {
        try {
            const teacher = await getValidatedTeacher(req.user.teacher.id, res);
            if (!teacher) return;

            const classes = await TeacherService.getClassesByTeacherId(parseInt(teacher.id));

            return res.status(200).json(classes);
        } catch (error) {
            console.error("Error getting classes: ", error);
            return res.status(500).json({message: "Internal server error"});
        }
    }


    async getStudents(req, res) {
        try {
            const teacher = await getValidatedTeacher(req.user.teacher.id, res);
            if (!teacher) return;

            const students = await TeacherService.getStudentsByTeacherId(parseInt(teacher.id));

            return res.status(200).json({students});
        } catch (error) {
            console.error("Error getting students: ", error);
            return res.status(500).json({message: "Internal server error"});
        }
    }

    async getCourseInfoById(req, res) {
        try {
            const {teacherId, courseId} = req.params;

            if (!teacherId || isNaN(teacherId)) {
                return res.status(400).json({message: "Invalid or missing teacher ID"});
            }

            if (!courseId || isNaN(courseId)) {
                return res.status(400).json({message: "Invalid or missing course ID"});
            }

            const teacher = await TeacherService.findById(parseInt(teacherId));
            if (!teacher) {
                return res.status(404).json({message: "Teacher not found"});
            }

            const course = await TeacherService.getCourseInfoById(parseInt(courseId));
            if (!course) {
                return res.status(404).json({message: "Course not found"});
            }

            return res.status(200).json({course});

        } catch (error) {
            console.error("Error getting course info:", error);
            return res.status(500).json({message: "Internal server error"});
        }
    }

    async getAllCourses(req, res) {
        try {
            const teacher = await getValidatedTeacher(req.user.teacher.id, res);
            if (!teacher) return;

            const courses = await TeacherService.getAllCourses(teacher.id);
            return res.status(200).json({courses});
        } catch (error) {
            console.error("Error getting courses: ", error);
            return res.status(500).json({message: "Internal server error"});
        }
    }

    async getAllTeachers(req, res) {
    try {
      const teachers = await TeacherService.getAll();
      return res.status(200).json(teachers);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async assignTeacher(req, res) {
    try {
      const assignment = await TeacherService.assign(req.body);
      return res.status(201).json(assignment);
    } catch (error) {
      console.error("Error assigning teacher:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async unassignTeacher(req, res) {
    try {
      await TeacherService.unassign(req.params.id);
      return res.status(204).end();
    } catch (error) {
      console.error("Error unassigning teacher:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new TeacherController();