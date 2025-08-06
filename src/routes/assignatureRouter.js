import express from 'express';
import { AssignatureController } from '../controllers/assignatureController.js';
import { assignatureValidators } from '../validators/assignatureValidator.js';
import { handleValidationErrors } from '../middlewares/validationMiddleware.js';

export class AssignatureRouter {
    constructor() {
        this.router = express.Router();
        this.assignatureController = new AssignatureController();
        this.initRoutes();
    }

    initRoutes() {
        // GET /assignatures - Get all assignatures with pagination and filtering
        this.router.get(
            '/',
            assignatureValidators.getAll,
            handleValidationErrors,
            this.assignatureController.getAll.bind(this.assignatureController)
        );

        // GET /assignatures/:id - Get assignature by ID
        this.router.get(
            '/:id',
            assignatureValidators.getById,
            handleValidationErrors,
            this.assignatureController.getById.bind(this.assignatureController)
        );

        // POST /assignatures - Create new assignature
        this.router.post(
            '/',
            assignatureValidators.create,
            handleValidationErrors,
            this.assignatureController.create.bind(this.assignatureController)
        );

        // PUT /assignatures/:id - Update assignature
        this.router.put(
            '/:id',
            assignatureValidators.update,
            handleValidationErrors,
            this.assignatureController.update.bind(this.assignatureController)
        );

        // DELETE /assignatures/:id - Delete assignature
        this.router.delete(
            '/:id',
            assignatureValidators.delete,
            handleValidationErrors,
            this.assignatureController.delete.bind(this.assignatureController)
        );

        // POST /assignatures/:id/like - Like an assignature
        this.router.post(
            '/:id/like',
            assignatureValidators.getById,
            handleValidationErrors,
            this.assignatureController.like.bind(this.assignatureController)
        );

        // POST /assignatures/:id/dislike - Dislike an assignature
        this.router.post(
            '/:id/dislike',
            assignatureValidators.getById,
            handleValidationErrors,
            this.assignatureController.dislike.bind(this.assignatureController)
        );
    }

    getRouter() {
        return this.router;
    }
}
