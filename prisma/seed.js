const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker/locale/nl');
const saltRounds = 10;

async function main() {
  console.log('Starting database seeding...');

  await cleanDatabase();
  
  // Create locations first
  const locations = await createLocations(3);
  
  // Create users with different roles
  const adminUsers = await createUsers(1, 'ADMIN', locations);
  const teacherUsers = await createUsers(5, 'TEACHER', locations);
  const coordinatorUsers = await createUsers(2, 'COORDINATOR', locations);
  const parentUsers = await createUsers(10, 'PARENT', locations);
  const studentUsers = await createUsers(20, 'STUDENT', locations);
  
  // Create badges for gamification
  const badges = await createBadges(8);
  
  // Assign badges to some students
  await assignBadgesToUsers(studentUsers, badges);
  
  // Add gamification points
  await addGamificationPoints(studentUsers);
  
  // Link parents to students
  await linkParentsToStudents(parentUsers, studentUsers);
  
  // Create external platform accounts for some students
  await createExternalAccounts(studentUsers);
  
  // Create curriculum and lessons
  const curricula = await createCurricula(3);
  
  // Create classes
  const classes = await createClasses(5, curricula, locations);
  
  // Enroll students in classes
  await enrollStudentsInClasses(studentUsers, classes);
  
  // Create sessions
  const sessions = await createSessions(classes, curricula, locations);
  
  // Assign teachers to sessions
  await assignTeachersToSessions(teacherUsers, sessions);
  
  // Record attendance
  await recordAttendance(sessions, studentUsers);
  
  // Create evaluations
  await createEvaluations(studentUsers, sessions, teacherUsers);
  
  // Create announcements
  await createAnnouncements(classes, locations, adminUsers.concat(teacherUsers));

  console.log('Database seeding completed successfully!');
}

async function cleanDatabase() {
  console.log('Cleaning existing data...');
  
  // Delete in order of dependencies
  await prisma.userBadge.deleteMany({});
  await prisma.badge.deleteMany({});
  await prisma.gamificationPoints.deleteMany({});
  await prisma.attendance.deleteMany({});
  await prisma.teaching.deleteMany({});
  await prisma.sessionEvaluation.deleteMany({});
  await prisma.finalEvaluation.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.announcement.deleteMany({});
  await prisma.enrollment.deleteMany({});
  await prisma.class.deleteMany({});
  await prisma.externalStudentAccount.deleteMany({});
  await prisma.parentAccount.deleteMany({});
  await prisma.lessonKeyword.deleteMany({});
  await prisma.keyword.deleteMany({});
  await prisma.kahoot.deleteMany({});
  await prisma.presentationSlides.deleteMany({});
  await prisma.lesson.deleteMany({});
  await prisma.curriculum.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.location.deleteMany({});
}

async function createLocations(count) {
  console.log(`Creating ${count} locations...`);
  const locations = [];
  
  for (let i = 1; i <= count; i++) {
    const location = await prisma.location.create({
      data: {
        name: faker.location.city(),
        address: faker.location.streetAddress({ useFullAddress: true }),
      }
    });
    
    locations.push(location);
  }
  
  return locations;
}

async function createUsers(count, role, locations) {
  console.log(`Creating ${count} ${role.toLowerCase()} users...`);
  const users = [];
  
  for (let i = 1; i <= count; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const fullName = `${firstName} ${lastName}`;
    
    // Some fields are more relevant for students than other roles
    let additionalFields = {};
    if (role === 'STUDENT') {
      additionalFields = {
        age: faker.number.int({ min: 8, max: 18 }),
        language_preference: faker.helpers.arrayElement(['English', 'Spanish', 'French', 'German']),
        diet_restrictions: faker.helpers.arrayElement(['None', 'Vegetarian', 'Vegan', 'Gluten-free', 'Nut allergy']),
        experience: faker.helpers.maybe(() => 'Some prior coding experience', { probability: 0.5 }),
        remarks: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.3 }),
      };
    } else {
      additionalFields = {
        age: faker.number.int({ min: 25, max: 65 }),
      };
    }
    
    // Assign a random location to some users
    const locationId = faker.helpers.maybe(() => faker.helpers.arrayElement(locations).id, { probability: 0.7 });
    
    const user = await prisma.user.create({
      data: {
        full_name: fullName,
        role: role,
        location_id: locationId,
        ...additionalFields,
      }
    });
    
    users.push(user);
  }
  
  return users;
}

