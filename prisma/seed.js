const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');
const saltRounds = 10;

async function main() {
  console.log('Starting database seeding...');

  await cleanDatabase();

  const adminUser = await createUser('Admin User', 'admin', 'Password123!', 'ADMIN');
  const teacherUsers = await createTeachers(5);
  const coordinatorUser = await createUser('Coordinator User', 'coordinator', 'Password123!', 'COORDINATOR');
  const parentUsers = await createParents(10);
  const studentUsers = await createStudents(20);

  const classes = await createClasses(3);

  const curricula = await createCurricula(2);
  
  await linkStudentsToParents(studentUsers, parentUsers);

  await enrollStudentsInClasses(studentUsers, classes);

  const sessions = await createSessionsForClasses(classes, curricula);

  await assignTeachersToSessions(teacherUsers, sessions, classes);

  await recordAttendance(sessions, studentUsers);

  await createEvaluations(studentUsers, classes, sessions);

  console.log('Database seeding completed successfully!');
}

async function cleanDatabase() {
  // Delete data in reverse order of dependencies
  console.log('Cleaning existing data...');
  
  // The order here is important due to foreign key constraints
  await prisma.attendance.deleteMany({});
  await prisma.finalEvaluation.deleteMany({});
  await prisma.sessionEvaluation.deleteMany({});
  await prisma.evaluation.deleteMany({});
  await prisma.announcement.deleteMany({});
  await prisma.teaching.deleteMany({});
  await prisma.enrollment.deleteMany({});
  await prisma.studentParent.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.kahoot.deleteMany({});
  await prisma.presentationSlide.deleteMany({});
  await prisma.keyword.deleteMany({});
  await prisma.lesson.deleteMany({});
  await prisma.curriculum.deleteMany({});
  await prisma.class.deleteMany({});
  await prisma.activity.deleteMany({});
  await prisma.externalStudentAccount.deleteMany({});
  await prisma.admin.deleteMany({});
  await prisma.coordinator.deleteMany({});
  await prisma.parent.deleteMany({});
  await prisma.teacher.deleteMany({});
  await prisma.student.deleteMany({});
  await prisma.user.deleteMany({});
}

async function createUser(name, username, password, role) {
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const user = await prisma.user.create({
    data: {
      name,
      username,
      password: hashedPassword,
      role,
      updatedAt: new Date(),
    },
  });
  console.log(`Created ${role} user: ${username}`);
  return user;
}

async function createTeachers(count) {
  console.log(`Creating ${count} teachers...`);
  const teachers = [];
  
  for (let i = 1; i <= count; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const name = `${firstName} ${lastName}`;
    const username = `teacher${i}`;
    
    const user = await createUser(name, username, 'Password123!', 'TEACHER');
    
    const teacher = await prisma.teacher.create({
      data: {
        email: faker.internet.email({ firstName, lastName, provider: 'eduana.com' }),
        phoneNumber: faker.phone.number('+1##########'),
        userId: user.id,
      },
    });
    
    teachers.push({ user, teacher });
  }
  
  return teachers;
}

async function createParents(count) {
  console.log(`Creating ${count} parents...`);
  const parents = [];
  
  for (let i = 1; i <= count; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const name = `${firstName} ${lastName}`;
    const username = `parent${i}`;
    
    const user = await createUser(name, username, 'Password123!', 'PARENT');
    
    const parent = await prisma.parent.create({
      data: {
        email: faker.internet.email({ firstName, lastName }),
        phoneNumber: faker.phone.number('+1##########'),
        userId: user.id,
      },
    });
    
    parents.push({ user, parent });
  }
  
  return parents;
}

