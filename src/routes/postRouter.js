import express from 'express';
import { PostController } from '../controllers/postController.js';
import { postValidators } from '../validators/postValidator.js';
import { handleValidationErrors } from '../middlewares/validationMiddleware.js';

export class PostRouter {
    constructor() {
        this.router = express.Router();
        this.postController = new PostController();
        this.initRoutes();
    }

    initRoutes() {
        // GET /posts - Get all posts with pagination and filtering
        this.router.get(
            '/',
            postValidators.getAll,
            handleValidationErrors,
            this.postController.getAll.bind(this.postController)
        );

        // GET /posts/:id - Get post by ID
        this.router.get(
            '/:id',
            postValidators.getById,
            handleValidationErrors,
            this.postController.getById.bind(this.postController)
        );

        // POST /posts - Create new post
        this.router.post(
            '/',
            postValidators.create,
            handleValidationErrors,
            this.postController.create.bind(this.postController)
        );

        // PUT /posts/:id - Update post
        this.router.put(
            '/:id',
            postValidators.update,
            handleValidationErrors,
            this.postController.update.bind(this.postController)
        );

        // DELETE /posts/:id - Delete post (soft delete)
        this.router.delete(
            '/:id',
            postValidators.delete,
            handleValidationErrors,
            this.postController.delete.bind(this.postController)
        );

        // POST /posts/:id/restore - Restore deleted post
        this.router.post(
            '/:id/restore',
            postValidators.restore,
            handleValidationErrors,
            this.postController.restore.bind(this.postController)
        );

        // POST /posts/:id/like - Like a post
        this.router.post(
            '/:id/like',
            postValidators.like,
            handleValidationErrors,
            this.postController.like.bind(this.postController)
        );

        // POST /posts/:id/dislike - Dislike a post
        this.router.post(
            '/:id/dislike',
            postValidators.dislike,
            handleValidationErrors,
            this.postController.dislike.bind(this.postController)
        );

        // POST /posts/:id/comments - Add comment to post
        this.router.post(
            '/:id/comments',
            postValidators.addComment,
            handleValidationErrors,
            this.postController.addComment.bind(this.postController)
        );
    }

    getRouter() {
        return this.router;
    }
}