async function createBadges(count) {
  console.log(`Creating ${count} badges...`);
  const badges = [];
  
  const badgeTypes = [
    { name: 'Coding Master', description: 'Completed 10 coding challenges', icon: 'code.svg' },
    { name: 'Team Player', description: 'Helped 5 other students', icon: 'team.svg' },
    { name: 'Perfect Attendance', description: 'No absences for a full term', icon: 'attendance.svg' },
    { name: 'Problem Solver', description: 'Solved a complex problem independently', icon: 'problem.svg' },
    { name: 'Creative Thinker', description: 'Created an original project', icon: 'creative.svg' },
    { name: 'Early Bird', description: 'Always arrives on time', icon: 'clock.svg' },
    { name: 'Public Speaker', description: 'Gave an excellent presentation', icon: 'presentation.svg' },
    { name: 'Community Builder', description: 'Organized a group activity', icon: 'community.svg' },
    { name: 'Quick Learner', description: 'Mastered new concepts rapidly', icon: 'learn.svg' },
    { name: 'Robotics Pro', description: 'Built a functioning robot', icon: 'robot.svg' },
  ];
  
  for (let i = 0; i < count; i++) {
    const badgeType = badgeTypes[i % badgeTypes.length];
    
    const badge = await prisma.badge.create({
      data: {
        name: badgeType.name,
        description: badgeType.description,
        icon: badgeType.icon,
      }
    });
    
    badges.push(badge);
  }
  
  return badges;
}

async function assignBadgesToUsers(users, badges) {
  console.log('Assigning badges to users...');
  
  for (const user of users) {
    // Give each user a 60% chance of getting 1-3 badges
    if (faker.datatype.boolean(0.6)) {
      const badgeCount = faker.number.int({ min: 1, max: 3 });
      const shuffledBadges = [...badges].sort(() => 0.5 - Math.random());
      
      for (let i = 0; i < Math.min(badgeCount, shuffledBadges.length); i++) {
        await prisma.userBadge.create({
          data: {
            user_id: user.id,
            badge_id: shuffledBadges[i].id,
          }
        });
      }
    }
  }
}

async function addGamificationPoints(users) {
  console.log('Adding gamification points to users...');
  
  const pointCategories = [
    'Attendance',
    'Participation',
    'Completed Projects',
    'Helping Others',
    'Extra Credit',
    'Challenges Completed',
    'Perfect Score',
  ];
  
  for (const user of users) {
    // 80% chance of having points in 1-3 categories
    if (faker.datatype.boolean(0.8)) {
      const categoryCount = faker.number.int({ min: 1, max: 3 });
      const shuffledCategories = [...pointCategories].sort(() => 0.5 - Math.random());
      
      for (let i = 0; i < categoryCount; i++) {
        await prisma.gamificationPoints.create({
          data: {
            user_id: user.id,
            category: shuffledCategories[i],
            points: faker.number.int({ min: 10, max: 100 }),
            description: faker.helpers.maybe(() => `Earned for ${shuffledCategories[i].toLowerCase()}`, { probability: 0.7 }),
          }
        });
      }
    }
  }
}

async function linkParentsToStudents(parentUsers, studentUsers) {
  console.log('Linking parents to students...');
  
  // Each student gets 1-2 parents
  for (const student of studentUsers) {
    const parentCount = faker.number.int({ min: 1, max: 2 });
    const shuffledParents = [...parentUsers].sort(() => 0.5 - Math.random());
    
    for (let i = 0; i < Math.min(parentCount, shuffledParents.length); i++) {
      await prisma.parentAccount.create({
        data: {
          parent_id: shuffledParents[i].id,
          student_id: student.id,
        }
      });
    }
  }
}

async function createExternalAccounts(studentUsers) {
  console.log('Creating external accounts for students...');
  
  const platforms = [
    'Scratch',
    'Code.org',
    'GitHub',
    'Replit',
    'Khan Academy',
    'Codecademy',
  ];
  
  for (const student of studentUsers) {
    // 70% chance of having an external account
    if (faker.datatype.boolean(0.7)) {
      const platformCount = faker.number.int({ min: 1, max: 2 });
      const shuffledPlatforms = [...platforms].sort(() => 0.5 - Math.random());
      
      for (let i = 0; i < platformCount; i++) {
        const platform = shuffledPlatforms[i];
        
        await prisma.externalStudentAccount.create({
          data: {
            student_id: student.id,
            platform_name: platform,
            credentials: JSON.stringify({
              username: `${student.full_name.toLowerCase().replace(/\s/g, '')}_${platform.toLowerCase()}`,
              password: 'encryptedPassword123',
            }),
          }
        });
      }
    }
  }
}