async function createStudents(count) {
  console.log(`Creating ${count} students...`);
  const students = [];
  
  for (let i = 1; i <= count; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const name = `${firstName} ${lastName}`;
    const username = `student${i}`;
    
    const user = await createUser(name, username, 'Password123!', 'STUDENT');
    
    const languages = ['English', 'Spanish', 'French', 'German'];
    const dietRestrictions = ['None', 'Vegetarian', 'Vegan', 'Gluten-free', 'Nut allergy'];
    
    const student = await prisma.student.create({
      data: {
        age: faker.number.int({ min: 8, max: 18 }),
        languagePreference: faker.helpers.arrayElement(languages),
        dietRestrictions: faker.helpers.arrayElement(dietRestrictions),
        previousExperience: faker.helpers.maybe(() => 'Some programming experience', { probability: 0.5 }),
        miscellaneousRemarks: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.3 }),
        parentPhoneNumber: faker.phone.number('+1##########'),
        userId: user.id,
      },
    });
    
    // Create external account for some students
    if (faker.datatype.boolean(0.7)) {
      await prisma.externalStudentAccount.create({
        data: {
          username: `ext_${username}`,
          password: 'ExternalPassword123!',
          studentId: student.id,
        },
      });
    }
    
    students.push({ user, student });
  }
  
  return students;
}

async function createClasses(count) {
  console.log(`Creating ${count} classes...`);
  const classes = [];
  
  const classTitles = [
    'Introduction to Robotics',
    'Advanced Programming',
    'Creative Coding',
    'Electronics Basics',
    'AI for Kids',
    'Game Development',
    'Web Design',
    'Digital Art',
  ];
  
  for (let i = 1; i <= count; i++) {
    const classTitle = faker.helpers.arrayElement(classTitles);
    
    const classObj = await prisma.class.create({
      data: {
        title: `${classTitle} - ${faker.word.adjective()} Class`,
        description: faker.lorem.paragraph(),
      },
    });
    
    // Create announcements for each class
    const announcementCount = faker.number.int({ min: 1, max: 3 });
    for (let j = 0; j < announcementCount; j++) {
      await prisma.announcement.create({
        data: {
          title: faker.helpers.arrayElement([
            `Welcome to ${classObj.title}`,
            'Important class update',
            'Upcoming events',
            'Materials needed'
          ]),
          content: faker.lorem.paragraphs(2),
          updatedAt: faker.date.recent(),
          classId: classObj.id,
        },
      });
    }
    
    classes.push(classObj);
  }
  
  return classes;
}

async function createCurricula(count) {
  console.log(`Creating ${count} curricula with lessons...`);
  const curricula = [];
  
  const fields = ['Robotics', 'Programming', 'Electronics', 'Design Thinking', 'AI', 'Game Development'];
  const types = ['Regular', 'Summer Camp', 'Special', 'Weekend', 'Intensive'];
  const levels = ['Beginner', 'Intermediate', 'Advanced'];
  
  for (let i = 1; i <= count; i++) {
    const field = faker.helpers.arrayElement(fields);
    const type = faker.helpers.arrayElement(types);
    const level = faker.helpers.arrayElement(levels);
    
    const curriculum = await prisma.curriculum.create({
      data: {
        title: `${field} ${level} ${type}`,
        description: faker.lorem.paragraph(),
        field,
        type,
        level,
      },
    });
    
    // Create 3-5 lessons for each curriculum
    const lessonCount = faker.number.int({ min: 3, max: 5 });
    
    for (let j = 1; j <= lessonCount; j++) {
      const lesson = await prisma.lesson.create({
        data: {
          title: `Lesson ${j}: ${faker.commerce.productAdjective()} ${field} ${faker.word.noun()}`,
          curriculumId: curriculum.id,
        },
      });
      
      // Create keywords for each lesson
      const keywordCount = faker.number.int({ min: 2, max: 5 });
      for (let k = 1; k <= keywordCount; k++) {
        await prisma.keyword.create({
          data: {
            name: faker.word.sample(),
            definition: faker.lorem.sentence(),
            lessonId: lesson.id,
          },
        });
      }
      
      // Create presentation slides for each lesson
      const slideCount = faker.number.int({ min: 3, max: 8 });
      for (let s = 1; s <= slideCount; s++) {
        const languages = ['English', 'Spanish'];
        
        for (const lang of languages) {
          await prisma.presentationSlide.create({
            data: {
              type: lang,
              url: `https://slides.eduana.com/${field.toLowerCase()}/${lesson.id}/${s}/${lang.toLowerCase()}`,
              lessonId: lesson.id,
            },
          });
        }
      }
      
      // Create kahoots for each lesson
      const languages = ['English', 'Spanish'];
      for (const lang of languages) {
        await prisma.kahoot.create({
          data: {
            type: lang,
            url: `https://kahoot.eduana.com/${field.toLowerCase()}/${lesson.id}/${lang.toLowerCase()}`,
            lessonId: lesson.id,
          },
        });
      }
    }
    
    curricula.push(curriculum);
  }
  
  return curricula;
}

