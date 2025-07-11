const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const { faker } = require("@faker-js/faker/locale/nl");
const saltRounds = 10;

async function main() {
  console.log("Starting database seeding...");

  await cleanDatabase();

  // Create locations first
  const locations = await createLocations(3);

  // Create users with different roles - ONLY 1 TEACHER
  const adminUsers = await createUsers(1, "ADMIN", locations);
  const teacherUsers = await createUsers(1, "TEACHER", locations);
  const coordinatorUsers = await createUsers(2, "COORDINATOR", locations);
  const parentUsers = await createUsers(10, "PARENT", locations);
  const studentUsers = await createUsers(20, "STUDENT", locations);

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
  const curricula = await createCurricula(6); // This will create all 6 program types

  // Create levels for curricula
  const levels = await createLevels(curricula);

  // Create 14 classes - TWO FOR EACH DAY OF THE WEEK (7 days × 2 = 14)
  const classes = await createClasses(14, curricula, locations);

  // Enroll students in classes
  await enrollStudentsInClasses(studentUsers, classes);

  // Create sessions with better time distribution
  const sessions = await createSessions(classes, curricula, locations);

  // Assign the SAME teacher to ALL sessions of each class
  await assignTeachersToSessions(teacherUsers, sessions, classes);

  // Create questions for lessons
  await createQuestions(curricula, levels);

  // Create games and learning goals
  const games = await createGames();
  await createGameLearningGoals(games);

  // Record attendance
  await recordAttendance(sessions, studentUsers);

  // Create evaluations
  await createEvaluations(studentUsers, sessions, teacherUsers);

  // Create student progress tracking
  await createStudentKeywordProgress(studentUsers, curricula);

  // Create game sessions and learning goal logs
  await createGameSessions(studentUsers, games, sessions);
  await createStudentGameLearningGoalLogs(studentUsers, games);

  // Create announcements
  await createAnnouncements(classes, locations, adminUsers.concat(teacherUsers));

  console.log("Database seeding completed successfully!");
}

async function cleanDatabase() {
  console.log("Cleaning existing data...");
  // Delete in order of dependencies
  await prisma.studentGameLearningGoalLog.deleteMany({});
  await prisma.gameSession.deleteMany({});
  await prisma.studentKeywordProgress.deleteMany({});
  await prisma.question.deleteMany({});
  await prisma.gameLearningGoal.deleteMany({});
  await prisma.game.deleteMany({});
  await prisma.level.deleteMany({});
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
  await prisma.lessonObjective.deleteMany({});
  await prisma.keyword.deleteMany({});
  await prisma.resources.deleteMany({});
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
        address: faker.location.streetAddress(),
      },
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
    if (role === "STUDENT") {
      additionalFields = {
        age: faker.number.int({ min: 8, max: 18 }),
        language_preference: faker.helpers.arrayElement(["English", "Spanish", "French", "German"]),
        diet_restrictions: faker.helpers.arrayElement([null, "Vegetarian", "Vegan", "Gluten-free", "Nut allergy"]),
        experience: faker.helpers.maybe(() => "Some prior coding experience", { probability: 0.5 }),
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
      },
    });

    users.push(user);
  }

  return users;
}

async function createBadges(count) {
  console.log(`Creating ${count} badges...`);
  const badges = [];

  const badgeTypes = [
    { name: "Coding Master", description: "Completed 10 coding challenges", icon: "code.svg" },
    { name: "Team Player", description: "Helped 5 other students", icon: "team.svg" },
    { name: "Perfect Attendance", description: "No absences for a full term", icon: "attendance.svg" },
    { name: "Problem Solver", description: "Solved a complex problem independently", icon: "problem.svg" },
    { name: "Creative Thinker", description: "Created an original project", icon: "creative.svg" },
    { name: "Early Bird", description: "Always arrives on time", icon: "clock.svg" },
    { name: "Public Speaker", description: "Gave an excellent presentation", icon: "presentation.svg" },
    { name: "Community Builder", description: "Organized a group activity", icon: "community.svg" },
    { name: "Quick Learner", description: "Mastered new concepts rapidly", icon: "learn.svg" },
    { name: "Robotics Pro", description: "Built a functioning robot", icon: "robot.svg" },
  ];

  for (let i = 0; i < count; i++) {
    const badgeType = badgeTypes[i % badgeTypes.length];

    const badge = await prisma.badge.create({
      data: {
        name: badgeType.name,
        description: badgeType.description,
        icon: badgeType.icon,
      },
    });

    badges.push(badge);
  }

  return badges;
}

