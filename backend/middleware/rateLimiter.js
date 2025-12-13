import rateLimit from 'express-rate-limit';

/**
 * General API rate limiter
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => true // Skip rate limiting for all requests
});

/**
 * Auth rate limiter (more restrictive)
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // increased limit to 100 attempts per windowMs
  message: {
    success: false,
    message: 'Rate limit exceeded, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => true // Skip rate limiting for all requests
});

/**
 * File upload rate limiter
 */
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // limit each IP to 10 file uploads per hour
  message: {
    success: false,
    message: 'Too many file uploads, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => true // Skip rate limiting for all requests
});