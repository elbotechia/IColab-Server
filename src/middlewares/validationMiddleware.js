import { validationResult } from 'express-validator';

export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        const extractedErrors = {};
        errors.array().forEach(err => {
            if (!extractedErrors[err.path]) {
                extractedErrors[err.path] = [];
            }
            extractedErrors[err.path].push(err.msg);
        });

        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: extractedErrors
        });
    }
    
    next();
};