async function assignBadgesToUsers(users, badges) {
  console.log("Assigning badges to users...");

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
          },
        });
      }
    }
  }
}

async function addGamificationPoints(users) {
  console.log("Adding gamification points to users...");

  const pointCategories = ["Attendance", "Participation", "Completed Projects", "Helping Others", "Extra Credit", "Challenges Completed", "Perfect Score"];

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
          },
        });
      }
    }
  }
}

async function linkParentsToStudents(parentUsers, studentUsers) {
  console.log("Linking parents to students...");

  // Each student gets 1-2 parents
  for (const student of studentUsers) {
    const parentCount = faker.number.int({ min: 1, max: 2 });
    const shuffledParents = [...parentUsers].sort(() => 0.5 - Math.random());

    for (let i = 0; i < Math.min(parentCount, shuffledParents.length); i++) {
      await prisma.parentAccount.create({
        data: {
          parent_id: shuffledParents[i].id,
          student_id: student.id,
        },
      });
    }
  }
}

async function createExternalAccounts(studentUsers) {
  console.log("Creating external accounts for students...");

  const platforms = ["Scratch", "Code.org", "GitHub", "Replit", "Khan Academy", "Codecademy"];

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
              username: `${student.full_name.toLowerCase().replace(/\s/g, "")}_${platform.toLowerCase()}`,
              password: "encryptedPassword123",
            }),
          },
        });
      }
    }
  }
}

