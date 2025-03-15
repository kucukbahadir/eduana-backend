const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class AdminService {
  /**
   * Creates a new admin profile in the database
   * @async
   * @param {string} email - The admin's email address
   * @param {string} phoneNumber - The admin's phone number
   * @param {string|number} userId - The user ID associated with the admin
   * @returns {Promise<void>} A promise that resolves when the admin profile is created
   * @throws {Error} If there is a problem creating the admin profile
   */
  async createAdminProfile(email, phoneNumber, userId) {
    await prisma.admin.create({
      data: {
        email, 
        phoneNumber, 
        userId
      }
    })
  }
}

module.exports = new AdminService();