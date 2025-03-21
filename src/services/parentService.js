const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class ParentService {
  /**
   * Creates a new parent profile in the database
   * @async
   * @param {string} email - The parent's email address
   * @param {string} phoneNumber - The parent's phone number
   * @param {string|number} userId - The user ID associated with the parent
   * @returns {Promise<void>} A promise that resolves when the parent profile is created
   * @throws {Error} If there is a problem creating the parent profile
   */
  async createParentProfile(email, phoneNumber, userId) {
    await prisma.parent.create({
      data: {
        email, 
        phoneNumber, 
        userId
      }
    })
  }
}

module.exports = new ParentService();