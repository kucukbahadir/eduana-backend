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
  /**
   * Retrieves children associated with a parent.
   *
   * @param {number} parentId - Parent's ID
   * @returns {Promise<Array>} List of children
   */
  async getChildrenByParentId(parentId) {
    return await prisma.child.findMany({
      where: {
        parentId: parentId,
      },
      include: {
        user: true, // Include user details if needed
      },
    });
}
  /**
   * Retrieves attendance records for a specific child.
   *
   * @param {number} childId - Child's ID
   * @returns {Promise<Array>} List of attendance records
   */
  async getChildAttendance(childId) {
    return await prisma.attendance.findMany({
      where: {
        childId: childId,
      },
    });
  }
  /**
   * Retrieves evaluations for a specific child.
   *
   * @param {number} childId - Child's ID
   * @returns {Promise<Array>} List of evaluations
   */
  async getChildEvaluations(childId) {
    return await prisma.evaluation.findMany({
      where: {
        childId: childId,
      },
    });
  }
  /**
   * Retrieves messages sent by the parent.
   *
   * @param {number} parentId - Parent's ID
   * @returns {Promise<Array>} List of messages
   */
  async getMessagesByParentId(parentId) {
    return await prisma.message.findMany({
      where: {
        parentId: parentId,
      },
      include: {
        child: true, // Include child details if needed
        teacher: true, // Include teacher details if needed
      },
    });
  }
  /**
   * Posts a message from the parent.
   *
   * @param {Object} messageData - Message data
   * @returns {Promise<Object>} Created message
   */
  async postMessage(messageData) {
    return await prisma.message.create({
      data: messageData,
    });
  }
  /**
   * Retrieves messages between a parent and a specific teacher for a specific child.
   *
   * @param {number} childId - Child's ID
   * @param {number} teacherId - Teacher's ID
   * @returns {Promise<Array>} List of messages
   */
  async getMessagesByChildAndTeacher(childId, teacherId) {
    return await prisma.message.findMany({
      where: {
        childId: childId,
        teacherId: teacherId,
      },
      include: {
        child: true, // Include child details if needed
        teacher: true, // Include teacher details if needed
      },
    });
  }
  /**
   * Retrieves messages between a parent and a specific teacher for a specific child.
   *
   * @param {number} parentId - Parent's ID
   * @param {number} childId - Child's ID
   * @param {number} teacherId - Teacher's ID
   * @returns {Promise<Array>} List of messages
   */
  async getMessagesByParentChildAndTeacher(parentId, childId, teacherId) {
    return await prisma.message.findMany({
      where: {
        parentId: parentId,
        childId: childId,
        teacherId: teacherId,
      },
      include: {
        child: true, // Include child details if needed
        teacher: true, // Include teacher details if needed
      },
    });
  }
}
module.exports = new ParentService();