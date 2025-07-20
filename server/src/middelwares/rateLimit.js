import { rateLimit } from "express-rate-limit";

// General rate limiter for authentication endpoints
export const rateLimiter = rateLimit({
    windowMs: 2 * 60 * 1000, // 2 minutes
    max: 10, // 10 attempts within a 2 min window
    message: "Too many requests, please try again later",
    standardHeaders: true,
    legacyHeaders: false,
    trustProxy: true, 
});

// Rate limiter specifically for refresh token endpoint
export const refreshTokenLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes window
    max: 20, // 20 refresh attempts within 10 minutes
    message: "Too many refresh attempts, please try again later",
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    trustProxy: true, // Trust the X-Forwarded-For header
    keyGenerator: (req) => {
        // Use IP + user agent to identify unique clients
        // req.ip is now properly set because we trust the proxy
        return `${req.ip}-${req.headers['user-agent'] || 'unknown-user-agent'}`;
    }
  });