async function createCurricula(count) {
  console.log(`Creating curricula for each program type...`);
  const curricula = [];

  const programTypes = {
    "Essential Coding Skills": [
      "Sequencing",
      "Variables and Data Types",
      "Control Structures",
      "Functions and Procedures",
      "Debugging and Error Handling",
    ],
    "Essential Robotics Skills": [
      "Basic Robotics Concepts",
      "Sensors and Actuators",
      "Programming Robots",
      "Robot Design and Construction",
      "Robot Control Systems",
    ],
    "Navigating Fundamental Electronics": [
      "Basic Circuit Theory",
      "Components and Their Functions",
      "Building Simple Circuits",
      "Understanding Voltage, Current, and Resistance",
      "Safety in Electronics",
    ],
    "Navigating Computer Hardware": [
      "Understanding Computer Components",
      "Assembling a Computer",
      "Troubleshooting Hardware Issues",
      "Upgrading Computer Components",
      "Computer Maintenance and Care",
    ],
    "Internet Essentials": [
      "Understanding the Internet",
      "Web Browsing and Search Engines",
      "Online Safety and Privacy",
      "Digital Communication",
      "Introduction to Web Development",
    ],
    "Essential Artificial Intelligence": [
      "Introduction to AI Concepts",
      "Machine Learning Basics",
      "AI in Everyday Life",
      "Ethics of AI",
      "Building Simple AI Models",
    ],
  };

  const difficultyLevels = [1, 2, 3];

  // Pre-generate a set of unique keyword names to avoid collisions
  const uniqueKeywordNames = new Set();
  for (let i = 0; i < 100; i++) {
    uniqueKeywordNames.add(`${faker.science.chemicalElement().name}_${faker.science.chemicalElement().name}_${i}`);
  }
  const uniqueKeywords = Array.from(uniqueKeywordNames);

  // Create one curriculum for each program type with different difficulty levels
  const programTypeKeys = Object.keys(programTypes);
  
  for (let i = 0; i < Math.min(count, programTypeKeys.length); i++) {
    const programType = programTypeKeys[i];
    const difficultyLevel = difficultyLevels[i % difficultyLevels.length];

    console.log(`Creating curriculum: ${programType} - Level ${difficultyLevel}`);

    const curriculum = await prisma.curriculum.create({
      data: {
        title: `${programType} - Level ${difficultyLevel}`,
        program_type: programType,
        difficulty_level: difficultyLevel,
      },
    });

    const lessonTitles = programTypes[programType];
    console.log(`  Creating ${lessonTitles.length} lessons for ${programType}`);

    for (let j = 0; j < lessonTitles.length; j++) {
      const lessonTitle = lessonTitles[j];
      
      const lesson = await prisma.lesson.create({
        data: {
          curriculum_id: curriculum.id,
          title: lessonTitle,
          description: `${lessonTitle}: ${faker.lorem.paragraph()}`,
        },
      });
      
      // Create keywords for each lesson
      const keywords = [];
      const keywordCount = faker.number.int({ min: 3, max: 6 });

      for (let k = 0; k < keywordCount; k++) {
        // Get a unique keyword name
        let keywordName;
        if (uniqueKeywords.length > 0) {
          keywordName = uniqueKeywords.pop();
        } else {
          keywordName = `kw_${faker.word.noun()}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        }

        // Create or find the keyword
        let keyword = await prisma.keyword.findUnique({
          where: { name: keywordName },
        });

        if (!keyword) {
          keyword = await prisma.keyword.create({
            data: {
              name: keywordName,
              description: faker.lorem.sentence(),
            },
          });
        }

        keywords.push(keyword);

        // Create the relationship between lesson and keyword
        await prisma.lessonKeyword.create({
          data: {
            lesson_id: lesson.id,
            keyword_id: keyword.id,
          },
        });
      }

      // Create lesson objectives
      const objectiveCount = faker.number.int({ min: 2, max: 4 });
      for (let obj = 0; obj < objectiveCount; obj++) {
        const objective = `Learning objective ${obj + 1}: ${faker.lorem.sentence()}`;
        const descriptions = [];
        const descCount = faker.number.int({ min: 2, max: 4 });

        for (let desc = 0; desc < descCount; desc++) {
          descriptions.push(faker.lorem.sentence());
        }

        await prisma.lessonObjective.create({
          data: {
            lesson_id: lesson.id,
            objective: objective,
            descriptions: descriptions,
          },
        });
      }

      const languages = ["English", "Dutch", "French", "German"];

      // Create presentation slides & kahoot resources
      const slideCount = 2;
      for (let s = 1; s <= slideCount; s++) {
        const language = faker.helpers.arrayElement(languages);

        await prisma.resources.create({
          data: {
            lesson_id: lesson.id,
            url: `https://slides.eduana.example/${curriculum.id}/${lesson.id}/slide${s}.pdf`,
            type: "SLIDES",
            language: language,
          },
        });

        await prisma.resources.create({
          data: {
            lesson_id: lesson.id,
            url: `https://kahoot.eduana.example/${curriculum.id}/${lesson.id}`,
            type: "KAHOOT",
            language: language,
          },
        });
      }
    }

    curricula.push(curriculum);
  }

  console.log(`Created ${curricula.length} curricula with complete lesson sets`);
  return curricula;
}

async function createLevels(curricula) {
  console.log("Creating levels for curricula...");
  const levels = [];

  for (const curriculum of curricula) {
    // Create 3-5 levels for each curriculum
    const levelCount = faker.number.int({ min: 3, max: 5 });

    for (let i = 1; i <= levelCount; i++) {
      const level = await prisma.level.create({
        data: {
          curriculum_id: curriculum.id,
          level_number: i,
          title: `Level ${i} - ${curriculum.program_type}`,
          description: faker.lorem.paragraph(),
        },
      });

      levels.push(level);
    }
  }

  return levels;
}

