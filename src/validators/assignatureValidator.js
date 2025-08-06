import { body, param, query } from 'express-validator';

export const assignatureValidators = {
    create: [
        body('tagName')
            .notEmpty()
            .withMessage('Tag name is required')
            .isString()
            .withMessage('Tag name must be a string')
            .trim(),
        
        body('type')
            .isIn(['superior', 'ensino médio', 'EAD', 'ensino fundamental', 'infantil', 'pós-graduação', 'MBA', 'master', 'curso', 'técnico', 'certificação', 'other'])
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
        
        body('modulesId')
            .optional()
            .isArray()
            .withMessage('ModulesId must be an array'),
        
        body('modulesId.*')
            .optional()
            .isMongoId()
            .withMessage('Invalid module ID'),
        
        body('tasksId')
            .optional()
            .isArray()
            .withMessage('TasksId must be an array'),
        
        body('tasksId.*')
            .optional()
            .isMongoId()
            .withMessage('Invalid task ID'),
        
        body('classroomsId')
            .optional()
            .isArray()
            .withMessage('ClassroomsId must be an array'),
        
        body('classroomsId.*')
            .optional()
            .isMongoId()
            .withMessage('Invalid classroom ID'),
        
        body('institutionsId')
            .optional()
            .isArray()
            .withMessage('InstitutionsId must be an array'),
        
        body('institutionsId.*')
            .optional()
            .isMongoId()
            .withMessage('Invalid institution ID'),
        
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
            .withMessage('Invalid assignature ID'),
        
        body('tagName')
            .optional()
            .isString()
            .withMessage('Tag name must be a string')
            .trim(),
        
        body('type')
            .optional()
            .isIn(['superior', 'ensino médio', 'EAD', 'ensino fundamental', 'infantil', 'pós-graduação', 'MBA', 'master', 'curso', 'técnico', 'certificação', 'other'])
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
        
        body('modulesId')
            .optional()
            .isArray()
            .withMessage('ModulesId must be an array'),
        
        body('modulesId.*')
            .optional()
            .isMongoId()
            .withMessage('Invalid module ID'),
        
        body('tasksId')
            .optional()
            .isArray()
            .withMessage('TasksId must be an array'),
        
        body('tasksId.*')
            .optional()
            .isMongoId()
            .withMessage('Invalid task ID'),
        
        body('classroomsId')
            .optional()
            .isArray()
            .withMessage('ClassroomsId must be an array'),
        
        body('classroomsId.*')
            .optional()
            .isMongoId()
            .withMessage('Invalid classroom ID'),
        
        body('institutionsId')
            .optional()
            .isArray()
            .withMessage('InstitutionsId must be an array'),
        
        body('institutionsId.*')
            .optional()
            .isMongoId()
            .withMessage('Invalid institution ID'),
        
        body('tags')
            .optional()
            .isArray()
            .withMessage('Tags must be an array'),
        
        body('tags.*')
            .optional()
            .isMongoId()
            .withMessage('Invalid tag ID'),
        
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
            .withMessage('Invalid assignature ID')
    ],

    delete: [
        param('id')
            .isMongoId()
            .withMessage('Invalid assignature ID')
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
            .isIn(['superior', 'ensino médio', 'EAD', 'ensino fundamental', 'infantil', 'pós-graduação', 'MBA', 'master', 'curso', 'técnico', 'certificação', 'other'])
            .withMessage('Invalid type filter'),
        
        query('search')
            .optional()
            .isString()
            .trim()
            .withMessage('Search must be a string')
    ]
};