async function createActivity() {
  const activities = [
    { 
      name: 'Robotics Building', 
      description: faker.lorem.paragraph()
    },
    { 
      name: 'Code Challenge', 
      description: faker.lorem.paragraph()
    },
    { 
      name: 'Electronics Workshop', 
      description: faker.lorem.paragraph()
    },
    { 
      name: 'Design Thinking', 
      description: faker.lorem.paragraph()
    },
    { 
      name: 'Group Presentation', 
      description: faker.lorem.paragraph()
    },
    { 
      name: 'Peer Programming', 
      description: faker.lorem.paragraph()
    },
  ];
  
  const randomActivity = faker.helpers.arrayElement(activities);
  
  return await prisma.activity.create({
    data: randomActivity,
  });
}

async function linkStudentsToParents(students, parents) {
  console.log('Linking students to parents...');
  
  // Randomly assign 1-2 parents to each student
  for (const studentData of students) {
    const parentCount = faker.number.int({ min: 1, max: 2 });
    const shuffledParents = [...parents].sort(() => 0.5 - Math.random());
    
    for (let i = 0; i < Math.min(parentCount, shuffledParents.length); i++) {
      await prisma.studentParent.create({
        data: {
          studentId: studentData.student.id,
          parentId: shuffledParents[i].parent.id,
        },
      });
    }
  }
}

async function enrollStudentsInClasses(students, classes) {
  console.log('Enrolling students in classes...');
  
  // Enroll each student in 1-2 classes
  for (const studentData of students) {
    const classCount = faker.number.int({ min: 1, max: Math.min(2, classes.length) });
    const shuffledClasses = [...classes].sort(() => 0.5 - Math.random());
    
    for (let i = 0; i < classCount; i++) {
      await prisma.enrollment.create({
        data: {
          studentId: studentData.student.id,
          classId: shuffledClasses[i].id,
        },
      });
    }
  }
}

async function createSessionsForClasses(classes, curricula) {
  console.log('Creating sessions for classes...');
  const sessions = [];
  
  for (const classObj of classes) {
    // Create 5-10 sessions for each class
    const sessionCount = faker.number.int({ min: 5, max: 10 });
    
    // Start date for the sessions (between today and 3 months from now)
    let currentDate = faker.date.soon({ days: 90 });
    
    // Some past sessions and some future ones
    const pastSessionCount = faker.number.int({ min: 0, max: Math.floor(sessionCount / 2) });
    
    if (pastSessionCount > 0) {
      currentDate = faker.date.recent({ days: 90 });
    }
    
    for (let i = 1; i <= sessionCount; i++) {
      // Each session is 1-2 hours
      const startTime = new Date(currentDate);
      startTime.setHours(faker.number.int({ min: 9, max: 17 })); // Between 9 AM and 5 PM
      
      const endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() + faker.number.int({ min: 1, max: 2 }));
      
      // Randomly associate with an activity or a lesson
      let activity = null;
      let lessonId = null;
      
      if (faker.datatype.boolean() && curricula.length > 0) {
        // Get a random curriculum
        const randomCurriculum = faker.helpers.arrayElement(curricula);
        
        // Get all lessons for this curriculum
        const lessons = await prisma.lesson.findMany({
          where: { curriculumId: randomCurriculum.id },
        });
        
        if (lessons.length > 0) {
          // Get a random lesson
          const randomLesson = faker.helpers.arrayElement(lessons);
          lessonId = randomLesson.id;
        }
      } else {
        activity = await createActivity();
      }
      
      const session = await prisma.session.create({
        data: {
          start: startTime,
          end: endTime,
          classId: classObj.id,
          activityId: activity ? activity.id : null,
          lessonId: lessonId,
        },
      });
      
      sessions.push(session);
      
      // Move to the next day for the next session
      currentDate.setDate(currentDate.getDate() + 7); // Weekly sessions
    }
  }
  
  return sessions;
}

