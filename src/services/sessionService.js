const prisma = require("../prismaClient");
const sessionService = {
    /**
     * Retrieves all sessions with their associated classes and teachers.
     * @returns {Promise<Array>} List of sessions with class and teacher
     * information.
     */
    async getAll() {
        return await prisma.session.findMany({
            include: {
                class: {
                    select: {
                        id: true,
                        title: true,
                        teacher: {
                            select: {
                                id: true,
                                full_name: true,
                            },
                        },
                    },
                },
            },
        });
    },
    /**
     * Creates a new session with the provided data.
     * @param {Object} data - Session data to create.
     * @returns {Promise<Object>} The created session object.
     */
    async create(data) {
        return await prisma.session.create({
            data: {
                class_id: data.class_id,
                start_time: data.start_time,
                end_time: data.end_time,
                description: data.description,
            },
        });
    },
    /**
     * Updates an existing session by ID with the provided data.
     * @param {number} id - The ID of the session to update.
     * @param {Object} data - Session data to update.
     * @returns {Promise<Object>} The updated session object.
     */
    async update(id, data) {
        return await prisma.session.update({
            where: { id: parseInt(id) },
            data: {
                class_id: data.class_id,
                start_time: data.start_time,
                end_time: data.end_time,
                description: data.description,
            },
        });
    },

    async delete(id) {
        return await prisma.session.delete({
            where: { id: parseInt(id) },
        });
    },
};

module.exports = sessionService;
