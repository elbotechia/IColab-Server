import { body, param, query } from 'express-validator';

export const personValidators = {
    create: [
        body('username')
            .notEmpty()
            .withMessage('Username is required')
            .isString()
            .withMessage('Username must be a string')
            .trim()
            .isLength({ min: 3, max: 30 })
            .withMessage('Username must be between 3 and 30 characters')
            .matches(/^[a-zA-Z0-9_-]+$/)
            .withMessage('Username can only contain letters, numbers, hyphens and underscores'),
        
        body('firstName')
            .notEmpty()
            .withMessage('First name is required')
            .isString()
            .withMessage('First name must be a string')
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage('First name must be between 2 and 50 characters'),
        
        body('lastName')
            .notEmpty()
            .withMessage('Last name is required')
            .isString()
            .withMessage('Last name must be a string')
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage('Last name must be between 2 and 50 characters'),
        
        body('email')
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Invalid email format')
            .normalizeEmail(),
        
        body('roles')
            .optional()
            .isArray()
            .withMessage('Roles must be an array'),
        
        body('roles.*')
            .optional()
            .isIn(['user', 'admin', 'professor', 'mentor', 'orientador', 'monitor', 'aluno', 'pesquisador'])
            .withMessage('Invalid role'),
        
        body('hex')
            .notEmpty()
            .withMessage('Hex color is required')
            .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
            .withMessage('Invalid hex color format'),
        
        body('passwordHash')
            .notEmpty()
            .withMessage('Password hash is required')
            .isString()
            .withMessage('Password hash must be a string'),
        
        body('bio')
            .optional()
            .isString()
            .withMessage('Bio must be a string')
            .isLength({ max: 500 })
            .withMessage('Bio must not exceed 500 characters'),
        
        body('avatarId')
            .optional()
            .isMongoId()
            .withMessage('Invalid avatar ID'),
        
        body('coverId')
            .optional()
            .isMongoId()
            .withMessage('Invalid cover ID'),
        
        body('social.github')
            .optional()
            .isString()
            .withMessage('GitHub must be a string'),
        
        body('social.linkedin')
            .optional()
            .isString()
            .withMessage('LinkedIn must be a string'),
        
        body('social.twitter')
            .optional()
            .isString()
            .withMessage('Twitter must be a string'),
        
        body('social.instagram')
            .optional()
            .isString()
            .withMessage('Instagram must be a string'),
        
        body('social.facebook')
            .optional()
            .isString()
            .withMessage('Facebook must be a string')
    ],

    update: [
        param('id')
            .isMongoId()
            .withMessage('Invalid person ID'),
        
        body('username')
            .optional()
            .isString()
            .withMessage('Username must be a string')
            .trim()
            .isLength({ min: 3, max: 30 })
            .withMessage('Username must be between 3 and 30 characters')
            .matches(/^[a-zA-Z0-9_-]+$/)
            .withMessage('Username can only contain letters, numbers, hyphens and underscores'),
        
        body('firstName')
            .optional()
            .isString()
            .withMessage('First name must be a string')
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage('First name must be between 2 and 50 characters'),
        
        body('lastName')
            .optional()
            .isString()
            .withMessage('Last name must be a string')
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage('Last name must be between 2 and 50 characters'),
        
        body('email')
            .optional()
            .isEmail()
            .withMessage('Invalid email format')
            .normalizeEmail(),
        
        body('roles')
            .optional()
            .isArray()
            .withMessage('Roles must be an array'),
        
        body('roles.*')
            .optional()
            .isIn(['user', 'admin', 'professor', 'mentor', 'orientador', 'monitor', 'aluno', 'pesquisador'])
            .withMessage('Invalid role'),
        
        body('hex')
            .optional()
            .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
            .withMessage('Invalid hex color format'),
        
        body('passwordHash')
            .optional()
            .isString()
            .withMessage('Password hash must be a string'),
        
        body('bio')
            .optional()
            .isString()
            .withMessage('Bio must be a string')
            .isLength({ max: 500 })
            .withMessage('Bio must not exceed 500 characters'),
        
        body('avatarId')
            .optional()
            .isMongoId()
            .withMessage('Invalid avatar ID'),
        
        body('coverId')
            .optional()
            .isMongoId()
            .withMessage('Invalid cover ID'),
        
        body('social.github')
            .optional()
            .isString()
            .withMessage('GitHub must be a string'),
        
        body('social.linkedin')
            .optional()
            .isString()
            .withMessage('LinkedIn must be a string'),
        
        body('social.twitter')
            .optional()
            .isString()
            .withMessage('Twitter must be a string'),
        
        body('social.instagram')
            .optional()
            .isString()
            .withMessage('Instagram must be a string'),
        
        body('social.facebook')
            .optional()
            .isString()
            .withMessage('Facebook must be a string')
    ],

    getById: [
        param('id')
            .isMongoId()
            .withMessage('Invalid person ID')
    ],

    delete: [
        param('id')
            .isMongoId()
            .withMessage('Invalid person ID')
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
        
        query('role')
            .optional()
            .isIn(['user', 'admin', 'professor', 'mentor', 'orientador', 'monitor', 'aluno', 'pesquisador'])
            .withMessage('Invalid role filter'),
        
        query('search')
            .optional()
            .isString()
            .trim()
            .withMessage('Search must be a string')
    ]
};
