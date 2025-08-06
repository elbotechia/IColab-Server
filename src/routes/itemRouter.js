
import express from "express";
import { ItemController } from "../controllers/itemController.js";
import { itemValidators } from '../validators/itemValidator.js';
import { handleValidationErrors } from '../middlewares/validationMiddleware.js';

export class ItemRouter {
    constructor() {
        this.router = express.Router();
        this.itemController = new ItemController();
        this.initRoutes();
    }

    initRoutes() {
        // GET /items - Get all items with pagination and filtering
        this.router.get(
            "/",
            itemValidators.getAll,
            handleValidationErrors,
            this.itemController.getAll.bind(this.itemController)
        );

        // GET /items/:id - Get item by ID
        this.router.get(
            "/:id",
            itemValidators.getById,
            handleValidationErrors,
            this.itemController.getById.bind(this.itemController)
        );

        // POST /items - Create new item
        this.router.post(
            "/",
            itemValidators.create,
            handleValidationErrors,
            this.itemController.create.bind(this.itemController)
        );

        // PUT /items/:id - Update item
        this.router.put(
            "/:id",
            itemValidators.update,
            handleValidationErrors,
            this.itemController.update.bind(this.itemController)
        );

        // DELETE /items/:id - Delete item
        this.router.delete(
            "/:id",
            itemValidators.delete,
            handleValidationErrors,
            this.itemController.delete.bind(this.itemController)
        );

        // POST /items/:id/like - Like an item
        this.router.post(
            "/:id/like",
            itemValidators.like,
            handleValidationErrors,
            this.itemController.like.bind(this.itemController)
        );

        // POST /items/:id/dislike - Dislike an item
        this.router.post(
            "/:id/dislike",
            itemValidators.dislike,
            handleValidationErrors,
            this.itemController.dislike.bind(this.itemController)
        );
    }

    getRouter() {
        return this.router;
    }
}