async function createCurricula(count) {
  console.log(`Creating ${count} curricula...`);
  const curricula = [];
  
  const programTypes = [
    'Robotics Fundamentals',
    'Coding for Kids',
    'Advanced Programming',
    'Game Development',
    'Electronics and Circuits',
    'Web Development',
    'AI for Beginners',
  ];
  
  const difficultyLevels = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];
  
  // Pre-generate a set of unique keyword values to avoid collisions
  const uniqueKeywordValues = new Set();
  for (let i = 0; i < 50; i++) {
    uniqueKeywordValues.add(`${faker.word.adjective()}_${faker.word.noun()}`);
  }
  const uniqueKeywords = Array.from(uniqueKeywordValues);
  
  for (let i = 1; i <= count; i++) {
    const programType = faker.helpers.arrayElement(programTypes);
    const difficultyLevel = faker.helpers.arrayElement(difficultyLevels);
    
    const curriculum = await prisma.curriculum.create({
      data: {
        title: `${programType} - ${difficultyLevel}`,
        program_type: programType,
        difficulty_level: difficultyLevel,
      }
    });
    
    // Create 3-5 lessons for each curriculum
    const lessonCount = faker.number.int({ min: 3, max: 5 });
    
    for (let j = 1; j <= lessonCount; j++) {
      const lesson = await prisma.lesson.create({
        data: {
          curriculum_id: curriculum.id,
          title: `Lesson ${j}: ${faker.commerce.productAdjective()} ${programType}`,
          description: faker.lorem.paragraph(),
        }
      });
      
      // Create keywords for each lesson
      const keywords = [];
      const keywordCount = faker.number.int({ min: 3, max: 6 });
      
      for (let k = 0; k < keywordCount; k++) {
        // Get a unique keyword value, or create a truly unique one if we've used all pre-generated ones
        let keywordValue;
        if (uniqueKeywords.length > 0) {
          // Pop a value from our pre-generated list
          keywordValue = uniqueKeywords.pop();
        } else {
          // Create a guaranteed unique value with a timestamp
          keywordValue = `kw_${faker.word.noun()}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        }
        
        // Create or find the keyword
        let keyword = await prisma.keyword.findUnique({
          where: { value: keywordValue }
        });
        
        if (!keyword) {
          keyword = await prisma.keyword.create({
            data: { value: keywordValue }
          });
        }
        
        keywords.push(keyword);
        
        // Create the relationship between lesson and keyword
        await prisma.lessonKeyword.create({
          data: {
            lesson_id: lesson.id,
            keyword_id: keyword.id,
          }
        });
      }
      
      // Create presentation slides
      const slideCount = faker.number.int({ min: 4, max: 8 });
      for (let s = 1; s <= slideCount; s++) {
        await prisma.presentationSlides.create({
          data: {
            lesson_id: lesson.id,
            url: `https://slides.eduana.example/${curriculum.id}/${lesson.id}/slide${s}.pdf`,
          }
        });
      }
      
      // Create kahoots
      await prisma.kahoot.create({
        data: {
          lesson_id: lesson.id,
          url: `https://kahoot.eduana.example/${curriculum.id}/${lesson.id}`,
        }
      });
    }
    
    curricula.push(curriculum);
  }
  
  return curricula;
}

async function createClasses(count, curricula, locations) {
  console.log(`Creating ${count} classes...`);
  const classes = [];
  
  for (let i = 1; i <= count; i++) {
    // 80% chance of assigning a curriculum
    const curriculumId = faker.helpers.maybe(
      () => faker.helpers.arrayElement(curricula).id,
      { probability: 0.8 }
    );
    
    // 90% chance of assigning a location
    const locationId = faker.helpers.maybe(
      () => faker.helpers.arrayElement(locations).id,
      { probability: 0.9 }
    );
    
    const classObj = await prisma.class.create({
      data: {
        curriculum_id: curriculumId,
        location_id: locationId,
      }
    });
    
    classes.push(classObj);
  }
  
  return classes;
}

async function enrollStudentsInClasses(students, classes) {
  console.log('Enrolling students in classes...');
  
  for (const student of students) {
    // Each student enrolls in 1-3 classes
    const classCount = faker.number.int({ min: 1, max: 3 });
    const shuffledClasses = [...classes].sort(() => 0.5 - Math.random());
    
    for (let i = 0; i < Math.min(classCount, shuffledClasses.length); i++) {
      await prisma.enrollment.create({
        data: {
          user_id: student.id,
          class_id: shuffledClasses[i].id,
        }
      });
    }
  }
}

