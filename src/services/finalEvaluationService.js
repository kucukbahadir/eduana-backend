const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

class FinalEvaluationService {
    static async getAllFinalEvaluations() {
        return await prisma.finalEvaluation.findMany();
    }

    static async createFinalEvaluation(evaluationData) {
        return await prisma.finalEvaluation.create({
            data: evaluationData
        });
    }

    static async deleteFinalEvaluation(id) {
        return await prisma.finalEvaluation.delete({
            where: { id: id }
        });
    }
}

export default FinalEvaluationService;
