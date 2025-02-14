const { PrismaClient } = require("@prisma/client"); // Import PrismaClient from @prisma/client
const prisma = new PrismaClient(); // Instantiate PrismaClient

class UserService {
    // Static method to fetch user details by userId
    static async fetchUserDetails(userId) {
        try {
            // Query the database to find a unique user by id
            const user = await prisma.user.findUnique({
                omit: {password: true}, //Sometimes this is wacky. If you get an error it's because your prisma client is out of date. Then use omitApi instead.
                where: { id: userId }
                });

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