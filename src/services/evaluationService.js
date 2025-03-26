const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Creates student evaluations and stores them in the database.
 *
 * @async
 * @function createEvaluations
 * @param {number} teacherId - The ID of the teacher submitting the evaluations
 * @param {Array} evaluations - Array of evaluation objects
 * @returns {Promise<Object[]>} - Returns created evaluation records
 * @throws {Error} If database insertion fails
 */
async function createEvaluations(teacherId, evaluations) {
    try {
        const savedEvaluations = [];

        for (const eval of evaluations) {
            // Ensure student exists
            const student = await prisma.student.findFirst({ where: { user: { name: eval.name } } });
            if (!student) {
                throw new Error(`Student ${eval.name} not found`);
            }

            // Find the class ID for the teacher (modify this logic as needed)
            const teacherClass = await prisma.class.findFirst({ where: { teacherId: teacherId } });
            if (!teacherClass) {
                throw new Error("Teacher is not assigned to any class.");
            }

            // Get the latest session ID (modify logic if needed)
            const latestSession = await prisma.session.findFirst({
                where: { classId: teacherClass.id },
                orderBy: { id: "desc" }
            });

            if (!latestSession) {
                throw new Error("No session found for this class.");
            }

            // Create the Evaluation record
            const evaluation = await prisma.evaluation.create({
                data: {
                    studentId: student.id,
                    classId: teacherClass.id,
                    sessionEvaluations: {
                        create: {
                            sessionId: latestSession.id, // Ensure the session ID is recorded
                            active: eval.attendance === "Present" ? 1 : 0,
                            independent: eval.independence || "FREQUENTLY_SEEKS_HELP",
                            completion: eval.taskCompletion || "RARELY",
                            creativity: eval.creativity || "MOSTLY_FOLLOWS_INSTRUCTIONS_RARELY_CONTRIBUTES",
                            persistency: eval.persistence || "AVERAGE",
                            adherence: eval.adherence || "USUALLY_COMPLIED",
                            notes: eval.notes || null,
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
