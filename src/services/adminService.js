const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class AdminService {
    async changeUserRole(req, res) {
        const { newRole } = req.body;
        const { id } = req.params;

        if (!newRole) throw new Error("New role is required");

        return prisma.user.update({
            where: {id: parseInt(id)},
            data: {role: newRole},
        });
    }
}

module.exports = new AdminService();