async function createSessions(classes, curricula, locations) {
  console.log('Creating sessions for classes...');
  const sessions = [];
  
  for (const classObj of classes) {
    // Find curriculum associated with this class
    let curriculum = null;
    if (classObj.curriculum_id) {
      curriculum = curricula.find(c => c.id === classObj.curriculum_id);
    }
    
    // Find lessons if curriculum exists
    let lessons = [];
    if (curriculum) {
      lessons = await prisma.lesson.findMany({
        where: { curriculum_id: curriculum.id }
      });
    }
    
    // Skip if no lessons available for this class
    if (lessons.length === 0) {
      console.log(`Skipping sessions for class ${classObj.id} - no lessons available`);
      continue;
    }
    
    // Create 5-10 sessions for each class
    const sessionCount = faker.number.int({ min: 5, max: 10 });
    
    // Start with a date in the recent past
    let sessionDate = faker.date.recent({ days: 30 });
    
    for (let i = 0; i < sessionCount; i++) {
      // Session is on the current date, starting between 9 AM and 5 PM
      const startTime = new Date(sessionDate);
      startTime.setHours(faker.number.int({ min: 9, max: 17 }), 0, 0);
      
      // Session lasts 1-2 hours
      const endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() + faker.number.int({ min: 1, max: 2 }));
      
      // Pick a random lesson from available ones (required relation)
      const selectedLesson = faker.helpers.arrayElement(lessons);
      
      // 70% chance of using the class location, 30% chance of a different location
      let locationConnectObj = undefined;
      const useClassLocation = faker.datatype.boolean(0.7);
      if (useClassLocation && classObj.location_id) {
        locationConnectObj = {
          connect: { id: classObj.location_id }
        };
      } else {
        // Optionally select a random location (80% chance)
        const randomLocationId = faker.helpers.maybe(
          () => faker.helpers.arrayElement(locations).id,
          { probability: 0.8 }
        );
        
        if (randomLocationId) {
          locationConnectObj = {
            connect: { id: randomLocationId }
          };
        }
      }
      
      // Create the session with proper relation syntax
      const sessionData = {
        date: sessionDate,
        start_time: startTime,
        end_time: endTime,
        class: {
          connect: { id: classObj.id }
        },
        lesson: {
          connect: { id: selectedLesson.id }
        }
      };
      
      // Conditionally add location relation if we have a location
      if (locationConnectObj) {
        sessionData.location = locationConnectObj;
      }
      
      const session = await prisma.session.create({
        data: sessionData
      });
      
      sessions.push(session);
      
      // Next session is 7 days later (weekly schedule)
      sessionDate = new Date(sessionDate);
      sessionDate.setDate(sessionDate.getDate() + 7);
    }
  }
  
  return sessions;
}

async function assignTeachersToSessions(teachers, sessions) {
  console.log('Assigning teachers to sessions...');
  
  for (const session of sessions) {
    // Assign 1-2 teachers to each session
    const teacherCount = faker.number.int({ min: 1, max: 2 });
    const shuffledTeachers = [...teachers].sort(() => 0.5 - Math.random());
    
    for (let i = 0; i < Math.min(teacherCount, shuffledTeachers.length); i++) {
      await prisma.teaching.create({
        data: {
          session_id: session.id,
          user_id: shuffledTeachers[i].id,
        }
      });
    }
  }
}

async function recordAttendance(sessions, students) {
  console.log('Recording attendance...');
  
  // Get all enrollments to know which students are in which classes
  const enrollments = await prisma.enrollment.findMany();
  
  // Only consider sessions with a date in the past
  const pastSessions = sessions.filter(s => s.date < new Date());
  
  for (const session of pastSessions) {
    // Find all students enrolled in this session's class
    const classEnrollments = enrollments.filter(e => e.class_id === session.class_id);
    const enrolledStudentIds = classEnrollments.map(e => e.user_id);
    
    // Record attendance for each enrolled student
    for (const studentId of enrolledStudentIds) {
      // Higher probability of PRESENT
      const status = faker.helpers.weightedArrayElement([
        { weight: 0.8, value: 'PRESENT' },
        { weight: 0.1, value: 'ABSENT' },
        { weight: 0.05, value: 'LATE' },
        { weight: 0.05, value: 'EXCUSED' },
      ]);
      
      // Only add notes for non-present students
      let note = null;
      if (status !== 'PRESENT') {
        const reasons = [
          'Family emergency',
          'Sick day',
          'Doctor appointment',
          'Transportation issue',
          faker.lorem.sentence(),
        ];
        note = faker.helpers.arrayElement(reasons);
      }
      
      // Timestamp during the session
      const timestamp = new Date(session.start_time);
      if (status === 'LATE') {
        // If late, timestamp is between start and end
        const sessionDuration = session.end_time - session.start_time;
        const delayInMs = sessionDuration * 0.3; // Up to 30% into the session
        timestamp.setTime(timestamp.getTime() + faker.number.int({ min: 5*60*1000, max: delayInMs }));
      }
      
      await prisma.attendance.create({
        data: {
          session_id: session.id,
          user_id: studentId,
          status: status,
          note: note,
          timestamp: timestamp,
        }
      });
    }
  }
}

