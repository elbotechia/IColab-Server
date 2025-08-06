import express from 'express';
import { InstitutionController } from '../controllers/institutionController.js';
import { institutionValidators } from '../validators/institutionValidator.js';
import { handleValidationErrors } from '../middlewares/validationMiddleware.js';

export class InstitutionRouter {
    constructor() {
        this.router = express.Router();
        this.institutionController = new InstitutionController();
        this.initRoutes();
    }

    initRoutes() {
        // GET /institutions - Get all institutions with pagination and filtering
        this.router.get(
            '/',
            institutionValidators.getAll,
            handleValidationErrors,
            this.institutionController.getAll.bind(this.institutionController)
        );

        // GET /institutions/:id - Get institution by ID
        this.router.get(
            '/:id',
            institutionValidators.getById,
            handleValidationErrors,
            this.institutionController.getById.bind(this.institutionController)
        );

        // POST /institutions - Create new institution
        this.router.post(
            '/',
            institutionValidators.create,
            handleValidationErrors,
            this.institutionController.create.bind(this.institutionController)
        );

        // PUT /institutions/:id - Update institution
        this.router.put(
            '/:id',
            institutionValidators.update,
            handleValidationErrors,
            this.institutionController.update.bind(this.institutionController)
        );

        // DELETE /institutions/:id - Delete institution
        this.router.delete(
            '/:id',
            institutionValidators.delete,
            handleValidationErrors,
            this.institutionController.delete.bind(this.institutionController)
        );

        // GET /institutions/domain/:domain - Get institutions by domain
        this.router.get(
            '/domain/:domain',
            this.institutionController.getByDomain.bind(this.institutionController)
        );
    }

    getRouter() {
        return this.router;
    }
}
