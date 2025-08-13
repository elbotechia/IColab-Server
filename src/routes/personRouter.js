import express from 'express';
import { PersonController } from '../controllers/personController.js';
import { personValidators } from '../validators/personValidator.js';
import { handleValidationErrors } from '../middlewares/validationMiddleware.js';

export class PersonRouter {
    constructor() {
        this.router = express.Router();
        this.personController = new PersonController();
        this.initRoutes();
    }

    initRoutes() {
        // GET /persons - Get all persons with pagination and filtering
        this.router.get(
            '/',
            personValidators.getAll,
            handleValidationErrors,
            this.personController.getAll.bind(this.personController)
        );

        // GET /persons/username/:username - Get person by username (must come before /:id)
        this.router.get(
            '/username/:username',
            personValidators.getByUsername,
            handleValidationErrors,
            this.personController.getByUsername.bind(this.personController)
        );

        // GET /persons/:id - Get person by ID
        this.router.get(
            '/:id',
            personValidators.getById,
            handleValidationErrors,
            this.personController.getById.bind(this.personController)
        );

        // POST /persons - Create new person (registration)
        this.router.post(
            '/',
            personValidators.create,
            handleValidationErrors,
            this.personController.create.bind(this.personController)
        );

        // PUT /persons/:id - Update person
        this.router.put(
            '/:id',
            personValidators.update,
            handleValidationErrors,
            this.personController.update.bind(this.personController)
        );

        // DELETE /persons/:id - Delete person
        this.router.delete(
            '/:id',
            personValidators.delete,
            handleValidationErrors,
            this.personController.delete.bind(this.personController)
        );

        // PUT /persons/:id/password - Change password
        this.router.put(
            '/:id/password',
            personValidators.changePassword,
            handleValidationErrors,
            this.personController.changePassword.bind(this.personController)
        );

        // POST /persons/sign-in - Sign in (authentication)
        this.router.post(
            '/sign-in',
            personValidators.signIn,
            handleValidationErrors,
            this.personController.signIn.bind(this.personController)
        );

    }

    getRouter() {
        return this.router;
    }
}
