import { body, param, query } from 'express-validator';

export const postValidators = {
    create: [
        body('title')
            .notEmpty()
            .withMessage('Title is required')
            .isString()
            .withMessage('Title must be a string')
            .trim()
            .isLength({ min: 5, max: 200 })
            .withMessage('Title must be between 5 and 200 characters'),
        
        body('content')
            .notEmpty()
            .withMessage('Content is required')
            .isString()
            .withMessage('Content must be a string')
            .trim()
            .isLength({ min: 10 })
            .withMessage('Content must be at least 10 characters long'),
        
        body('authorId')
            .notEmpty()
            .withMessage('Author ID is required')
            .isMongoId()
            .withMessage('Invalid author ID'),
        
        body('tags')
            .optional()
            .isArray()
            .withMessage('Tags must be an array'),
        
        body('tags.*')
            .optional()
            .isString()
            .withMessage('Each tag must be a string')
            .trim(),
        
        body('mediaIds')
            .optional()
            .isArray()
            .withMessage('MediaIds must be an array'),
        
        body('mediaIds.*')
            .optional()
            .isMongoId()
            .withMessage('Invalid media ID')
    ],

    update: [
        param('id')
            .isMongoId()
            .withMessage('Invalid post ID'),
        
        body('title')
            .optional()
            .isString()
            .withMessage('Title must be a string')
            .trim()
            .isLength({ min: 5, max: 200 })
            .withMessage('Title must be between 5 and 200 characters'),
        
        body('content')
            .optional()
            .isString()
            .withMessage('Content must be a string')
            .trim()
            .isLength({ min: 10 })
            .withMessage('Content must be at least 10 characters long'),
        
        body('tags')
            .optional()
            .isArray()
            .withMessage('Tags must be an array'),
        
        body('tags.*')
            .optional()
            .isString()
            .withMessage('Each tag must be a string')
            .trim(),
        
        body('mediaIds')
            .optional()
            .isArray()
            .withMessage('MediaIds must be an array'),
        
        body('mediaIds.*')
            .optional()
            .isMongoId()
            .withMessage('Invalid media ID'),
        
        body('likes')
            .optional()
            .isInt({ min: 0 })
            .withMessage('Likes must be a non-negative integer'),
        
        body('dislikes')
            .optional()
            .isInt({ min: 0 })
            .withMessage('Dislikes must be a non-negative integer')
    ],

    getById: [
        param('id')
            .isMongoId()
            .withMessage('Invalid post ID')
    ],

    delete: [
        param('id')
            .isMongoId()
            .withMessage('Invalid post ID')
    ],

    restore: [
        param('id')
            .isMongoId()
            .withMessage('Invalid post ID')
    ],

    getAll: [
        query('page')
            .optional()
            .isInt({ min: 1 })
            .withMessage('Page must be a positive integer'),
        
        query('limit')
            .optional()
            .isInt({ min: 1, max: 100 })
            .withMessage('Limit must be between 1 and 100'),
        
        query('authorId')
            .optional()
            .isMongoId()
            .withMessage('Invalid author ID'),
        
        query('tag')
            .optional()
            .isString()
            .trim()
            .withMessage('Tag must be a string'),
        
        query('search')
            .optional()
            .isString()
            .trim()
            .withMessage('Search must be a string'),
        
        query('includeDeleted')
            .optional()
            .isBoolean()
            .withMessage('includeDeleted must be a boolean')
    ],

    like: [
        param('id')
            .isMongoId()
            .withMessage('Invalid post ID')
    ],

    dislike: [
        param('id')
            .isMongoId()
            .withMessage('Invalid post ID')
    ],

    addComment: [
        param('id')
            .isMongoId()
            .withMessage('Invalid post ID'),
        
        body('commentId')
            .notEmpty()
            .withMessage('Comment ID is required')
            .isMongoId()
            .withMessage('Invalid comment ID')
    ]
};
