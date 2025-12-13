import helmet from 'helmet';
import hpp from 'hpp';

/**
 * Custom MongoDB sanitization middleware for Express 5 compatibility
 */
const mongoSanitize = (req, res, next) => {
  const sanitizeObject = (obj) => {
    if (obj && typeof obj === 'object') {
      for (const key in obj) {
        if (key.includes('$') || key.includes('.')) {
          delete obj[key];
        } else if (typeof obj[key] === 'object') {
          sanitizeObject(obj[key]);
        }
      }
    }
  };

  // Sanitize body
  if (req.body) {
    sanitizeObject(req.body);
  }

  // Sanitize params
  if (req.params) {
    sanitizeObject(req.params);
  }

  // For Express 5 compatibility, create a new query object instead of modifying the read-only one
  if (req.query) {
    const sanitizedQuery = JSON.parse(JSON.stringify(req.query));
    sanitizeObject(sanitizedQuery);
    // Replace the query object with sanitized version
    Object.defineProperty(req, 'query', {
      value: sanitizedQuery,
      writable: false,
      enumerable: true,
      configurable: true
    });
  }

  next();
};

/**
 * Custom XSS sanitization middleware for Express 5 compatibility
 */
const xssSanitize = (req, res, next) => {
  const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    return str
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  };

  const sanitizeObject = (obj) => {
    if (obj && typeof obj === 'object') {
      for (const key in obj) {
        if (typeof obj[key] === 'string') {
          obj[key] = sanitizeString(obj[key]);
        } else if (typeof obj[key] === 'object') {
          sanitizeObject(obj[key]);
        }
      }
    }
  };

  // Sanitize body
  if (req.body) {
    sanitizeObject(req.body);
  }

  // Sanitize params
  if (req.params) {
    sanitizeObject(req.params);
  }

  // For Express 5 compatibility, create a new query object for XSS sanitization
  if (req.query) {
    const sanitizedQuery = JSON.parse(JSON.stringify(req.query));
    sanitizeObject(sanitizedQuery);
    // Replace the query object with sanitized version
    Object.defineProperty(req, 'query', {
      value: sanitizedQuery,
      writable: false,
      enumerable: true,
      configurable: true
    });
  }

  next();
};

/**
 * Security middleware configuration
 */
export const securityMiddleware = [
  // Set security headers
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'"],
        connectSrc: ["'self'", "http://localhost:*"],
      },
    },
  }),

  // Data sanitization against NoSQL query injection
  mongoSanitize,

  // Data sanitization against XSS attacks
  xssSanitize,

  // Prevent HTTP Parameter Pollution attacks
  hpp({
    whitelist: ['sort', 'fields', 'page', 'limit']
  })
];

/**
 * CORS configuration for development and production
 */
export const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174', 
    'http://localhost:5175',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'X-Access-Token'
  ],
  preflightContinue: false
};
