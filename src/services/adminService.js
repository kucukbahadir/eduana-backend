const { PrismaClient } = require("@prisma/client"); // Use require instead of import

const prisma = new PrismaClient(); // Instantiate PrismaClient

class AdminService {
    async changeUserRole(req, res) {
        try {
            const { newRole, userId } = req.body;
            const updatedUser = await prisma.user.update({ // Ensure "user" is lowercase
                where: { id: userId },
                data: { role: newRole },
            });
            res.status(200).json(updatedUser);
        } catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    }
}

module.exports = new AdminService(); // Ensure correct export
