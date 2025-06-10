const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Creates student evaluations in a transaction-safe way.
 *
 * @async
 * @function createEvaluations
 * @param {number} teacherId - ID of the teacher submitting evaluations
 * @param {number} sessionId - ID of the session being evaluated
 * @param {Array} evaluations - Array of evaluation objects
 * @returns {Promise<Object[]>} - Created evaluation records
 * @throws {Error} If validation or DB operations fail
 */
async function createEvaluations(teacherId, sessionId, evaluations) {
    try {
        // 1. Validate the session exists
        const session = await prisma.session.findUnique({ where: { id: sessionId } });
        if (!session) throw new Error("Session not found.");

        // 2. Batch-fetch all students involved
        const studentIds = evaluations.map(e => e.studentId);
        const students = await prisma.student.findMany({
            where: { id: { in: studentIds } },
        });

        const validStudentIds = new Set(students.map(s => s.id));
        const missingStudents = studentIds.filter(id => !validStudentIds.has(id));

        if (missingStudents.length > 0) {
            throw new Error(`Invalid student IDs: ${missingStudents.join(", ")}`);
        }

        // 3. Prepare evaluation creations
        const evaluationCreates = evaluations.map(evaluationData => {
            return prisma.evaluation.create({
                data: {
                    studentId: evaluationData.studentId,
                    classId: session.classId,
                    sessionEvaluations: {
                        create: {
                            sessionId: session.id,
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
        });

        // 4. Use transaction to ensure atomicity
        const savedEvaluations = await prisma.$transaction(evaluationCreates);

        return savedEvaluations;
    } catch (error) {
        console.error("Evaluation creation failed:", error);
        throw new Error("Failed to create evaluations");
    }
}

module.exports = { createEvaluations };
