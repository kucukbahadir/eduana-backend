const ClassService = require("../services/classService");

class ClassController {
  /**
   * Retrieves all students associated with a specific class.
   * 
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.classId - The ID of the class to find students for
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with students data or error message
   * @throws {Error} If there's a problem fetching students from the database
   */
  async getStudentsByClassId(req, res) {
    try {
      const { classId } = req.params;
      
      if (!classId) return res.status(400).json({ error: "Class ID not provided" });
      if (isNaN(Number(classId))) return res.status(400).json({ error: "Invalid class ID" });
      // TODO: Validate if class exists

      const students = await ClassService.getStudentsByClassId(classId);
      if (!students) return res.status(404).json({ error: "No students found" });

      return res.status(200).json(students);
    } catch (err) {
      console.error("Error fetching students:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = new ClassController();
