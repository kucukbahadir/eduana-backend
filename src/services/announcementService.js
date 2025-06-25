const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

class AnnouncementService {
    static async getAllAnnouncements() {
        return await prisma.announcement.findMany();
    }

    static async createAnnouncement(announcementData) {
        return await prisma.announcement.create({
            data: announcementData
        });
    }

    static async deleteAnnouncement(id) {
        return await prisma.announcement.delete({
            where: { id: id }
        });
    }
}

export default AnnouncementService;
