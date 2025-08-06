import { Storage } from '../models/schemas/storageSchema.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

export class StorageController {
    async create(req, res) {
        try {
            const storage = new Storage(req.body);
            const savedStorage = await storage.save();
            
            res.status(201).json({
                success: true,
                message: 'Storage created successfully',
                data: savedStorage
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error creating storage',
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
            
            // Include deleted files if requested
            const includeDeleted = req.query.includeDeleted === 'true';
            
            if (req.query.search) {
                filter.$or = [
                    { filename: { $regex: req.query.search, $options: 'i' } },
                    { url: { $regex: req.query.search, $options: 'i' } }
                ];
            }

            if (req.query.fileType) {
                filter.filename = { $regex: `\\.${req.query.fileType}$`, $options: 'i' };
            }

            let query = Storage.find(filter);
            
            if (includeDeleted) {
                query = Storage.findWithDeleted(filter);
            }

            const storages = await query
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });

            const total = includeDeleted 
                ? await Storage.countDocumentsWithDeleted(filter)
                : await Storage.countDocuments(filter);

            res.status(200).json({
                success: true,
                data: storages,
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
                message: 'Error retrieving storages',
                error: error.message
            });
        }
    }

    async getById(req, res) {
        try {
            const includeDeleted = req.query.includeDeleted === 'true';
            
            let storage;
            if (includeDeleted) {
                storage = await Storage.findOneWithDeleted({ _id: req.params.id });
            } else {
                storage = await Storage.findById(req.params.id);
            }

            if (!storage) {
                return res.status(404).json({
                    success: false,
                    message: 'Storage not found'
                });
            }

            res.status(200).json({
                success: true,
                data: storage
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving storage',
                error: error.message
            });
        }
    }

    async update(req, res) {
        try {
            const storage = await Storage.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );

            if (!storage) {
                return res.status(404).json({
                    success: false,
                    message: 'Storage not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Storage updated successfully',
                data: storage
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating storage',
                error: error.message
            });
        }
    }

    async delete(req, res) {
        try {
            const storage = await Storage.findById(req.params.id);

            if (!storage) {
                return res.status(404).json({
                    success: false,
                    message: 'Storage not found'
                });
            }

            await storage.delete(); // Soft delete

            res.status(200).json({
                success: true,
                message: 'Storage deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error deleting storage',
                error: error.message
            });
        }
    }

    async restore(req, res) {
        try {
            const storage = await Storage.findOneWithDeleted({ _id: req.params.id });

            if (!storage) {
                return res.status(404).json({
                    success: false,
                    message: 'Storage not found'
                });
            }

            if (!storage.deleted) {
                return res.status(400).json({
                    success: false,
                    message: 'Storage is not deleted'
                });
            }

            await storage.restore();

            const restoredStorage = await Storage.findById(req.params.id);

            res.status(200).json({
                success: true,
                message: 'Storage restored successfully',
                data: restoredStorage
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error restoring storage',
                error: error.message
            });
        }
    }

    async upload(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'No file uploaded'
                });
            }

            const baseUrl = `${req.protocol}://${req.get('host')}`;
            const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;

            const storage = new Storage({
                url: fileUrl,
                filename: req.file.filename
            });

            const savedStorage = await storage.save();

            res.status(201).json({
                success: true,
                message: 'File uploaded successfully',
                data: savedStorage
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error uploading file',
                error: error.message
            });
        }
    }

    async download(req, res) {
        try {
            const storage = await Storage.findById(req.params.id);

            if (!storage) {
                return res.status(404).json({
                    success: false,
                    message: 'Storage not found'
                });
            }

            const filePath = path.join(process.cwd(), 'STORAGE', storage.filename);

            if (!fs.existsSync(filePath)) {
                return res.status(404).json({
                    success: false,
                    message: 'File not found on server'
                });
            }

            res.download(filePath, storage.filename);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error downloading file',
                error: error.message
            });
        }
    }
}