async function createQuestions(curricula, levels) {
  console.log("Creating questions for lessons...");

  for (const curriculum of curricula) {
    // Get lessons for this curriculum
    const lessons = await prisma.lesson.findMany({
      where: { curriculum_id: curriculum.id },
      include: { keywords: { include: { keyword: true } } },
    });

    // Get levels for this curriculum
    const curriculumLevels = levels.filter((level) => level.curriculum_id === curriculum.id);

    for (const lesson of lessons) {
      // Create 3-8 questions per lesson
      const questionCount = faker.number.int({ min: 3, max: 8 });

      for (let i = 0; i < questionCount; i++) {
        // Pick a random keyword from this lesson
        if (lesson.keywords.length === 0) continue;

        const randomKeyword = faker.helpers.arrayElement(lesson.keywords).keyword;
        const randomLevel = faker.helpers.arrayElement(curriculumLevels);

        // Generate 3 answer choices
        const answers = [faker.lorem.sentence(), faker.lorem.sentence(), faker.lorem.sentence()];

        const correctAnswerIndex = faker.number.int({ min: 0, max: 2 });

        await prisma.question.create({
          data: {
            lesson_id: lesson.id,
            keyword_id: randomKeyword.id,
            level_id: randomLevel.id,
            question_text: `What is the best way to ${faker.hacker.verb()} ${randomKeyword.name}?`,
            answers: answers,
            correct_answer_index: correctAnswerIndex,
            explanation_correct_answer: faker.lorem.sentence(),
          },
        });
      }
    }
  }
}

async function createGames() {
  console.log("Creating games...");
  const games = [];

  const gameData = [
    {
      name: "Code Runner",
      type: "practice",
      description: "An interactive coding game where students solve programming challenges by running through different levels.",
    },
    {
      name: "Circuit Builder",
      type: "practice",
      description: "A hands-on electronics simulation game where students build and test circuits.",
    },
    {
      name: "Robot Assembly",
      type: "practice",
      description: "A 3D robotics game where students design and program virtual robots to complete tasks.",
    },
    {
      name: "Theory Quiz Master",
      type: "theory",
      description: "A comprehensive quiz game covering programming concepts, electronics theory, and robotics fundamentals.",
    },
    {
      name: "AI Trainer",
      type: "practice",
      description: "An artificial intelligence simulation where students train and test machine learning models.",
    },
    {
      name: "Web Designer",
      type: "practice",
      description: "A creative web development game where students build responsive websites using HTML, CSS, and JavaScript.",
    },
  ];

  for (const gameInfo of gameData) {
    const game = await prisma.game.create({
      data: {
        name: gameInfo.name,
        type: gameInfo.type,
        description: gameInfo.description,
      },
    });

    games.push(game);
  }

  return games;
}

async function createGameLearningGoals(games) {
  console.log("Creating learning goals for games...");

  const learningGoalTemplates = [
    "Complete basic {skill} exercises",
    "Master intermediate {skill} concepts",
    "Apply {skill} in real-world scenarios",
    "Debug and troubleshoot {skill} problems",
    "Collaborate effectively using {skill}",
    "Create original projects with {skill}",
    "Understand theoretical foundations of {skill}",
    "Optimize and improve {skill} solutions",
  ];

  for (const game of games) {
    // Create 3-6 learning goals per game
    const goalCount = faker.number.int({ min: 3, max: 6 });

    for (let i = 0; i < goalCount; i++) {
      const template = faker.helpers.arrayElement(learningGoalTemplates);
      const skill =
        game.type === "theory"
          ? faker.helpers.arrayElement(["programming theory", "electronics principles", "robotics concepts", "AI fundamentals"])
          : faker.helpers.arrayElement(["coding", "circuit building", "robot programming", "web development", "problem solving"]);

      const goalDescription = template.replace("{skill}", skill);

      await prisma.gameLearningGoal.create({
        data: {
          game_id: game.id,
          goal_description: goalDescription,
        },
      });
    }
  }
}

