export const corsConfig = {
    origin: function (origin, callback) {
        // List of allowed origins (add your frontend URL here)
        const allowedOrigins = [
            'http://localhost:3000',  // React development server
            'http://localhost:3001',  // Alternative React port
            'http://127.0.0.1:3000',
            'http://127.0.0.1:3001',
            // Add your production domain here when deployed
            // 'https://yourdomain.com'
        ];

        // Allow requests with no origin (mobile apps, etc.)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS policy'));
        }
    },
    credentials: true, // Allow credentials (cookies, authorization headers)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
        'X-API-Key'
    ],
    exposedHeaders: ['X-Total-Count', 'X-Rate-Limit-Remaining'],
    maxAge: 86400 // 24 hours
};

export const handleCorsError = (err, req, res, next) => {
    if (err && err.message === 'Not allowed by CORS policy') {
        return res.status(403).json({
            success: false,
            message: 'CORS policy violation: Origin not allowed',
            origin: req.get('Origin')
        });
    }
    next(err);
};
