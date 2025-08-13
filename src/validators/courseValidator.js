import { body, param, query } from 'express-validator';

export const courseValidators = {
    create: [
        body('curso')
            .notEmpty()
            .withMessage('Nome do curso é obrigatório')
            .isString()
            .withMessage('Nome do curso deve ser uma string')
            .isLength({ min: 2, max: 100 })
            .withMessage('Nome do curso deve ter entre 2 e 100 caracteres')
            .trim(),
        
        body('anos')
            .notEmpty()
            .withMessage('Duração em anos é obrigatória')
            .isInt({ min: 1, max: 10 })
            .withMessage('Anos deve ser um número inteiro entre 1 e 10'),
        
        body('abbr')
            .notEmpty()
            .withMessage('Abreviação é obrigatória')
            .isString()
            .withMessage('Abreviação deve ser uma string')
            .isLength({ min: 2, max: 10 })
            .withMessage('Abreviação deve ter entre 2 e 10 caracteres')
            .trim()
            .toUpperCase(),
        
        body('variacoes')
            .optional()
            .isArray()
            .withMessage('Variações deve ser um array'),
        
        body('variacoes.*')
            .optional()
            .isString()
            .withMessage('Cada variação deve ser uma string')
            .trim()
    ],

    update: [
        param('id')
            .isMongoId()
            .withMessage('ID do curso inválido'),
        
        body('curso')
            .optional()
            .isString()
            .withMessage('Nome do curso deve ser uma string')
            .isLength({ min: 2, max: 100 })
            .withMessage('Nome do curso deve ter entre 2 e 100 caracteres')
            .trim(),
        
        body('anos')
            .optional()
            .isInt({ min: 1, max: 10 })
            .withMessage('Anos deve ser um número inteiro entre 1 e 10'),
        
        body('abbr')
            .optional()
            .isString()
            .withMessage('Abreviação deve ser uma string')
            .isLength({ min: 2, max: 10 })
            .withMessage('Abreviação deve ter entre 2 e 10 caracteres')
            .trim()
            .toUpperCase(),
        
        body('variacoes')
            .optional()
            .isArray()
            .withMessage('Variações deve ser um array'),
        
        body('variacoes.*')
            .optional()
            .isString()
            .withMessage('Cada variação deve ser uma string')
            .trim()
    ],

    getById: [
        param('id')
            .isMongoId()
            .withMessage('ID do curso inválido')
    ],

    delete: [
        param('id')
            .isMongoId()
            .withMessage('ID do curso inválido')
    ],

    getAll: [
        query('page')
            .optional()
            .isInt({ min: 1 })
            .withMessage('Página deve ser um número inteiro positivo'),
        
        query('limit')
            .optional()
            .isInt({ min: 1, max: 100 })
            .withMessage('Limite deve ser um número entre 1 e 100'),
        
        query('search')
            .optional()
            .isString()
            .withMessage('Busca deve ser uma string')
            .trim(),
        
        query('anos')
            .optional()
            .isInt({ min: 1, max: 10 })
            .withMessage('Filtro de anos deve ser um número entre 1 e 10'),
        
        query('abbr')
            .optional()
            .isString()
            .withMessage('Filtro de abreviação deve ser uma string')
            .trim()
            .toUpperCase()
    ],

    getByAbbr: [
        param('abbr')
            .notEmpty()
            .withMessage('Abreviação é obrigatória')
            .isString()
            .withMessage('Abreviação deve ser uma string')
            .trim()
            .toUpperCase()
    ]
};