async function createStudentKeywordProgress(students, curricula) {
  console.log("Creating student keyword progress tracking...");

  // Get all keywords from all curricula
  const allKeywords = await prisma.keyword.findMany();

  for (const student of students) {
    // Each student has progress on 30-70% of available keywords
    const progressCount = faker.number.int({
      min: Math.floor(allKeywords.length * 0.3),
      max: Math.floor(allKeywords.length * 0.7),
    });

    const shuffledKeywords = [...allKeywords].sort(() => 0.5 - Math.random());

    for (let i = 0; i < progressCount; i++) {
      const keyword = shuffledKeywords[i];

      // Progress level from 0-100
      const progressLevel = faker.number.int({ min: 0, max: 100 });

      await prisma.studentKeywordProgress.create({
        data: {
          student_id: student.id,
          keyword_id: keyword.id,
          learning_progress: progressLevel,
        },
      });
    }
  }
}

async function createGameSessions(students, games, sessions) {
  console.log("Creating game sessions...");

  for (const student of students) {
    // Each student has played 5-15 game sessions
    const sessionCount = faker.number.int({ min: 5, max: 15 });

    for (let i = 0; i < sessionCount; i++) {
      const game = faker.helpers.arrayElement(games);

      // 70% chance of being linked to a class session
      const linkedSession = faker.helpers.maybe(() => faker.helpers.arrayElement(sessions), { probability: 0.7 });

      // Generate session times
      const startedAt = faker.date.recent({ days: 60 });
      const sessionDuration = faker.number.int({ min: 300, max: 3600 }); // 5 minutes to 1 hour
      const endedAt = new Date(startedAt.getTime() + sessionDuration * 1000);

      await prisma.gameSession.create({
        data: {
          student_id: student.id,
          game_id: game.id,
          session_id: linkedSession?.id,
          started_at: startedAt,
          ended_at: endedAt,
          durationSeconds: sessionDuration,
        },
      });
    }
  }
}

async function createStudentGameLearningGoalLogs(students, games) {
  console.log("Creating student game learning goal achievement logs...");

  // Get all learning goals
  const allLearningGoals = await prisma.gameLearningGoal.findMany({
    include: { game: true },
  });

  for (const student of students) {
    // Each student has achieved 20-60% of available learning goals
    const achievementCount = faker.number.int({
      min: Math.floor(allLearningGoals.length * 0.2),
      max: Math.floor(allLearningGoals.length * 0.6),
    });

    const shuffledGoals = [...allLearningGoals].sort(() => 0.5 - Math.random());

    for (let i = 0; i < achievementCount; i++) {
      const learningGoal = shuffledGoals[i];

      await prisma.studentGameLearningGoalLog.create({
        data: {
          student_id: student.id,
          game_id: learningGoal.game.id,
          goal_id: learningGoal.id,
          achieved_at: faker.date.recent({ days: 90 }),
        },
      });
    }
  }
}

async function createAnnouncements(classes, locations, users) {
  console.log("Creating announcements...");

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
          },
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
          },
        });
      }
    }
  }
}

