const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class SessionService {
  async getSessionById(sessionId) {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      select: {
        id: true,
        start_time: true,
        end_time: true,
        attendances: {
          select: {
            id: true,
            present: true,
            late: true,
            excused: true,
            note: true,
            user: {
              select: {
                id: true,
                full_name: true,
                age: true,
                language_preference: true,
                diet_restrictions: true,
                experience: true,
                remarks: true,
                parent_phone_number: true,
              },
            },
          },
        },
        sessionEvaluations: {
          select: {
            session_id: true,
            user_id: true,
            participation_score: true,
            understanding_score: true,
            collaboration_score: true,
            problem_solving_score: true,
            task_completion_score: true,
          },
        },
        lesson: {
          select: {
            id: true,
            title: true,
            description: true,
            keywords: {
              select: {
                keyword: {
                  select: {
                    id: true,
                    name: true,
                    description: true,
                  },
                },
              },
            },
            learning_objectives: {
              select: {
                id: true,
                objective: true,
                descriptions: true,
              },
            },
            resources: {
              select: {
                id: true,
                url: true,
                type: true,
                language: true,
              },
            },
          },
        },
      },
    });

    return session;
  }

  async getEvaluationsBySessionId(sessionId) {
    const evaluations = await prisma.sessionEvaluation.findMany({
      where: { session_id: sessionId },
      select: {
        id: true,
        user_id: true,
        feedback: true,
        participation_score: true,
        understanding_score: true,
        collaboration_score: true,
        problem_solving_score: true,
        task_completion_score: true,
      },
    });

    return evaluations;
  }

  async postAttendances(sessionId, attendances) {
    const upsertedAttendances = await prisma.$transaction(
      attendances.map((attendance) =>
        prisma.attendance.upsert({
          where: { 
            session_id_user_id: {
              session_id: sessionId,
              user_id: attendance.userId
            }
          },
          update: {
            present: attendance.present,
            late: attendance.late,
            excused: attendance.excused,
            note: attendance.note,
          },
          create: {
            session_id: sessionId,
            user_id: attendance.userId,
            present: attendance.present,
            late: attendance.late,
            excused: attendance.excused,
            note: attendance.note,
            timestamp: new Date(), // unnecessary, remove this in the schema
          }
        })
      )
    );

    return upsertedAttendances;
  }

  async postEvaluations(sessionId, evaluations) {
    const upsertedEvaluations = await prisma.$transaction(
      evaluations.map((evaluation) =>
        prisma.sessionEvaluation.upsert({
          where: { 
            session_id_user_id: {
              session_id: sessionId,
              user_id: evaluation.userId
            }
          },
          update: {
            participation_score: evaluation.participation,
            understanding_score: evaluation.understanding,
            collaboration_score: evaluation.collaboration,
            problem_solving_score: evaluation.problem_solving,
            task_completion_score: evaluation.task_completion,
          },
          create: {
            session_id: sessionId,
            user_id: evaluation.userId,
            participation_score: evaluation.participation,
            understanding_score: evaluation.understanding,
            collaboration_score: evaluation.collaboration,
            problem_solving_score: evaluation.problem_solving,
            task_completion_score: evaluation.task_completion,
          }
        })
      )
    );

    return upsertedEvaluations;
  }
}

module.exports = new SessionService();
