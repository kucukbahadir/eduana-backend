const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class CoordinatorService {
  /**
   * Creates a new coordinator profile in the database
   * @async
   * @param {string} email - The coordinator's email address
   * @param {string} phoneNumber - The coordinator's phone number
   * @param {string|number} userId - The user ID associated with the coordinator
   * @returns {Promise<void>} A promise that resolves when the coordinator profile is created
   * @throws {Error} If there is a problem creating the coordinator profile
   */
  async createCoordinatorProfile(email, phoneNumber, userId) {
    await prisma.coordinator.create({
      data: {
        email, 
        phoneNumber, 
        userId
      }
    })
  }
}

module.exports = new CoordinatorService();