const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class StudentService {
  /**
   * Creates a new student profile in the database.
   * 
   * @async
   * @param {number} age - The age of the student.
   * @param {string} languagePreference - The preferred language of the student.
   * @param {string} dietRestrictions - Any dietary restrictions the student may have.
   * @param {string} previousExperience - The student's previous experience.
   * @param {string} miscellaneousRemarks - Any additional remarks about the student.
   * @param {string} parentPhoneNumber - The phone number of the student's parent.
   * @param {string|number} userId - The ID of the user to connect with this student profile.
   * @returns {Promise<Object>} The created student profile object.
   * @throws {Error} If there is an issue with the database operation.
   */
  async createStudentProfile(age, languagePreference, dietRestrictions, previousExperience, miscellaneousRemarks, parentPhoneNumber, userId) {
    return await prisma.student.create({
      data: {
        age,
        languagePreference,
        dietRestrictions,
        previousExperience,
        miscellaneousRemarks,
        parentPhoneNumber,
        user: { connect: { id: userId } }
      }
    })
  }
}

module.exports = new StudentService();