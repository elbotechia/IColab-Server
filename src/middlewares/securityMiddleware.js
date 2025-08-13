export const sanitizeInput = (req, res, next) => {
    // Function to recursively sanitize an object
    const sanitizeString = (str) => {
        if (typeof str !== 'string') return str;
        
        // Basic XSS prevention - remove script tags and common XSS patterns
        return str
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+\s*=/gi, '')
            .replace(/vbscript:/gi, '')
            .replace(/data:text\/html/gi, '')
            .trim();
    };
    
    const sanitizeObject = (obj) => {
        if (typeof obj === 'string') {
            return sanitizeString(obj);
        }
        
        if (Array.isArray(obj)) {
            return obj.map(sanitizeObject);
        }
        
        if (obj && typeof obj === 'object') {
            const sanitized = {};
            for (const [key, value] of Object.entries(obj)) {
                sanitized[key] = sanitizeObject(value);
            }
            return sanitized;
        }
        
        return obj;
    };

    // Sanitize request body - this can be overwritten
    if (req.body && typeof req.body === 'object') {
        try {
            req.body = sanitizeObject(req.body);
        } catch (error) {
            console.warn('Error sanitizing request body:', error.message);
        }
    }

    // Sanitize query parameters - modify in place instead of overwriting
    if (req.query && typeof req.query === 'object') {
        try {
            for (const [key, value] of Object.entries(req.query)) {
                if (typeof value === 'string') {
                    // Modify the existing property instead of reassigning the whole object
                    Object.defineProperty(req.query, key, {
                        value: sanitizeString(value),
                        writable: true,
                        enumerable: true,
                        configurable: true
                    });
                }
            }
        } catch (error) {
            console.warn('Error sanitizing query parameters:', error.message);
        }
    }

    // Sanitize URL parameters - modify in place instead of overwriting
    if (req.params && typeof req.params === 'object') {
        try {
            for (const [key, value] of Object.entries(req.params)) {
                if (typeof value === 'string') {
                    req.params[key] = sanitizeString(value);
                }
            }
        } catch (error) {
            console.warn('Error sanitizing URL parameters:', error.message);
        }
    }

    next();
};

export const preventXSS = (req, res, next) => {
    // Set security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'");
    
    next();
};