async function createClasses(count, curricula, locations) {
  console.log(`Creating ${count} classes...`);
  const classes = [];

  // We need at least 14 classes to cover all 7 days with 2 classes each
  // If we have fewer curricula, we'll repeat them
  const actualCount = Math.max(count, 14);

  for (let i = 0; i < actualCount; i++) {
    // Cycle through curricula if we have fewer than needed
    const curriculum = curricula[i % curricula.length];
    const location = faker.helpers.arrayElement(locations);

    // Create more meaningful class names based on curriculum
    const locationPrefix = "NL" + location.name.substring(0, 3).toUpperCase();
    const classNumber = String(i + 1).padStart(2, "0");
    const currentDate = new Date().toISOString().split("T")[0].replace(/-/g, "");
    
    // Include program type abbreviation in class name
    const programAbbrev = curriculum.program_type
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase();
    
    const className = `${locationPrefix}${classNumber}-${currentDate}-${programAbbrev}-L${curriculum.difficulty_level}`;

    console.log(`Creating class: ${className} (${curriculum.program_type})`);

    const classObj = await prisma.class.create({
      data: {
        name: className,
        curriculum_id: curriculum.id,
        location_id: location.id,
      },
    });

    classes.push(classObj);
  }

  return classes;
}

async function enrollStudentsInClasses(students, classes) {
  console.log("Enrolling students in classes...");

  for (const student of students) {
    // Each student enrolls in 1-3 classes
    const classCount = faker.number.int({ min: 1, max: 3 });
    const shuffledClasses = [...classes].sort(() => 0.5 - Math.random());

    for (let i = 0; i < Math.min(classCount, shuffledClasses.length); i++) {
      await prisma.enrollment.create({
        data: {
          user_id: student.id,
          class_id: shuffledClasses[i].id,
        },
      });
    }
  }
}

