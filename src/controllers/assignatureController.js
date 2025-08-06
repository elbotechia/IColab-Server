import { AssignatureModel } from '../models/schemas/assignatureSchema.js';

export class AssignatureController {
    async create(req, res) {
        try {
            const assignature = new AssignatureModel(req.body);
            const savedAssignature = await assignature.save();
            
            res.status(201).json({
                success: true,
                message: 'Assignature created successfully',
                data: savedAssignature
            });
        } catch (error) {
            if (error.code === 11000) {
                return res.status(409).json({
                    success: false,
                    message: 'Assignature already exists'
                });
            }
            
            res.status(500).json({
                success: false,
                message: 'Error creating assignature',
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
            
            if (req.query.type) {
                filter.type = req.query.type;
            }
            
            if (req.query.search) {
                filter.$or = [
                    { tagName: { $regex: req.query.search, $options: 'i' } },
                    { description: { $regex: req.query.search, $options: 'i' } }
                ];
            }

            const assignatures = await AssignatureModel
                .find(filter)
                .populate('mediasId')
                .populate('modulesId')
                .populate('tasksId')
                .populate('classroomsId')
                .populate('institutionsId')
                .populate('feedbacks')
                .populate('tags')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });

            const total = await AssignatureModel.countDocuments(filter);

            res.status(200).json({
                success: true,
                data: assignatures,
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
                message: 'Error retrieving assignatures',
                error: error.message
            });
        }
    }

    async getById(req, res) {
        try {
            const assignature = await AssignatureModel
                .findById(req.params.id)
                .populate('mediasId')
                .populate('modulesId')
                .populate('tasksId')
                .populate('classroomsId')
                .populate('institutionsId')
                .populate('feedbacks')
                .populate('tags');

            if (!assignature) {
                return res.status(404).json({
                    success: false,
                    message: 'Assignature not found'
                });
            }

            res.status(200).json({
                success: true,
                data: assignature
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving assignature',
                error: error.message
            });
        }
    }

    async update(req, res) {
        try {
            const assignature = await AssignatureModel.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            ).populate('mediasId')
             .populate('modulesId')
             .populate('tasksId')
             .populate('classroomsId')
             .populate('institutionsId')
             .populate('feedbacks')
             .populate('tags');

            if (!assignature) {
                return res.status(404).json({
                    success: false,
                    message: 'Assignature not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Assignature updated successfully',
                data: assignature
            });
        } catch (error) {
            if (error.code === 11000) {
                return res.status(409).json({
                    success: false,
                    message: 'Assignature already exists'
                });
            }

            res.status(500).json({
                success: false,
                message: 'Error updating assignature',
                error: error.message
            });
        }
    }

    async delete(req, res) {
        try {
            const assignature = await AssignatureModel.findByIdAndDelete(req.params.id);

            if (!assignature) {
                return res.status(404).json({
                    success: false,
                    message: 'Assignature not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Assignature deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error deleting assignature',
                error: error.message
            });
        }
    }

    async like(req, res) {
        try {
            const assignature = await AssignatureModel.findByIdAndUpdate(
                req.params.id,
                { $inc: { likes: 1 } },
                { new: true }
            );

            if (!assignature) {
                return res.status(404).json({
                    success: false,
                    message: 'Assignature not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Assignature liked successfully',
                data: { likes: assignature.likes }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error liking assignature',
                error: error.message
            });
        }
    }

    async dislike(req, res) {
        try {
            const assignature = await AssignatureModel.findByIdAndUpdate(
                req.params.id,
                { $inc: { dislikes: 1 } },
                { new: true }
            );

            if (!assignature) {
                return res.status(404).json({
                    success: false,
                    message: 'Assignature not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Assignature disliked successfully',
                data: { dislikes: assignature.dislikes }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error disliking assignature',
                error: error.message
            });
        }
    }
}
