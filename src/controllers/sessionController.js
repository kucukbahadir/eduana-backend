
const SessionService = require("../services/sessionService");
const sessionService = new SessionService();
const { validateSession } = require("../validators/sessionValidator");
const { validationResult } = require("express-validator");
const { handleError } = require("../utils/errorHandler");

class SessionController {
    /**
     * Retrieves all sessions with their associated classes and teachers.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    async getSessions(req, res) {
        try {
        const sessions = await sessionService.getAll();
        res.status(200).json(sessions);
        } catch (error) {
        handleError(res, error);
        }
    }
    /**
     * Creates a new session with the provided data.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    async createSession(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const sessionData = req.body;
            const newSession = await sessionService.create(sessionData);
            res.status(201).json(newSession);
        } catch (error) {
            handleError(res, error);
        }
    }
    /**
     * Updates an existing session by ID with the provided data.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    async updateSession(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const sessionId = req.params.id;
            const sessionData = req.body;
            const updatedSession = await sessionService.update(sessionId, sessionData);
            res.status(200).json(updatedSession);
        } catch (error) {
            handleError(res, error);
        }
    }
    /**
     * Deletes a session by ID.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.   
     * */
    async deleteSession(req, res) {
        try {
            const sessionId = req.params.id;
            const deletedSession = await sessionService.delete(sessionId);
            res.status(200).json(deletedSession);
        } catch (error) {
            handleError(res, error);
        }   
    }
}
