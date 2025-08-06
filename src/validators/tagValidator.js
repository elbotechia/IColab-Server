import { body, param, query } from 'express-validator';

export const tagValidators = {
    create: [
        body('tagName')
            .notEmpty()
            .withMessage('Tag name is required')
            .isString()
            .withMessage('Tag name must be a string')
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage('Tag name must be between 2 and 50 characters')
            .matches(/^[a-zA-Z0-9\s-_]+$/)
            .withMessage('Tag name can only contain letters, numbers, spaces, hyphens and underscores'),
        
        body('description')
            .notEmpty()
            .withMessage('Description is required')
            .isString()
            .withMessage('Description must be a string')
            .trim()
            .isLength({ min: 10, max: 500 })
            .withMessage('Description must be between 10 and 500 characters'),
        
        body('color')
            .notEmpty()
            .withMessage('Color is required')
            .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
            .withMessage('Invalid hex color format'),
        
        body('mediaId')
            .optional()
            .isMongoId()
            .withMessage('Invalid media ID')
    ],

    update: [
        param('id')
            .isMongoId()
            .withMessage('Invalid tag ID'),
        
        body('tagName')
            .optional()
            .isString()
            .withMessage('Tag name must be a string')
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage('Tag name must be between 2 and 50 characters')
            .matches(/^[a-zA-Z0-9\s-_]+$/)
            .withMessage('Tag name can only contain letters, numbers, spaces, hyphens and underscores'),
        
        body('description')
            .optional()
            .isString()
            .withMessage('Description must be a string')
            .trim()
            .isLength({ min: 10, max: 500 })
            .withMessage('Description must be between 10 and 500 characters'),
        
        body('color')
            .optional()
            .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
            .withMessage('Invalid hex color format'),
        
        body('mediaId')
            .optional()
            .isMongoId()
            .withMessage('Invalid media ID')
    ],

    getById: [
        param('id')
            .isMongoId()
            .withMessage('Invalid tag ID')
    ],

    delete: [
        param('id')
            .isMongoId()
            .withMessage('Invalid tag ID')
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
        
        query('search')
            .optional()
            .isString()
            .trim()
            .withMessage('Search must be a string'),
        
        query('color')
            .optional()
            .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
            .withMessage('Invalid hex color format')
    ]
};
