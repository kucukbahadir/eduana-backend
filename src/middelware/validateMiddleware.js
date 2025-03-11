/**
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const validateClassId = (req, res, next) => {
    const { classId } = req.params;
    if (!classId) {
        return res.status(400).json({ error: 'classId is required' });
    }
    next();
};