async function createSessions(classes, curricula, locations) {
  console.log("Creating sessions for classes...");
  const sessions = [];

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Two different time slot sets to avoid overlap
  const timeSlotSets = [
    // Day slots (Set A) - 10 AM to 5 PM
    [
      { start: 10, end: 17 },  // 10:00-17:00 (10 AM - 5 PM)
      { start: 9, end: 17 },   // 9:00-17:00 (9 AM - 5 PM)
      { start: 10, end: 17 },  // 10:00-17:00 (repeat)
      { start: 9, end: 17 },   // 9:00-17:00 (repeat)
      { start: 10, end: 17 },  // 10:00-17:00 (repeat)
      { start: 9, end: 17 },   // 9:00-17:00 (repeat)
      { start: 10, end: 17 },  // 10:00-17:00 (repeat)
    ],
    // Evening slots (Set B) - 7 PM to 11 PM
    [
      { start: 19, end: 23 },  // 19:00-23:00 (7 PM - 11 PM)
      { start: 19, end: 23 },  // 19:00-23:00 (repeat)
      { start: 18, end: 23 },  // 18:00-23:00 (6 PM - 11 PM)
      { start: 19, end: 23 },  // 19:00-23:00 (repeat)
      { start: 18, end: 23 },  // 18:00-23:00 (repeat)
      { start: 19, end: 23 },  // 19:00-23:00 (repeat)
      { start: 19, end: 23 },  // 19:00-23:00 (repeat)
    ]
  ];

  for (let classIndex = 0; classIndex < classes.length; classIndex++) {
    const classObj = classes[classIndex];
    
    // Find curriculum associated with this class
    const curriculum = curricula.find((c) => c.id === classObj.curriculum_id);
    if (!curriculum) {
      console.log(`No curriculum found for class ${classObj.id}`);
      continue;
    }

    // Find lessons for this curriculum in order
    const lessons = await prisma.lesson.findMany({
      where: { curriculum_id: curriculum.id },
      orderBy: { id: 'asc' },
    });

    if (lessons.length === 0) {
      console.log(`No lessons found for curriculum ${curriculum.id}`);
      continue;
    }

    // Assign each class to a specific day of the week (two classes per day)
    const dayOfWeek = Math.floor(classIndex / 2) % 7;
    const timeSlotSet = classIndex % 2; // Alternate between time slot sets
    
    const timeSlotSetName = timeSlotSet === 0 ? 'A (Day - 10 AM to 5 PM)' : 'B (Evening - 7 PM to 11 PM)';
    console.log(`Creating class ${classIndex + 1} (${curriculum.program_type}) for ${dayNames[dayOfWeek]}s - ${lessons.length} lessons - Time Set ${timeSlotSetName}`);
    
    const timeSlots = timeSlotSets[timeSlotSet];
    const timeSlot = timeSlots[Math.floor(classIndex / 2) % timeSlots.length];

    // Total weeks = exact number of lessons (no extra review weeks for now)
    const totalWeeks = lessons.length;
    
    // Start exactly 2 weeks ago
    const currentDate = new Date();
    const classStartDate = new Date(currentDate);
    classStartDate.setDate(currentDate.getDate() - 14);
    
    // Find the first occurrence of the desired day of week
    const firstSessionDate = new Date(classStartDate);
    const daysToAdd = (dayOfWeek - firstSessionDate.getDay() + 7) % 7;
    firstSessionDate.setDate(firstSessionDate.getDate() + daysToAdd);

    // Create sessions - one per lesson, in order
    for (let week = 0; week < totalWeeks; week++) {
      const sessionDate = new Date(firstSessionDate);
      sessionDate.setDate(firstSessionDate.getDate() + (week * 7));
      
      const startTime = new Date(sessionDate);
      startTime.setHours(timeSlot.start, 0, 0, 0);
      
      const endTime = new Date(sessionDate);
      endTime.setHours(timeSlot.end, 0, 0, 0);
      
      // Use lessons in exact order - no cycling, no duplicates
      const selectedLesson = lessons[week];
      
      const startFormatted = timeSlot.start >= 12 ? `${timeSlot.start - 12 || 12} PM` : `${timeSlot.start} AM`;
      const endFormatted = timeSlot.end >= 12 ? `${timeSlot.end - 12 || 12} PM` : `${timeSlot.end} AM`;
      
      console.log(`  Week ${week + 1}: ${selectedLesson.title} (${startFormatted} - ${endFormatted})`);

      // Location assignment
      let locationConnectObj = undefined;
      const useClassLocation = faker.datatype.boolean(0.8);
      if (useClassLocation && classObj.location_id) {
        locationConnectObj = {
          connect: { id: classObj.location_id },
        };
      } else {
        const randomLocationId = faker.helpers.maybe(() => faker.helpers.arrayElement(locations).id, { probability: 0.9 });
        if (randomLocationId) {
          locationConnectObj = {
            connect: { id: randomLocationId },
          };
        }
      }

      const sessionData = {
        date: sessionDate,
        start_time: startTime,
        end_time: endTime,
        class: {
          connect: { id: classObj.id },
        },
        lesson: {
          connect: { id: selectedLesson.id },
        },
      };

      if (locationConnectObj) {
        sessionData.location = locationConnectObj;
      }

      const session = await prisma.session.create({
        data: sessionData,
      });

      sessions.push(session);
    }
  }

  return sessions;
}

// Updated assignTeachersToSessions function - same teacher for all sessions of a class
async function assignTeachersToSessions(teachers, sessions, classes) {
  console.log("Assigning teachers to sessions...");

  // Since we only have 1 teacher, assign them to all sessions
  const mainTeacher = teachers[0];

  // Group sessions by class
  const sessionsByClass = {};
  for (const session of sessions) {
    if (!sessionsByClass[session.class_id]) {
      sessionsByClass[session.class_id] = [];
    }
    sessionsByClass[session.class_id].push(session);
  }

  // Assign the same teacher to all sessions of each class
  for (const classId in sessionsByClass) {
    const classSessions = sessionsByClass[classId];
    
    for (const session of classSessions) {
      await prisma.teaching.create({
        data: {
          session_id: session.id,
          user_id: mainTeacher.id,
        },
      });
    }
  }
}

// Add these functions before the main() function

