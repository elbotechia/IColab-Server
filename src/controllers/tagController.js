import { TagModel } from '../models/schemas/tagSchema.js';

export class TagController {
    async create(req, res) {
        try {
            const tag = new TagModel(req.body);
            const savedTag = await tag.save();
            
            res.status(201).json({
                success: true,
                message: 'Tag created successfully',
                data: savedTag
            });
        } catch (error) {
            if (error.code === 11000) {
                return res.status(409).json({
                    success: false,
                    message: 'Tag already exists (duplicate tag name)'
                });
            }
            
            res.status(500).json({
                success: false,
                message: 'Error creating tag',
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
            
            if (req.query.search) {
                filter.$or = [
                    { tagName: { $regex: req.query.search, $options: 'i' } },
                    { description: { $regex: req.query.search, $options: 'i' } }
                ];
            }

            if (req.query.color) {
                filter.color = req.query.color;
            }

            const tags = await TagModel
                .find(filter)
                .populate('mediaId')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });

            const total = await TagModel.countDocuments(filter);

            res.status(200).json({
                success: true,
                data: tags,
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
                message: 'Error retrieving tags',
                error: error.message
            });
        }
    }

    async getById(req, res) {
        try {
            const tag = await TagModel
                .findById(req.params.id)
                .populate('mediaId');

            if (!tag) {
                return res.status(404).json({
                    success: false,
                    message: 'Tag not found'
                });
            }

            res.status(200).json({
                success: true,
                data: tag
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving tag',
                error: error.message
            });
        }
    }

    async update(req, res) {
        try {
            const tag = await TagModel.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            ).populate('mediaId');

            if (!tag) {
                return res.status(404).json({
                    success: false,
                    message: 'Tag not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Tag updated successfully',
                data: tag
            });
        } catch (error) {
            if (error.code === 11000) {
                return res.status(409).json({
                    success: false,
                    message: 'Tag already exists (duplicate tag name)'
                });
            }

            res.status(500).json({
                success: false,
                message: 'Error updating tag',
                error: error.message
            });
        }
    }

    async delete(req, res) {
        try {
            const tag = await TagModel.findByIdAndDelete(req.params.id);

            if (!tag) {
                return res.status(404).json({
                    success: false,
                    message: 'Tag not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Tag deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error deleting tag',
                error: error.message
            });
        }
    }

    async getByName(req, res) {
        try {
            const tag = await TagModel
                .findOne({ tagName: req.params.tagName })
                .populate('mediaId');

            if (!tag) {
                return res.status(404).json({
                    success: false,
                    message: 'Tag not found'
                });
            }

            res.status(200).json({
                success: true,
                data: tag
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving tag',
                error: error.message
            });
        }
    }

    async getPopular(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 10;
            
            // Esta é uma implementação básica. Em um cenário real, você faria 
            // uma agregação mais complexa baseada no uso das tags
            const tags = await TagModel
                .find({})
                .populate('mediaId')
                .limit(limit)
                .sort({ createdAt: -1 });

            res.status(200).json({
                success: true,
                data: tags,
                count: tags.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving popular tags',
                error: error.message
            });
        }
    }

    async searchByColor(req, res) {
        try {
            const { color } = req.params;
            
            const tags = await TagModel
                .find({ color: color })
                .populate('mediaId')
                .sort({ createdAt: -1 });

            res.status(200).json({
                success: true,
                data: tags,
                count: tags.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving tags by color',
                error: error.message
            });
        }
    }
}
