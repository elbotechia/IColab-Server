import express from 'express';
import { StorageController } from '../controllers/storageController.js';
import { storageValidators } from '../validators/storageValidator.js';
import { handleValidationErrors } from '../middlewares/validationMiddleware.js';
import multer from 'multer';
import path from 'path';

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'STORAGE/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: function (req, file, cb) {
        // Allow all file types for now, but you can restrict here
        cb(null, true);
    }
});

export class StorageRouter {
    constructor() {
        this.router = express.Router();
        this.storageController = new StorageController();
        this.initRoutes();
    }

    initRoutes() {
        // GET /storage - Get all storage files with pagination and filtering
        this.router.get(
            '/',
            storageValidators.getAll,
            handleValidationErrors,
            this.storageController.getAll.bind(this.storageController)
        );

        // GET /storage/:id - Get storage file by ID
        this.router.get(
            '/:id',
            storageValidators.getById,
            handleValidationErrors,
            this.storageController.getById.bind(this.storageController)
        );

        // POST /storage - Create new storage record
        this.router.post(
            '/',
            storageValidators.create,
            handleValidationErrors,
            this.storageController.create.bind(this.storageController)
        );

        // PUT /storage/:id - Update storage file
        this.router.put(
            '/:id',
            storageValidators.update,
            handleValidationErrors,
            this.storageController.update.bind(this.storageController)
        );

        // DELETE /storage/:id - Delete storage file (soft delete)
        this.router.delete(
            '/:id',
            storageValidators.delete,
            handleValidationErrors,
            this.storageController.delete.bind(this.storageController)
        );

        // POST /storage/:id/restore - Restore deleted storage file
        this.router.post(
            '/:id/restore',
            storageValidators.restore,
            handleValidationErrors,
            this.storageController.restore.bind(this.storageController)
        );

        // POST /storage/upload - Upload file
        this.router.post(
            '/upload',
            upload.single('file'),
            storageValidators.upload,
            handleValidationErrors,
            this.storageController.upload.bind(this.storageController)
        );

        // GET /storage/:id/download - Download file
        this.router.get(
            '/:id/download',
            storageValidators.getById,
            handleValidationErrors,
            this.storageController.download.bind(this.storageController)
        );
    }

    getRouter() {
        return this.router;
    }
}
