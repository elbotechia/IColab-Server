import { body, param, query } from 'express-validator';

export const institutionValidators = {
    create: [
        body('razaoSocial')
            .notEmpty()
            .withMessage('Razão Social is required')
            .isString()
            .withMessage('Razão Social must be a string')
            .trim(),
        
        body('nomeFantasia')
            .notEmpty()
            .withMessage('Nome Fantasia is required')
            .isString()
            .withMessage('Nome Fantasia must be a string')
            .trim(),
        
        body('abbr')
            .notEmpty()
            .withMessage('Abbreviation is required')
            .isString()
            .withMessage('Abbreviation must be a string')
            .trim(),
        
        body('email')
            .optional()
            .isEmail()
            .withMessage('Invalid email format')
            .normalizeEmail(),
        
        body('dominio')
            .optional()
            .isArray()
            .withMessage('Dominio must be an array'),
        
        body('dominio.*')
            .optional()
            .isIn(['educacao', 'ONG', 'empresa', 'comercio', 'GOV', 'politico', 'industria'])
            .withMessage('Invalid domain value'),
        
        body('enderecos')
            .optional()
            .isArray()
            .withMessage('Enderecos must be an array'),
        
        body('enderecos.*')
            .optional()
            .isString()
            .withMessage('Each address must be a string'),
        
        body('telefone')
            .optional()
            .isArray()
            .withMessage('Telefone must be an array'),
        
        body('telefone.*')
            .optional()
            .isString()
            .withMessage('Each phone number must be a string'),
        
        body('CNPJ')
            .notEmpty()
            .withMessage('CNPJ is required')
            .isString()
            .withMessage('CNPJ must be a string')
            .matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$|^\d{14}$/)
            .withMessage('Invalid CNPJ format'),
        
        body('mediasId')
            .optional()
            .isArray()
            .withMessage('MediasId must be an array'),
        
        body('mediasId.*')
            .optional()
            .isMongoId()
            .withMessage('Invalid media ID')
    ],

    update: [
        param('id')
            .isMongoId()
            .withMessage('Invalid institution ID'),
        
        body('razaoSocial')
            .optional()
            .isString()
            .withMessage('Razão Social must be a string')
            .trim(),
        
        body('nomeFantasia')
            .optional()
            .isString()
            .withMessage('Nome Fantasia must be a string')
            .trim(),
        
        body('abbr')
            .optional()
            .isString()
            .withMessage('Abbreviation must be a string')
            .trim(),
        
        body('email')
            .optional()
            .isEmail()
            .withMessage('Invalid email format')
            .normalizeEmail(),
        
        body('dominio')
            .optional()
            .isArray()
            .withMessage('Dominio must be an array'),
        
        body('dominio.*')
            .optional()
            .isIn(['educacao', 'ONG', 'empresa', 'comercio', 'GOV', 'politico', 'industria'])
            .withMessage('Invalid domain value'),
        
        body('enderecos')
            .optional()
            .isArray()
            .withMessage('Enderecos must be an array'),
        
        body('enderecos.*')
            .optional()
            .isString()
            .withMessage('Each address must be a string'),
        
        body('telefone')
            .optional()
            .isArray()
            .withMessage('Telefone must be an array'),
        
        body('telefone.*')
            .optional()
            .isString()
            .withMessage('Each phone number must be a string'),
        
        body('CNPJ')
            .optional()
            .isString()
            .withMessage('CNPJ must be a string')
            .matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$|^\d{14}$/)
            .withMessage('Invalid CNPJ format'),
        
        body('mediasId')
            .optional()
            .isArray()
            .withMessage('MediasId must be an array'),
        
        body('mediasId.*')
            .optional()
            .isMongoId()
            .withMessage('Invalid media ID')
    ],

    getById: [
        param('id')
            .isMongoId()
            .withMessage('Invalid institution ID')
    ],

    delete: [
        param('id')
            .isMongoId()
            .withMessage('Invalid institution ID')
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
        
        query('dominio')
            .optional()
            .isIn(['educacao', 'ONG', 'empresa', 'comercio', 'GOV', 'politico', 'industria'])
            .withMessage('Invalid domain filter'),
        
        query('search')
            .optional()
            .isString()
            .trim()
            .withMessage('Search must be a string')
    ]
};
