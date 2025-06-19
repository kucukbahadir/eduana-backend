const CurriculumService = require('../services/curriculumService');

class CurriculumController {
    
  async getAllCurricula(req, res) {
    try {
      const curricula = await CurriculumService.getAll();
      return res.status(200).json(curricula);
    } catch (error) {
      console.error("Error getting curricula:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async createCurriculum(req, res) {
    try {
      const data = req.body;
      const created = await CurriculumService.create(data, req.user.id);
      return res.status(201).json(created);
    } catch (error) {
      console.error("Error creating curriculum:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async updateCurriculum(req, res) {
    try {
      const updated = await CurriculumService.update(req.params.id, req.body);
      return res.status(200).json(updated);
    } catch (error) {
      console.error("Error updating curriculum:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async deleteCurriculum(req, res) {
    try {
      await CurriculumService.delete(req.params.id);
      return res.status(204).end();
    } catch (error) {
      console.error("Error deleting curriculum:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
};
module.exports = new CurriculumController();
