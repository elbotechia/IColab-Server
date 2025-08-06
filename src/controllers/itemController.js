import { v4 as uuidv4 } from "uuid";
import { ItemModel } from '../models/schemas/itemSchema.js';

export class ItemController {
    async create(req, res) {
        try {
            const item = new ItemModel(req.body);
            const savedItem = await item.save();
            
            res.status(201).json({
                success: true,
                message: 'Item created successfully',
                data: savedItem
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error creating item',
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

            const items = await ItemModel
                .find(filter)
                .populate('mediasId')
                .populate('feedbacks')
                .populate('tags')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });

            const total = await ItemModel.countDocuments(filter);

            res.status(200).json({
                success: true,
                data: items,
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
                message: 'Error retrieving items',
                error: error.message
            });
        }
    }

    async getById(req, res) {
        try {
            const item = await ItemModel
                .findById(req.params.id)
                .populate('mediasId')
                .populate('feedbacks')
                .populate('tags');

            if (!item) {
                return res.status(404).json({
                    success: false,
                    message: 'Item not found'
                });
            }

            res.status(200).json({
                success: true,
                data: item
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving item',
                error: error.message
            });
        }
    }

    async update(req, res) {
        try {
            const item = await ItemModel.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            ).populate('mediasId')
             .populate('feedbacks')
             .populate('tags');

            if (!item) {
                return res.status(404).json({
                    success: false,
                    message: 'Item not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Item updated successfully',
                data: item
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating item',
                error: error.message
            });
        }
    }

    async delete(req, res) {
        try {
            const item = await ItemModel.findByIdAndDelete(req.params.id);

            if (!item) {
                return res.status(404).json({
                    success: false,
                    message: 'Item not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Item deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error deleting item',
                error: error.message
            });
        }
    }

    async like(req, res) {
        try {
            const item = await ItemModel.findByIdAndUpdate(
                req.params.id,
                { $inc: { likes: 1 } },
                { new: true }
            );

            if (!item) {
                return res.status(404).json({
                    success: false,
                    message: 'Item not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Item liked successfully',
                data: { likes: item.likes }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error liking item',
                error: error.message
            });
        }
    }

    async dislike(req, res) {
        try {
            const item = await ItemModel.findByIdAndUpdate(
                req.params.id,
                { $inc: { dislikes: 1 } },
                { new: true }
            );

            if (!item) {
                return res.status(404).json({
                    success: false,
                    message: 'Item not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Item disliked successfully',
                data: { dislikes: item.dislikes }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error disliking item',
                error: error.message
            });
        }
    }
}

// Exporte uma instância para usar no router
export const itemController = new ItemController();
