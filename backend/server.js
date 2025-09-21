import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { connectDb } from './dataBase/connectDb.js';
import { initGridFS } from './utils/gridfsConfig.js';
import { startFileCleanupScheduler } from './utils/fileCleanup.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { generalLimiter, authLimiter } from './middleware/rateLimiter.js';
import { securityMiddleware, corsOptions } from './middleware/security.js';
import adminRoutes from './routes/admin.route.js';
import protectedRoutes from './routes/protected.route.js';
import gridFSPdfRoutes from './routes/gridFSPdfSplit.route.js';
import pdfCoAnalysisRoutes from './routes/pdfCoAnalysis.route.js';
import pdfReportRoutes from './routes/pdfReport.route.js';
import authRoutes from './routes/auth.route.js';
import studentRoutes from './routes/student.route.js';
import subjectRoutes from './routes/subject.route.js';
import facultyRoutes from './routes/faculty.route.js';
import adminHierarchyRoutes from './routes/adminHierarchy.routes.js';
import { User } from './models/user.model.js';
import { createIndexes } from './models/index.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// CORS configuration (must be first)
app.use(cors(corsOptions));

// Security middleware
app.use(securityMiddleware);

// Rate limiting
app.use('/api/auth', authLimiter);
app.use('/api', generalLimiter);

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// In-memory session storage for temporary data (use Redis in production)
const tempSessionStorage = new Map();

// Routes
app.get("/", (req, res) => {
  res.send("Server Started successfully!");
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/pdf", gridFSPdfRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/subjects", subjectRoutes); // Subject management routes
app.use("/api/faculty", facultyRoutes); // Faculty management routes
app.use("/api/admin-hierarchy", adminHierarchyRoutes); // Admin management routes

app.use("/api/analyze", pdfCoAnalysisRoutes); // Using PDF.co as the primary analyzer
app.use("/api/reports", pdfReportRoutes); // PDF report generation and management

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, async () => {
  await connectDb();
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Server is running on http://localhost:${PORT}`);
  }
  
  // System initialization complete
  if (process.env.NODE_ENV !== 'production') {
    console.log('Admin management system initialized');
  }
  
  // Create database indexes for optimal performance
  try {
    await createIndexes();
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error creating database indexes:', error);
    }
  }
  
  // Start file cleanup scheduler for uploads folder (12-hour intervals)
  startFileCleanupScheduler();
});
