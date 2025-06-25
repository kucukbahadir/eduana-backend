import announcementService from '../services/announcementService';

class AnnouncementController {
    static async getAnnouncements(req, res) {
        try {
        const announcements = await announcementService.getAllAnnouncements();
        res.status(200).json(announcements);
        } catch (error) {
        res.status(500).json({ error: "Failed to fetch announcements" });
        }
    }
      
    static async createAnnouncement(req, res) {
        try {
        const announcementData = req.body;
        const newAnnouncement = await announcementService.createAnnouncement(announcementData);
        res.status(201).json(newAnnouncement);
        } catch (error) {
        res.status(500).json({ error: "Failed to create announcement" });
        }
    }
    
    static async deleteAnnouncement(req, res) {
        try {
        const { id } = req.params;
        await announcementService.deleteAnnouncement(id);
        res.status(200).json({ message: "Announcement deleted successfully" });
        } catch (error) {
        res.status(500).json({ error: "Failed to delete announcement" });
        }
    }
}

export default AnnouncementController;