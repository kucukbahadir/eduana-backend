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
                    where: { username: credentials.name },
                });

                if (user && user.password === credentials.code && user.role === "STUDENT") {
                    return { success: true, redirect: "/dashboard/student" };
                }
            }
            // Authenticate PARENT
            else if (userType === "PARENT") {
                user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (user && user.password === credentials.password && user.role === "PARENT") {
                    return { success: true, redirect: "/dashboard/parent" };
                }
            }
            // Authenticate EDUCATORS (Admin, Coordinator, Teacher)
            else if (["ADMIN", "COORDINATOR", "TEACHER"].includes(userType)) {
                user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (user && user.password === credentials.password && user.role === userType) {
                    return { success: true, redirect: `/dashboard/${user.role.toLowerCase()}` };
                }
            }

            // If user is not found or credentials are incorrect
            return { success: false, message: "Invalid credentials or role mismatch" };
        } catch (error) {
            console.error("❌ Error during authentication:", error);
            return { success: false, message: "An error occurred during authentication" };
        }
    }
}

module.exports = new UserService();
