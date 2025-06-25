import { Prisma } from "@prisma/client";
const prisma = new PrismaClient();

class SessionEvaluationService {
    static async getAllSessionEvaluations() {
        return await prisma.sessionEvaluation.findMany();
    }

    static async createSessionEvaluation(data) {
        return await prisma.sessionEvaluation.create({
            data,
        });
    }

    static async deleteSessionEvaluation(id) {
        return await prisma.sessionEvaluation.delete({
            where: { id },
        });
    }

    static async finalizeSession(sessionId) {
        return await prisma.sessionEvaluation.updateMany({
            where: { sessionId },
            data: { finalized: true },
        });
    }
}

export default SessionEvaluationService;
