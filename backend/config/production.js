const production = {
  // Database Configuration
  database: {
    uri: process.env.MONGODB_URI || 'mongodb+srv://username:password@cluster.mongodb.net/automated-result-portal?retryWrites=true&w=majority',
    name: process.env.DB_NAME || 'automated-result-portal',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferMaxEntries: 0,
      bufferCommands: false,
    }
  },

  // Server Configuration
  server: {
    port: process.env.PORT || 8080,
    host: '0.0.0.0',
    cors: {
      origin: process.env.CORS_ORIGIN || 'https://your-domain.com',
      credentials: true,
      optionsSuccessStatus: 200
    }
  },

  // Security Configuration
  security: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 12,
    sessionSecret: process.env.SESSION_SECRET
    // Removed rateLimiting configuration to disable IP logging and limits
  },

  // File Upload Configuration
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760, // 10MB
    uploadPath: process.env.UPLOAD_PATH || './uploads',
    allowedTypes: ['application/pdf', 'image/jpeg', 'image/png', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
  },

  // Email Configuration
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  },

  // Logging Configuration
  logging: {
    level: 'info',
    format: 'combined',
    file: {
      enabled: true,
      filename: 'logs/production.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }
  },

  // Performance Configuration
  performance: {
    compression: true,
    helmet: true,
    trustProxy: true
  }
};

module.exports = production;