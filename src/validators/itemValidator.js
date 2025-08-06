import { body, param, query } from 'express-validator';

export const itemValidators = {
    create: [
        body('tagName')
            .notEmpty()
            .withMessage('Tag name is required')
            .isString()
            .withMessage('Tag name must be a string')
            .trim(),
        
        body('type')
            .isIn(['project', 'notebook', 'flashcard', 'presentation', 'book', 'article', 'research', 'podcast', 'video', 'other'])
            .withMessage('Invalid type'),
        
        body('description')
            .notEmpty()
            .withMessage('Description is required')
            .isString()
            .withMessage('Description must be a string')
            .trim(),
        
        body('mediasId')
            .optional()
            .isArray()
            .withMessage('MediasId must be an array'),
        
        body('mediasId.*')
            .optional()
            .isMongoId()
            .withMessage('Invalid media ID'),
        
        body('repo')
            .notEmpty()
            .withMessage('Repository URL is required')
            .isString()
            .withMessage('Repository URL must be a string')
            .trim()
            .isURL()
            .withMessage('Invalid repository URL format'),
        
        body('deploy')
            .optional()
            .isString()
            .withMessage('Deploy URL must be a string')
            .trim()
            .isURL()
            .withMessage('Invalid deploy URL format'),
        
        body('tags')
            .optional()
            .isArray()
            .withMessage('Tags must be an array'),
        
        body('tags.*')
            .optional()
            .isMongoId()
            .withMessage('Invalid tag ID')
    ],

    update: [
        param('id')
            .isMongoId()
            .withMessage('Invalid item ID'),
        
        body('tagName')
            .optional()
            .isString()
            .withMessage('Tag name must be a string')
            .trim(),
        
        body('type')
            .optional()
            .isIn(['project', 'notebook', 'flashcard', 'presentation', 'book', 'article', 'research', 'podcast', 'video', 'other'])
            .withMessage('Invalid type'),
        
        body('description')
            .optional()
            .isString()
            .withMessage('Description must be a string')
            .trim(),
        
        body('mediasId')
            .optional()
            .isArray()
            .withMessage('MediasId must be an array'),
        
        body('mediasId.*')
            .optional()
            .isMongoId()
            .withMessage('Invalid media ID'),
        
        body('repo')
            .optional()
            .isString()
            .withMessage('Repository URL must be a string')
            .trim()
            .isURL()
            .withMessage('Invalid repository URL format'),
        
        body('deploy')
            .optional()
            .isString()
            .withMessage('Deploy URL must be a string')
            .trim()
            .isURL()
            .withMessage('Invalid deploy URL format'),
        
        body('likes')
            .optional()
            .isInt({ min: 0 })
            .withMessage('Likes must be a non-negative integer'),
        
        body('dislikes')
            .optional()
            .isInt({ min: 0 })
            .withMessage('Dislikes must be a non-negative integer'),
        
        body('tags')
            .optional()
            .isArray()
            .withMessage('Tags must be an array'),
        
        body('tags.*')
            .optional()
            .isMongoId()
            .withMessage('Invalid tag ID')
    ],

    getById: [
        param('id')
            .isMongoId()
            .withMessage('Invalid item ID')
    ],

    delete: [
        param('id')
            .isMongoId()
            .withMessage('Invalid item ID')
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
        
        query('type')
            .optional()
            .isIn(['project', 'notebook', 'flashcard', 'presentation', 'book', 'article', 'research', 'podcast', 'video', 'other'])
            .withMessage('Invalid type filter'),
        
        query('search')
            .optional()
            .isString()
            .trim()
            .withMessage('Search must be a string')
    ],

    like: [
        param('id')
            .isMongoId()
            .withMessage('Invalid item ID')
    ],

    dislike: [
        param('id')
            .isMongoId()
            .withMessage('Invalid item ID')
    ]
};
