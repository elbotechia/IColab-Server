import express from "express";
import * as storageController from "../controllers/storageController.js";
import { uploadMiddleware } from "../config/multer.js";
import { validatorDeleteItem, validatorGetItem } from "../validators/storageValidator.js";

export class StorageRouter {
    constructor() {
        this.router = express.Router();
        this.setRoutes();
    }

    setRoutes() {
        // single para 1 upload, multi para varios uploads
        this.router.post(
            '/',
            uploadMiddleware.single('inputFile'),
            (req, res, next) => {
                if (!storageController.createItem) {
                    return res.status(500).json({ error: 'createItem controller not found' });
                }
                return storageController.createItem(req, res, next);
            }
        );

        this.router.get('/', storageController.getItems);          
        this.router.get('/:id', validatorGetItem, storageController.getItem);
        this.router.delete('/:id', validatorDeleteItem, storageController.deleteItem);
    }

    getRouter() {
        return this.router;
    }
}