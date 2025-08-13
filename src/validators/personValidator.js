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
            .withMessage('First name must be between 2 and 50 characters')
            .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/)
            .withMessage('First name can only contain letters, spaces, hyphens and apostrophes'),
        
        body('lastName')
            .notEmpty()
            .withMessage('Last name is required')
            .isString()
            .withMessage('Last name must be a string')
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage('Last name must be between 2 and 50 characters')
            .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/)
            .withMessage('Last name can only contain letters, spaces, hyphens and apostrophes'),
        
        body('email')
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Invalid email format')
            .normalizeEmail()
            .isLength({ max: 255 })
            .withMessage('Email must not exceed 255 characters'),
        
        // Accept both 'role' (string) from frontend and convert to 'roles' array
        body('role')
            .optional()
            .isIn(['user', 'admin', 'professor', 'mentor', 'orientador', 'monitor', 'aluno', 'pesquisador'])
            .withMessage('Invalid role'),
        
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
        
        body('newsletter')
            .optional()
            .isBoolean()
            .withMessage('Newsletter must be a boolean'),
        
        // Accept password (not passwordHash) for security
        body('password')
            .notEmpty()
            .withMessage('Password is required')
            .isLength({ min: 8, max: 128 })
            .withMessage('Password must be between 8 and 128 characters')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
            .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character'),
        
        body('confirmPassword')
            .notEmpty()
            .withMessage('Confirm password is required')
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Passwords do not match');
                }
                return true;
            }),
        body('password')
            .notEmpty()
            .withMessage('Password is required')
            .isLength({ min: 8, max: 128 })
            .withMessage('Password must be between 8 and 128 characters')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
            .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character'),
        
        body('confirmPassword')
            .notEmpty()
            .withMessage('Confirm password is required')
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Passwords do not match');
                }
                return true;
            }),
        
        body('bio')
            .optional()
            .isString()
            .withMessage('Bio must be a string')
            .trim()
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
        
        // Validate social media URLs more strictly
        body('github')
            .optional()
            .isString()
            .withMessage('GitHub must be a string')
,
        
        body('linkedin')
            .optional()
            .isString()
            .withMessage('LinkedIn must be a string')
 ,
        
        body('twitter')
            .optional()
            .isString()
            .withMessage('Twitter must be a string')
,
        body('instagram')
            .optional()
            .isString()
            .withMessage('Instagram must be a string')
   ,
        body('facebook')
            .optional()
            .isString()
            .withMessage('Facebook must be a string')
   ,
        // Accept social media as nested object too
        body('social.github')
            .optional()
            .isString()
            .withMessage('GitHub must be a string') ,
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

    changePassword: [
        param('id')
            .isMongoId()
            .withMessage('Invalid person ID'),

        body('currentPassword')
            .notEmpty()
            .withMessage('Current password is required'),

        body('newPassword')
            .isLength({ min: 8, max: 128 })
            .withMessage('New password must be between 8 and 128 characters')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
            .withMessage('New password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character'),

        body('confirmPassword')
            .custom((value, { req }) => {
                if (value !== req.body.newPassword) {
                    throw new Error('Password confirmation does not match');
                }
                return true;
            })
    ],

    getByUsername: [
        param('username')
            .trim()
            .isLength({ min: 3, max: 30 })
            .withMessage('Username must be between 3 and 30 characters')
            .matches(/^[a-zA-Z0-9_-]+$/)
            .withMessage('Username can only contain letters, numbers, hyphens and underscores')
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
            .isLength({ min: 1, max: 100 })
            .withMessage('Search term must be between 1 and 100 characters'),

        query('username')
            .optional()
            .trim()
            .isLength({ min: 3, max: 30 })
            .withMessage('Username must be between 3 and 30 characters'),

        query('email')
            .optional()
            .trim()
            .isEmail()
            .withMessage('Please enter a valid email'),

        query('isActive')
            .optional()
            .isBoolean()
            .withMessage('isActive must be a boolean')
    ],

    signIn: [
        body('username')
            .trim()
            .isLength({ min: 3, max: 30 })
            .withMessage('Username must be between 3 and 30 characters')
            .matches(/^[a-zA-Z0-9_-]+$/)
            .withMessage('Username can only contain letters, numbers, hyphens and underscores'),

        body('password')
            .isLength({ min: 8, max: 128 })
            .withMessage('Password must be between 8 and 128 characters')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
            .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one number and one special character')
    ]

};