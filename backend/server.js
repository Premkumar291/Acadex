import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { connectDb } from './dataBase/connectDb.js';
import { createIndexes } from './models/index.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
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

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration (must be first)
app.use(cors(corsOptions));

// Security middleware
app.use(securityMiddleware);

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Simple health check routes that respond immediately
app.get("/", (req, res) => {
  res.json({
    status: "Server is running",
    message: "Acadex Backend API",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/pdf", gridFSPdfRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/admin-hierarchy", adminHierarchyRoutes);
app.use("/api/analyze", pdfCoAnalysisRoutes);
app.use("/api/reports", pdfReportRoutes);

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Database initialization (async, non-blocking)
// Database initialization handled in request wrapper

// Local development server
if (process.env.NODE_ENV !== 'production') {
  (async () => {
    try {
      await connectDb();
      console.log('Database connected successfully');
      app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  })();
}

// Export for Vercel (Native Express)
export default async (req, res) => {
  // Skip DB connection for health checks
  if (req.url === '/' || req.url === '/health') {
    return app(req, res);
  }

  try {
    // Ensure DB is connected before handling request
    await connectDb();

    // Pass request to Express app
    return app(req, res);
  } catch (error) {
    console.error('[Vercel] DB Connection Error:', error);
    res.status(500).json({ error: 'Database connection failed', details: error.message });
  }
};
