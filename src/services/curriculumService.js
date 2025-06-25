const User = require('../models/userModel');
const { NotFoundError, ValidationError } = require('../errors');
const { validateCurriculum } = require('../validators/curriculumValidator');

class CurriculumService {

    static async getAll() {
        return await Curriculum.findAll({
        include: [{ model: User, as: 'creator' }],
        order: [['createdAt', 'DESC']]
        });
    }
    
    static async create(data, userId) {
        const { error } = validateCurriculum(data);
        if (error) throw new ValidationError(error.details[0].message);
    
        const curriculum = await Curriculum.create({
        ...data,
        creatorId: userId
        });
        return curriculum;
    }
    
    static async update(id, data) {
        const { error } = validateCurriculum(data);
        if (error) throw new ValidationError(error.details[0].message);
    
        const curriculum = await Curriculum.findByPk(id);
        if (!curriculum) throw new NotFoundError('Curriculum not found');
    
        return await curriculum.update(data);
    }
    
    static async delete(id) {
        const curriculum = await Curriculum.findByPk(id);
        if (!curriculum) throw new NotFoundError('Curriculum not found');
    
        await curriculum.destroy();
    }
}
module.exports = CurriculumService;