async function assignTeachersToSessions(teachers, sessions, classes) {
  console.log('Assigning teachers to sessions...');
  
  for (const session of sessions) {
    // Find the class for this session
    const classObj = classes.find(c => c.id === session.classId);
    
    // Randomly assign 1-2 teachers to each session
    const teacherCount = faker.number.int({ min: 1, max: Math.min(2, teachers.length) });
    const shuffledTeachers = [...teachers].sort(() => 0.5 - Math.random());
    
    for (let i = 0; i < teacherCount; i++) {
      await prisma.teaching.create({
        data: {
          teacherId: shuffledTeachers[i].teacher.id,
          sessionId: session.id,
          classId: classObj.id,
        },
      });
    }
  }
}

async function recordAttendance(sessions, students) {
  console.log('Recording attendance...');
  
  // Only record attendance for past sessions
  const pastSessions = sessions.filter(session => session.start < new Date());
  
  if (pastSessions.length === 0) {
    console.log('No past sessions to record attendance for');
    return;
  }
  
  for (const session of pastSessions) {
    // Get enrolled students for this session's class
    const enrollments = await prisma.enrollment.findMany({
      where: { classId: session.classId },
      select: { studentId: true },
    });
    
    const enrolledStudentIds = enrollments.map(e => e.studentId);
    
    // Record attendance for each enrolled student
    for (const studentId of enrolledStudentIds) {
      const absenceTypes = ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'];
      const weights = [0.7, 0.1, 0.1, 0.1]; // Higher probability for PRESENT
      
      const randomAbsence = faker.helpers.weightedArrayElement(
        absenceTypes.map((type, i) => ({ value: type, weight: weights[i] }))
      );
      
      // For present students, there's no note
      // For others, add a reason
      let note = null;
      if (randomAbsence !== 'PRESENT') {
        const reasons = [
          'Family emergency',
          'Sick day',
          'Doctor appointment',
          'Transportation issue',
          faker.lorem.sentence(),
        ];
        note = faker.helpers.arrayElement(reasons);
      }
      
      // Timestamp is sometime during the session
      const sessionDuration = session.end.getTime() - session.start.getTime();
      const randomOffset = faker.number.int({ min: 0, max: sessionDuration });
      const timestamp = new Date(session.start.getTime() + randomOffset);
      
      await prisma.attendance.create({
        data: {
          sessionId: session.id,
          studentId: studentId,
          present: randomAbsence,
          notes: note,
          timestamp: timestamp,
        },
      });
    }
  }
}

