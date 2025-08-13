import { CourseModel } from '../models/schemas/courseSchema.js';

export class CourseController {
    async create(req, res) {
        try {
            const course = new CourseModel(req.body);
            const savedCourse = await course.save();
            
            res.status(201).json({
                success: true,
                message: 'Curso criado com sucesso',
                data: savedCourse
            });
        } catch (error) {
            if (error.code === 11000) {
                return res.status(409).json({
                    success: false,
                    message: 'Curso já existe (nome duplicado)'
                });
            }
            
            res.status(500).json({
                success: false,
                message: 'Erro ao criar curso',
                error: error.message
            });
        }
    }

    async getAll(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;
            
            const filter = {};
            
            if (req.query.anos) {
                filter.anos = parseInt(req.query.anos);
            }
            
            if (req.query.abbr) {
                filter.abbr = req.query.abbr.toUpperCase();
            }
            
            if (req.query.search) {
                filter.$or = [
                    { curso: { $regex: req.query.search, $options: 'i' } },
                    { abbr: { $regex: req.query.search, $options: 'i' } },
                    { variacoes: { $in: [new RegExp(req.query.search, 'i')] } }
                ];
            }

            const courses = await CourseModel
                .find(filter)
                .skip(skip)
                .limit(limit)
                .sort({ curso: 1 }); // Ordenar por nome do curso

            const total = await CourseModel.countDocuments(filter);

            res.status(200).json({
                success: true,
                data: courses,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    totalItems: total,
                    itemsPerPage: limit
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Erro ao buscar cursos',
                error: error.message
            });
        }
    }

    async getById(req, res) {
        try {
            const course = await CourseModel.findById(req.params.id);

            if (!course) {
                return res.status(404).json({
                    success: false,
                    message: 'Curso não encontrado'
                });
            }

            res.status(200).json({
                success: true,
                data: course
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Erro ao buscar curso',
                error: error.message
            });
        }
    }

    async getByAbbr(req, res) {
        try {
            const course = await CourseModel.findOne({ 
                abbr: req.params.abbr.toUpperCase() 
            });

            if (!course) {
                return res.status(404).json({
                    success: false,
                    message: 'Curso não encontrado'
                });
            }

            res.status(200).json({
                success: true,
                data: course
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Erro ao buscar curso por abreviação',
                error: error.message
            });
        }
    }

    async update(req, res) {
        try {
            const course = await CourseModel.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );

            if (!course) {
                return res.status(404).json({
                    success: false,
                    message: 'Curso não encontrado'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Curso atualizado com sucesso',
                data: course
            });
        } catch (error) {
            if (error.code === 11000) {
                return res.status(409).json({
                    success: false,
                    message: 'Curso já existe (nome duplicado)'
                });
            }

            res.status(500).json({
                success: false,
                message: 'Erro ao atualizar curso',
                error: error.message
            });
        }
    }

    async delete(req, res) {
        try {
            const course = await CourseModel.findByIdAndDelete(req.params.id);

            if (!course) {
                return res.status(404).json({
                    success: false,
                    message: 'Curso não encontrado'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Curso deletado com sucesso'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Erro ao deletar curso',
                error: error.message
            });
        }
    }

    async getByDuration(req, res) {
        try {
            const anos = parseInt(req.params.anos);
            
            if (isNaN(anos) || anos < 1 || anos > 10) {
                return res.status(400).json({
                    success: false,
                    message: 'Duração deve ser um número entre 1 e 10'
                });
            }

            const courses = await CourseModel
                .find({ anos })
                .sort({ curso: 1 });

            res.status(200).json({
                success: true,
                data: courses,
                count: courses.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Erro ao buscar cursos por duração',
                error: error.message
            });
        }
    }

    async addVariation(req, res) {
        try {
            const { variacao } = req.body;
            
            if (!variacao || typeof variacao !== 'string') {
                return res.status(400).json({
                    success: false,
                    message: 'Variação deve ser uma string válida'
                });
            }

            const course = await CourseModel.findByIdAndUpdate(
                req.params.id,
                { $addToSet: { variacoes: variacao.trim() } },
                { new: true }
            );

            if (!course) {
                return res.status(404).json({
                    success: false,
                    message: 'Curso não encontrado'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Variação adicionada com sucesso',
                data: course
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Erro ao adicionar variação',
                error: error.message
            });
        }
    }

    async removeVariation(req, res) {
        try {
            const { variacao } = req.body;
            
            if (!variacao || typeof variacao !== 'string') {
                return res.status(400).json({
                    success: false,
                    message: 'Variação deve ser uma string válida'
                });
            }

            const course = await CourseModel.findByIdAndUpdate(
                req.params.id,
                { $pull: { variacoes: variacao.trim() } },
                { new: true }
            );

            if (!course) {
                return res.status(404).json({
                    success: false,
                    message: 'Curso não encontrado'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Variação removida com sucesso',
                data: course
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Erro ao remover variação',
                error: error.message
            });
        }
    }
}
