import express from 'express';
import { TagController } from '../controllers/tagController.js';
import { tagValidators } from '../validators/tagValidator.js';
import { handleValidationErrors } from '../middlewares/validationMiddleware.js';

export class TagRouter {
    constructor() {
        this.router = express.Router();
        this.tagController = new TagController();
        this.initRoutes();
    }

    initRoutes() {
        // GET /tags - Get all tags with pagination and filtering
        this.router.get(
            '/',
            tagValidators.getAll,
            handleValidationErrors,
            this.tagController.getAll.bind(this.tagController)
        );

        // GET /tags/:id - Get tag by ID
        this.router.get(
            '/:id',
            tagValidators.getById,
            handleValidationErrors,
            this.tagController.getById.bind(this.tagController)
        );

        // POST /tags - Create new tag
        this.router.post(
            '/',
            tagValidators.create,
            handleValidationErrors,
            this.tagController.create.bind(this.tagController)
        );

        // PUT /tags/:id - Update tag
        this.router.put(
            '/:id',
            tagValidators.update,
            handleValidationErrors,
            this.tagController.update.bind(this.tagController)
        );

        // DELETE /tags/:id - Delete tag
        this.router.delete(
            '/:id',
            tagValidators.delete,
            handleValidationErrors,
            this.tagController.delete.bind(this.tagController)
        );

        // GET /tags/name/:tagName - Get tag by name
        this.router.get(
            '/name/:tagName',
            this.tagController.getByName.bind(this.tagController)
        );

        // GET /tags/popular - Get popular tags
        this.router.get(
            '/popular',
            this.tagController.getPopular.bind(this.tagController)
        );

        // GET /tags/color/:color - Get tags by color
        this.router.get(
            '/color/:color',
            this.tagController.searchByColor.bind(this.tagController)
        );
    }

    getRouter() {
        return this.router;
    }
}
