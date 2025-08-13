const registrationAttempts = new Map();
const LOGIN_ATTEMPTS_LIMIT = 5;
const REGISTRATION_LIMIT = 3;
const WINDOW_TIME = 15 * 60 * 1000; // 15 minutes

export const rateLimitRegistration = (req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    // Clean old attempts
    for (const [ip, data] of registrationAttempts.entries()) {
        if (now - data.firstAttempt > WINDOW_TIME) {
            registrationAttempts.delete(ip);
        }
    }
    
    const attempts = registrationAttempts.get(clientIP) || { count: 0, firstAttempt: now };
    
    if (attempts.count >= REGISTRATION_LIMIT) {
        const timeLeft = Math.ceil((WINDOW_TIME - (now - attempts.firstAttempt)) / 1000 / 60);
        return res.status(429).json({
            success: false,
            message: `Too many registration attempts. Please try again in ${timeLeft} minutes.`,
            retryAfter: timeLeft
        });
    }
    
    // Increment attempt count
    attempts.count++;
    registrationAttempts.set(clientIP, attempts);
    
    next();
};

export const rateLimitLogin = (req, res, next) => {
    // Similar logic for login attempts if needed
    next();
};
