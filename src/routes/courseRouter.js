import express from 'express';
import { CourseController } from '../controllers/courseController.js';
import { courseValidators } from '../validators/courseValidator.js';
import { handleValidationErrors } from '../middlewares/validationMiddleware.js';

export class CourseRouter {
    constructor() {
        this.router = express.Router();
        this.courseController = new CourseController();
        this.initRoutes();
    }

    initRoutes() {
        // GET /courses - Get all courses with pagination and filtering
        this.router.get(
            '/',
            courseValidators.getAll,
            handleValidationErrors,
            this.courseController.getAll.bind(this.courseController)
        );

        // GET /courses/:id - Get course by ID
        this.router.get(
            '/:id',
            courseValidators.getById,
            handleValidationErrors,
            this.courseController.getById.bind(this.courseController)
        );

        // POST /courses - Create new course
        this.router.post(
            '/',
            courseValidators.create,
            handleValidationErrors,
            this.courseController.create.bind(this.courseController)
        );

        // PUT /courses/:id - Update course
        this.router.put(
            '/:id',
            courseValidators.update,
            handleValidationErrors,
            this.courseController.update.bind(this.courseController)
        );

        // DELETE /courses/:id - Delete course
        this.router.delete(
            '/:id',
            courseValidators.delete,
            handleValidationErrors,
            this.courseController.delete.bind(this.courseController)
        );

        // GET /courses/abbr/:abbr - Get course by abbreviation
        this.router.get(
            '/abbr/:abbr',
            courseValidators.getByAbbr,
            handleValidationErrors,
            this.courseController.getByAbbr.bind(this.courseController)
        );

        // GET /courses/duration/:anos - Get courses by duration
        this.router.get(
            '/duration/:anos',
            this.courseController.getByDuration.bind(this.courseController)
        );

        // POST /courses/:id/variations - Add variation to course
        this.router.post(
            '/:id/variations',
            courseValidators.getById,
            handleValidationErrors,
            this.courseController.addVariation.bind(this.courseController)
        );

        // DELETE /courses/:id/variations - Remove variation from course
        this.router.delete(
            '/:id/variations',
            courseValidators.getById,
            handleValidationErrors,
            this.courseController.removeVariation.bind(this.courseController)
        );
    }

    getRouter() {
        return this.router;
    }
}
