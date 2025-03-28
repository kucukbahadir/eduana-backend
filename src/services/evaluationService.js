const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Creates student evaluations and stores them in the database.
 *
 * @async
 * @function createEvaluations
 * @param {number} teacherId - The ID of the teacher submitting the evaluations
 * @param {number} sessionId - The ID of the session being evaluated
 * @param {Array} evaluations - Array of evaluation objects
 * @returns {Promise<Object[]>} - Returns created evaluation records
 * @throws {Error} If database insertion fails
 */
async function createEvaluations(teacherId, sessionId, evaluations) {
    try {
        const savedEvaluations = [];

        // Ensure session exists
        const session = await prisma.session.findUnique({ where: { id: sessionId } });
        if (!session) {
            throw new Error("Session not found.");
        }

        for (const evaluationData of evaluations) {
            // Ensure student exists
            const student = await prisma.student.findUnique({ where: { id: evaluationData.studentId } });
            if (!student) {
                throw new Error(`Student with ID ${evaluationData.studentId} not found`);
            }

            // Create the Evaluation record
            const evaluation = await prisma.evaluation.create({
                data: {
                    studentId: student.id,
                    classId: session.classId, // Use session's class ID directly
                    sessionEvaluations: {
                        create: {
                            sessionId: session.id, // Use passed session ID
                            active: evaluationData.attendance === "Present" ? 1 : 0,
                            independent: evaluationData.independence || "FREQUENTLY_SEEKS_HELP",
                            completion: evaluationData.taskCompletion || "RARELY",
                            creativity: evaluationData.creativity || "MOSTLY_FOLLOWS_INSTRUCTIONS_RARELY_CONTRIBUTES",
                            persistency: evaluationData.persistence || "AVERAGE",
                            adherence: evaluationData.adherence || "USUALLY_COMPLIED",
                            notes: evaluationData.notes || null,
                        },
                    },
                },
                include: { sessionEvaluations: true },
            });

            savedEvaluations.push(evaluation);
        }

        return savedEvaluations;
    } catch (error) {
        console.error("Database error: ", error);
        throw new Error("Failed to create evaluations");
    }
}

module.exports = { createEvaluations };