async function createEvaluations(students, sessions, teachers) {
  console.log('Creating evaluations...');
  
  // Create session evaluations for past sessions
  const pastSessions = sessions.filter(s => s.date < new Date());
  
  for (const session of pastSessions) {
    // Find students who attended this session
    const attendances = await prisma.attendance.findMany({
      where: { 
        session_id: session.id,
        status: 'PRESENT', 
      }
    });
    
    // For each attending student, 80% chance of getting an evaluation
    for (const attendance of attendances) {
      if (faker.datatype.boolean(0.8)) {
        // Get the lesson for this session
        const sessionData = await prisma.session.findUnique({
          where: { id: session.id },
          include: { lesson: true }
        });
        
        if (!sessionData.lesson_id) continue;
        
        await prisma.sessionEvaluation.create({
          data: {
            session_id: session.id,
            lesson_id: sessionData.lesson_id,
            user_id: attendance.user_id,
            feedback: faker.lorem.paragraph(),
            score: faker.number.int({ min: 1, max: 10 }),
          }
        });
      }
    }
  }
  
  // Create final evaluations for some students (50% chance)
  for (const student of students) {
    if (faker.datatype.boolean(0.5)) {
      // Pick a random teacher as evaluator (80% chance of having evaluator)
      const evaluatorId = faker.helpers.maybe(
        () => faker.helpers.arrayElement(teachers).id,
        { probability: 0.8 }
      );
      
      // Create metrics as JSON
      const metrics = {
        technical_skills: {
          coding: faker.number.int({ min: 1, max: 10 }),
          problem_solving: faker.number.int({ min: 1, max: 10 }),
          logic: faker.number.int({ min: 1, max: 10 }),
        },
        soft_skills: {
          teamwork: faker.number.int({ min: 1, max: 10 }),
          communication: faker.number.int({ min: 1, max: 10 }),
          creativity: faker.number.int({ min: 1, max: 10 }),
        },
        learning_aptitude: {
          speed: faker.number.int({ min: 1, max: 10 }),
          retention: faker.number.int({ min: 1, max: 10 }),
          application: faker.number.int({ min: 1, max: 10 }),
        },
        classroom_behavior: {
          participation: faker.number.int({ min: 1, max: 10 }),
          focus: faker.number.int({ min: 1, max: 10 }),
          rule_adherence: faker.number.int({ min: 1, max: 10 }),
        },
      };
      
      await prisma.finalEvaluation.create({
        data: {
          user_id: student.id,
          evaluator_id: evaluatorId,
          metrics: metrics,
          proficiency: faker.helpers.arrayElement(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
        }
      });
    }
  }
}

async function createAnnouncements(classes, locations, users) {
  console.log('Creating announcements...');
  
  // Class-specific announcements
  for (const classObj of classes) {
    // 80% chance of having 1-3 announcements
    if (faker.datatype.boolean(0.8)) {
      const announcementCount = faker.number.int({ min: 1, max: 3 });
      
      for (let i = 0; i < announcementCount; i++) {
        await prisma.announcement.create({
          data: {
            message: faker.lorem.paragraph(),
            class_id: classObj.id,
            author_id: faker.helpers.arrayElement(users).id,
          }
        });
      }
    }
  }
  
  // Location-specific announcements
  for (const location of locations) {
    // 70% chance of having 1-2 announcements
    if (faker.datatype.boolean(0.7)) {
      const announcementCount = faker.number.int({ min: 1, max: 2 });
      
      for (let i = 0; i < announcementCount; i++) {
        await prisma.announcement.create({
          data: {
            message: faker.lorem.paragraph(),
            location_id: location.id,
            author_id: faker.helpers.arrayElement(users).id,
          }
        });
      }
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