async function recordAttendance(sessions, students) {
  console.log("Recording attendance...");

  // Get all enrollments to know which students are in which classes
  const enrollments = await prisma.enrollment.findMany();

  // Only consider sessions with a date in the past
  const pastSessions = sessions.filter((s) => s.date < new Date());

  for (const session of pastSessions) {
    // Find all students enrolled in this session's class
    const classEnrollments = enrollments.filter((e) => e.class_id === session.class_id);
    const enrolledStudentIds = classEnrollments.map((e) => e.user_id);

    // Record attendance for each enrolled student
    for (const studentId of enrolledStudentIds) {
      // Determine attendance status with weighted probabilities
      const statusWeights = [
        { weight: 0.8, value: "PRESENT" },
        { weight: 0.1, value: "ABSENT" },
        { weight: 0.05, value: "LATE" },
        { weight: 0.05, value: "EXCUSED" },
      ];

      const status = faker.helpers.weightedArrayElement(statusWeights);

      // Set boolean flags based on status
      let present = null;
      let late = null;
      let excused = null;

      switch (status) {
        case "PRESENT":
          present = true;
          break;
        case "LATE":
          present = true;
          late = true;
          break;
        case "EXCUSED":
          excused = true;
          break;
        case "ABSENT":
          // All flags remain null for absent
          break;
      }

      // Only add notes for non-present students
      let note = null;
      if (status !== "PRESENT") {
        const reasons = ["Family emergency", "Sick day", "Doctor appointment", "Transportation issue", faker.lorem.sentence()];
        note = faker.helpers.arrayElement(reasons);
      }

      // Timestamp during the session
      const timestamp = new Date(session.start_time);
      if (status === "LATE") {
        // If late, timestamp is between start and end
        const sessionDuration = session.end_time - session.start_time;
        const maxDelay = sessionDuration * 0.3; // Up to 30% into the session
        const minDelay = 5 * 60 * 1000; // 5 minutes minimum
        
        // Fix: Ensure max is greater than min
        const actualMaxDelay = Math.max(maxDelay, minDelay + 1000); // Add 1 second buffer
        timestamp.setTime(timestamp.getTime() + faker.number.int({ min: minDelay, max: actualMaxDelay }));
      }

      await prisma.attendance.create({
        data: {
          present: present,
          late: late,
          excused: excused,
          note: note,
          timestamp: timestamp,
          session: {
            connect: { id: session.id },
          },
          user: {
            connect: { id: studentId },
          },
        },
      });
    }
  }
}

async function createEvaluations(students, sessions, teachers) {
  console.log("Creating evaluations for sessions...");

  // Only consider sessions with a date in the past
  const pastSessions = sessions.filter((s) => s.date < new Date());

  // Get all enrollments to know which students are in which classes
  const enrollments = await prisma.enrollment.findMany();

  for (const session of pastSessions) {
    // Find all students enrolled in this session's class
    const classEnrollments = enrollments.filter((e) => e.class_id === session.class_id);
    const enrolledStudentIds = classEnrollments.map((e) => e.user_id);

    // Create evaluations for each enrolled student
    for (const studentId of enrolledStudentIds) {
      // Generate scores (1-5 scale, with bias towards 3-4)
      const scores = {
        participation: faker.number.int({ min: 1, max: 5 }),
        understanding: faker.number.int({ min: 1, max: 5 }),
        collaboration: faker.number.int({ min: 1, max: 5 }),
        problem_solving: faker.number.int({ min: 1, max: 5 }),
        task_completion: faker.number.int({ min: 1, max: 5 }),
      };

      // Remove the feedback field since it doesn't exist in the schema
      await prisma.sessionEvaluation.create({
        data: {
          session_id: session.id,
          user_id: studentId,
          participation_score: scores.participation,
          understanding_score: scores.understanding,
          collaboration_score: scores.collaboration,
          problem_solving_score: scores.problem_solving,
          task_completion_score: scores.task_completion,
          // feedback field removed - not in schema
        },
      });
    }
  }
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
