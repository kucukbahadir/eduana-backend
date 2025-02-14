const { PrismaClient } = require("@prisma/client"); // Import PrismaClient from @prisma/client
const prisma = new PrismaClient(); // Instantiate PrismaClient

class UserService {
    // Static method to fetch user details by userId
    static async fetchUserDetails(userId) {
        try {
            // Query the database to find a unique user by id
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true
        }});

            // If user is found, return the user object
            if (user) {
                return user;
            } else {
                // If user is not found, throw an error
                throw new Error('User not found');
            }
        } catch (err) {
            // Log the error to the console and rethrow it
            console.error(err);
            throw err;
        }
    }
}

module.exports = UserService; // Export the UserService class