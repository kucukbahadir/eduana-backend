const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class ClassService {
  /**
   * Lists students in the teacher’s class.
   * @param {string} [classId] - Optional class ID to filter students.
   * @returns {Promise<Array>} List of students.
   */
  async getStudentsByClassId(classId) {
    const whereClause = {
      role: "STUDENT",
      ...(classId && { enrollments: { some: { class_id: classId } } }),
    };

    const students = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        full_name: true,
        enrollments: {
          select: {
            class: {
              select: {
                id: true,
                title: true, // Assuming Class model has a 'title' field for class name
              },
            },
          },
        },
      },
    });

    return students.map((student) => ({
      studentId: student.id,
      name: student.full_name,
      // If a student can be in multiple classes, you might need to adjust how 'class' is represented.
      // Here, we take the title of the first enrolled class found.
      class: student.enrollments[0]?.class?.title || null,
    }));
  }

  async getClassById(classId) {
    const classData = await prisma.class.findUnique({
      where: { id: classId },
      select: {
        id: true,
        name: true,
        curriculum: {
          select: {
            id: true,
            title: true,
            program_type: true,
            difficulty_level: true,
          },
        },
        location: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
        enrollments: {
          select: {
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
        sessions: {
          select: {
            id: true,
            start_time: true,
            end_time: true,
            lesson: {
              select: {
                id: true,
                title: true,
                description: true,
              },
            },
          },
        },
      },
    });

    return classData;
  }

  async getClassesByTeacherId(teacherId) {
    const classes = await prisma.teaching.findMany({
      where: { user_id: teacherId },
      select: {
        session: {
          select: {
            class: {
              select: {
                id: true,
                name: true,
                curriculum: {
                  select: {
                    id: true,
                    title: true,
                    program_type: true,
                    difficulty_level: true,
                  },
                },
                location: {
                  select: {
                    id: true,
                    name: true,
                    address: true,
                  },
                },
                sessions: {
                  select: {
                    id: true,
                    date: true,
                    start_time: true,
                    end_time: true,
                    lesson: {
                      select: {
                        id: true,
                        title: true,
                        description: true,
                      },
                    },
                  },
                  orderBy: {
                    start_time: 'asc',
                  },
                },
              },
            },
          },
        },
      },
    });

    const uniqueClasses = Array.from(new Map(classes.map((teaching) => [teaching.session.class.id, teaching.session.class])).values());

    // Pre-calculate expensive date operations on server
    const enrichedClasses = uniqueClasses.map(classItem => {
      return this.enrichClassWithCalculations(classItem);
    });

    return enrichedClasses;
  }

  enrichClassWithCalculations(classItem) {
    const now = new Date();
    const sessions = classItem.sessions || [];

    // Find current ongoing session
    const currentEvent = sessions.find(session => {
      const startTime = new Date(session.start_time);
      const endTime = new Date(session.end_time);
      return startTime <= now && endTime >= now;
    });

    // Find next upcoming session
    const upcomingSessions = sessions.filter(session => {
      return new Date(session.start_time) > now;
    });
    const nextEvent = upcomingSessions.length > 0 ? upcomingSessions[0] : null;

    // Find last completed session
    const completedSessions = sessions.filter(session => {
      return new Date(session.end_time) < now;
    });
    const lastEvent = completedSessions.length > 0 ? completedSessions[completedSessions.length - 1] : null;

    // Determine status
    let status = 'completed';
    if (currentEvent) {
      status = 'ongoing';
    } else if (nextEvent) {
      status = 'upcoming';
    }

    // Calculate time-based category
    let category = 'noUpcoming';
    if (currentEvent) {
      category = 'ongoing';
    } else if (nextEvent) {
      const nextEventTime = new Date(nextEvent.start_time);
      const timeUntilEvent = nextEventTime.getTime() - now.getTime();
      
      // Calculate end of today
      const endOfToday = new Date(now);
      endOfToday.setHours(23, 59, 59, 999);
      const timeUntilEndOfDay = endOfToday.getTime() - now.getTime();
      
      const twentyFourHours = 24 * 60 * 60 * 1000;
      const sevenDays = 7 * 24 * 60 * 60 * 1000;

      if (timeUntilEvent <= timeUntilEndOfDay) {
        category = 'today';
      } else if (timeUntilEvent <= twentyFourHours) {
        category = 'tomorrow';
      } else if (timeUntilEvent <= sevenDays) {
        category = 'thisWeek';
      } else {
        category = 'beyond';
      }
    }

    // Pre-compute searchable text for efficient frontend filtering
    const searchableText = [
      classItem.name,
      classItem.location?.name,
      classItem.location?.address,
      classItem.curriculum?.title,
      classItem.curriculum?.program_type,
      classItem.curriculum?.difficulty_level?.toString(),
      currentEvent?.lesson?.title,
      nextEvent?.lesson?.title,
      lastEvent?.lesson?.title
    ].filter(Boolean).join(' ').toLowerCase();

    return {
      ...classItem,
      // Pre-calculated status information
      status,
      category,
      currentEvent,
      nextEvent,
      lastEvent,
      
      // Pre-calculated timestamps for efficient sorting/filtering
      nextEventTime: nextEvent ? new Date(nextEvent.start_time).getTime() : null,
      lastEventTime: lastEvent ? new Date(lastEvent.end_time).getTime() : null,
      
      // Statistics
      totalSessions: sessions.length,
      completedSessions: completedSessions.length,
      upcomingSessions: upcomingSessions.length,
      
      // Search optimization
      searchableText,
      
      // Calculation timestamp for cache invalidation
      calculatedAt: now.getTime()
    };
  }
}

module.exports = new ClassService();
