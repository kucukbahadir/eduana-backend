const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class ParentService {
  /**
   * Creates a parent profile in the database.
   *
   * @param {string} email - Parent's email address
   * @param {string} phoneNumber - Parent's phone number
   * @param {number} userId - Linked user ID
   * @returns {Promise<void>}
   */
  async createParentProfile(email, phoneNumber, userId) {
    await prisma.parent.create({
      data: {
        email,
        phoneNumber,
        userId,
      },
    });
  }
}

module.exports = new ParentService();