async function createEvaluations(students, classes, sessions) {
  console.log('Creating evaluations...');
  
  // Create evaluations for a subset of students (60%)
  const studentsToEvaluate = students.filter(() => faker.datatype.boolean(0.6));
  
  for (const studentData of studentsToEvaluate) {
    // Get the classes this student is enrolled in
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId: studentData.student.id },
      select: { classId: true },
    });
    
    if (enrollments.length === 0) continue;
    
    // Choose a random class for evaluation
    const randomEnrollment = faker.helpers.arrayElement(enrollments);
    
    // Create the main evaluation
    const evaluation = await prisma.evaluation.create({
      data: {
        classId: randomEnrollment.classId,
        studentId: studentData.student.id,
      },
    });
    
    // Get sessions for this class
    const classSessions = sessions.filter(s => s.classId === randomEnrollment.classId);
    
    // Create session evaluations for a few sessions
    const sessionsToEvaluate = classSessions.filter(() => faker.datatype.boolean(0.7));
    
    for (const session of sessionsToEvaluate) {
      const independenceTypes = ['COMPLETELY_INDEPENDENT', 'OCCASIONALLY_SEEKS_HELP', 'FREQUENTLY_SEEKS_HELP'];
      const completionTypes = ['ALWAYS', 'MOSTLY', 'SOMETIMES', 'RARELY'];
      const creativityTypes = [
        'COMPLETELY_INSTRUCTION_FOCUSED',
        'MOSTLY_FOLLOWS_INSTRUCTIONS_RARELY_CONTRIBUTES',
        'DISPLAYS_A_BALANCED_APPROACH',
        'MOSTLY_CREATIVE_SOMETIMES_FOLLOWS_INSTRUCTIONS',
        'COMPLETELY_CREATIVE_AND_INDEPENDENT',
      ];
      const persistencyTypes = ['VERY_PERSISTENT', 'PERSISTENT', 'AVERAGE', 'QUICKLY_GIVES_UP'];
      const adherenceTypes = ['ALWAYS_COMPLIED', 'USUALLY_COMPLIED', 'SOMETIMES_COMPLIED', 'DID_NOT_COMPLY'];
      
      await prisma.sessionEvaluation.create({
        data: {
          active: faker.number.int({ min: 1, max: 10 }),
          independent: faker.helpers.arrayElement(independenceTypes),
          completion: faker.helpers.arrayElement(completionTypes),
          creativity: faker.helpers.arrayElement(creativityTypes),
          persistency: faker.helpers.arrayElement(persistencyTypes),
          adherence: faker.helpers.arrayElement(adherenceTypes),
          notes: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.7 }),
          evaluationId: evaluation.id,
          sessionId: session.id,
        },
      });
    }
    
    // For some students, create a final evaluation
    if (faker.datatype.boolean(0.6)) {
      const levels = ['VERY_BEGINNER', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT', 'SUPER_HERO'];
      
      await prisma.finalEvaluation.create({
        data: {
          roboticsCodingAptitude: faker.number.int({ min: 1, max: 10 }),
          programmingAptitude: faker.number.int({ min: 1, max: 10 }),
          handsOnAptitude: faker.number.int({ min: 1, max: 10 }),
          participation: faker.number.int({ min: 1, max: 10 }),
          listeningSkills: faker.number.int({ min: 1, max: 10 }),
          ruleAdherence: faker.number.int({ min: 1, max: 10 }),
          analyticalIntelligence: faker.number.int({ min: 1, max: 10 }),
          problemSolvingAbility: faker.number.int({ min: 1, max: 10 }),
          creativity: faker.number.int({ min: 1, max: 10 }),
          workSatisfaction: faker.number.int({ min: 1, max: 10 }),
          learningInterest: faker.number.int({ min: 1, max: 10 }),
          teamworkAdaptability: faker.number.int({ min: 1, max: 10 }),
          leadershipSkills: faker.number.int({ min: 1, max: 10 }),
          socialInteraction: faker.number.int({ min: 1, max: 10 }),
          distractabilityLevel: faker.number.int({ min: 1, max: 10 }),
          presentationSkills: faker.number.int({ min: 1, max: 10 }),
          level: faker.helpers.arrayElement(levels),
          notes: faker.helpers.maybe(() => faker.lorem.paragraph(), { probability: 0.6 }),
          evaluationId: evaluation.id,
        },
      });
    }
  }
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });