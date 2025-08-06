import { body, param, query } from 'express-validator';

export const storageValidators = {
    create: [
        body('url')
            .notEmpty()
            .withMessage('URL is required')
            .isString()
            .withMessage('URL must be a string')
            .trim()
            .isURL()
            .withMessage('Invalid URL format'),
        
        body('filename')
            .notEmpty()
            .withMessage('Filename is required')
            .isString()
            .withMessage('Filename must be a string')
            .trim()
            .matches(/^[a-zA-Z0-9._-]+$/)
            .withMessage('Filename contains invalid characters')
    ],

    update: [
        param('id')
            .isMongoId()
            .withMessage('Invalid storage ID'),
        
        body('url')
            .optional()
            .isString()
            .withMessage('URL must be a string')
            .trim()
            .isURL()
            .withMessage('Invalid URL format'),
        
        body('filename')
            .optional()
            .isString()
            .withMessage('Filename must be a string')
            .trim()
            .matches(/^[a-zA-Z0-9._-]+$/)
            .withMessage('Filename contains invalid characters')
    ],

    getById: [
        param('id')
            .isMongoId()
            .withMessage('Invalid storage ID')
    ],

    delete: [
        param('id')
            .isMongoId()
            .withMessage('Invalid storage ID')
    ],

    restore: [
        param('id')
            .isMongoId()
            .withMessage('Invalid storage ID')
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
        
        query('includeDeleted')
            .optional()
            .isBoolean()
            .withMessage('includeDeleted must be a boolean'),
        
        query('fileType')
            .optional()
            .isString()
            .trim()
            .withMessage('File type must be a string')
    ],

    upload: [
        // File validation will be handled by multer middleware
        body('description')
            .optional()
            .isString()
            .withMessage('Description must be a string')
            .trim()
    ]
};
