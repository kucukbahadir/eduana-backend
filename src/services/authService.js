const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const emailConfig = require("../config/emailConfig");
const nodemailer = require("nodemailer");

class AuthService {
  /**
   * Creates a new user in the database
   * @param {string} name - The full name of the user
   * @param {string} username - The username for the user
   * @param {string} password - The password for the user
   * @param {string} role - The role of the user (will be converted to uppercase)
   * @returns {Promise<Object>} A promise that resolves to the created user object
   */
  async createUser(name, username, password, role) {
    return await prisma.user.create({
      data: {
        name,
        username,
        password,
        role: role.toUpperCase()
      }
    })
  }

  /**
   * Updates a user's password reset token and its expiry time in the database.
   * @param {string|number} id - The unique identifier of the user.
   * @param {string} token - The reset token to be stored.
   * @param {Date} tokenExpiry - The expiration date and time for the reset token.
   * @returns {Promise<Object>} A promise that resolves to the updated user object.
   */
  async updateResetToken(id, token, tokenExpiry) {
    return await prisma.user.update({
      where: { id },
      data: {
        resetToken: token,
        resetTokenExpiry: tokenExpiry,
      },
    });
  }

  /**
   * Resets a user's password and clears the reset token information.
   * 
   * @async
   * @param {Object} user - The user object containing the user's ID.
   * @param {String} password - The new password to set for the user (already hashed).
   * @returns {Promise<void>} - A promise that resolves when the password has been reset.
   */
  async resetPassword(user, password) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
  }

  /**
   * Sends a password reset email to the specified email address
   * @param {string} email - The email address of the user
   * @param {string} token - The password reset token
   * @param {string} url - The base URL of the application
   * @returns {Promise<Object>} A promise that resolves with the info object from nodemailer on success, or rejects with an error
   */
  async sendPasswordResetEmail(email, token, url) {
    const mailOptions = {
      from: emailConfig.sender,
      to: email,
      subject: "Password Reset",
      html: `
        <h1>Password Reset</h1>
        <p>You are receiving this email because you (or someone else) have requested the reset of the password for your account.</p>
        <p>Please click on the following link, or paste this into your browser to complete the process:</p>
        <a href="${url}/api/users/update-password/${token}">${url}/api/users/update-password/${token}</a>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
      `,
    };

    return new Promise((resolve, reject) => {
      const transporter = nodemailer.createTransport(emailConfig.smtp);
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) reject(error);
        else resolve(info);
      });
    });
  }
}

module.exports = new AuthService();