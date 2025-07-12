const sessionService = require("../services/sessionService");
const userService = require("../services/userService");

class SessionController {
  async getSessionById(req, res) {
    try {
      const { sessionId } = req.params;

      if (!sessionId) return res.status(400).json({ error: "Session ID not provided" });

      const session = await sessionService.getSessionById(sessionId);
      if (!session) return res.status(404).json({ error: "Session not found" });

      return res.status(200).json(session);
    } catch (err) {
      console.error("Error fetching session:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async postAttendances(req, res) {
    try {
      const { sessionId } = req.params;
      const attendances = req.body.attendances;

      if (!sessionId) return res.status(400).json({ error: "Session ID not provided" });
      if (!attendances || typeof attendances !== 'object') return res.status(400).json({ error: "Invalid attendance data" });

      const session = await sessionService.getSessionById(sessionId);
      if (!session) return res.status(404).json({ error: "Session not found" });

      const result = await sessionService.postAttendances(sessionId, attendances);
      if (!result) return res.status(500).json({ error: "Failed to post attendances" });
      
      return res.status(200).json({ message: "Attendances posted successfully" });
    } catch (err) {
      console.error("Error posting attendances:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async postEvaluations(req, res) {
    try {
      const { sessionId } = req.params;
      const evaluations = req.body.evaluationsArray;

      if (!sessionId) return res.status(400).json({ error: "Session ID not provided" });
      if (!evaluations || typeof evaluations !== 'object') return res.status(400).json({ error: "Invalid evaluations data" });

      const session = await sessionService.getSessionById(sessionId);
      if (!session) return res.status(404).json({ error: "Session not found" });

      const result = await sessionService.postEvaluations(sessionId, evaluations);
      if (!result) return res.status(500).json({ error: "Failed to post evaluations" });
      
      return res.status(200).json({ message: "Evaluations posted successfully" });
    } catch (err) {
      console.error("Error posting evaluations:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = new SessionController();