const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class User {
    constructor(id, username, email, role, createdAt, updatedAt) {
        // Initialize the User object with the provided parameters
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Static method to fetch user details from the database using Prisma
    static async fetchUserDetails(userId) {
        try {
            // Fetch user details by userId using Prisma
            const user = await prisma.user.findUnique({
                where: { id: userId },
            });

            if (user) {
                // If user is found, create and return a new User object
                return new User(user.id, user.username, user.email, user.role, user.createdAt, user.updatedAt);
            } else {
                // If no user is found, throw an error
                throw new Error('User not found');
            }
        } catch (err) {
            // Log and rethrow any errors that occur during the query
            console.error(err);
            throw err;
        }
    }
}

// Export the User class for use in other modules
module.exports = User;