import prisma from "@prisma/client";

class AdminController {

    // make a changeUserRole function that changes the old role with the new one using the users userid using prisma
    async changeUserRole(req, res) {
        try {
            const {newRole, userId} = req.body;
            const updatedUser = await prisma.user.update({
                where: {id: userId},
                data: {role: newRole},
            });
            res.status(200).json(updatedUser);
        } catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    }
}
