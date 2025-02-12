const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class UserService {
    // Function to authenticate user based on userType and credentials
    async authenticateUser(userType, credentials) {
        try {
            // Normalize userType to uppercase
            userType = userType.toUpperCase();

            let user = null;

            // Authenticate STUDENT
            if (userType === "STUDENT") {
                user = await prisma.user.findUnique({
                    where: {
                        username: credentials.name,  // Match by username for STUDENT
                    },
                });

                if (user && user.password === credentials.code) { // Assuming 'code' is the password for students
                    return { success: true, redirect: "/dashboard/student" };
                }
            }
            // Authenticate PARENT
            else if (userType === "PARENT") {
                user = await prisma.user.findUnique({
                    where: { email: credentials.email },  // Use email for PARENT
                });

                if (user && user.password === credentials.password) {
                    return { success: true, redirect: "/dashboard/parent" };
                }
            }
            // Authenticate EDUCATORS (Admin, Coordinator, Teacher)
            else if (userType === "EDUCATORS") {
                user = await prisma.user.findUnique({
                    where: { email: credentials.email },  // Use email for EDUCATORS
                });

                if (user && user.password === credentials.password) {
                    return { success: true, redirect: `/dashboard/${user.role.toLowerCase()}` }; // Dynamic redirect based on role
                }
            }

            // If user is not found or credentials are incorrect
            return { success: false, message: "Invalid credentials" };
        } catch (error) {
            console.error("❌ Error during authentication:", error);
            return { success: false, message: "An error occurred during authentication" };
        }
    }
}

module.exports = new UserService();

