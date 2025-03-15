const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class UserService {
  /**
   * Finds a user by their ID, including related profile data.
   * 
   * @async
   * @param {string|number} userId - The ID of the user to find
   * @returns {Promise<Object>} The user object with included relations (student, teacher, parent, coordinator, admin)
   * @throws {Error} If the database operation fails
   */
  async findById(userId) {
    return await prisma.user.findUnique({
      where: { id: userId },
      include: {
        student: true,
        teacher: true,
        parent: true,
        coordinator: true,
        admin: true,
      },
    });
  }

  /**
   * Finds a user by their email address.
   * This method searches through multiple role tables (teacher, parent, coordinator, admin)
   * to find a record with the given email. If found, returns the user object with the 
   * associated role record included.
   * 
   * @async
   * @param {string} email - The email address to search for
   * @returns {Promise<Object|null>} The user object with role data if found, null otherwise
   */
  async findByEmail(email) {
    const roleTables = ["teacher", "parent", "coordinator", "admin"];

    for (const roleTable of roleTables) {
      const record = await prisma[roleTable].findUnique({
        where: { email },
        include: { user: true },
      });

      if (record) {
        const user = record.user;
        user[roleTable] = record;
        return user;
      }
    }

    return null;
  }

  /**
   * Finds a user by their username
   * 
   * @async
   * @param {string} username - The username to search for
   * @returns {Promise<Object|null>} The user object with included relations (student, teacher, parent, coordinator, admin) or null if not found
   */
  async findByUsername(username) {
    return await prisma.user.findFirst({
      where: { username },
      include: {
        student: true,
        teacher: true,
        parent: true,
        coordinator: true,
        admin: true,
      },
    });
  }
  
  /**
   * Finds a user's role by their ID.
   * 
   * @async
   * @param {number} id - The unique identifier of the user.
   * @returns {Promise<Object>} A promise that resolves to an object containing the user's role.
   * @throws {Error} If there is an issue with the database operation.
   */
  async updateRole(id, role) {
    return prisma.user.update({
      where: { id },
      data: { role },
    });
  }

  /**
   * Finds a user by a password reset token that has not expired.
   * @async
   * @param {string} token - The password reset token to search for.
   * @returns {Promise<Object|null>} The user object with related profiles (teacher, parent, coordinator, admin) if found, null otherwise.
   */
  async findByResetToken(token) {
    return await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() },
      },
      include: {
        teacher: true,
        parent: true,
        coordinator: true,
        admin: true,
      },
    });
  }

  /**
   * Checks if a username already exists in the database.
   * 
   * @async
   * @param {string} username - The username to check for existence
   * @returns {Promise<boolean>} True if the username exists, false otherwise
   */
  async usernameExists(username) {
    const user = await prisma.user.findFirst({
      where: { username }
    })

    return user !== null
  }
}

module.exports = new UserService();
