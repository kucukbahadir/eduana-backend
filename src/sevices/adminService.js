import prisma from "@prisma/client";

class AdminService {
    async changeUserRole(req, res) {
        try {
            const {newRole, userId} = req.body;
            const updatedUser = await prisma.User.update({
                where: {id: userId},
                data: {role: newRole},
            });
            res.status(200).json(updatedUser);
        } catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    }
} export default new AdminService();