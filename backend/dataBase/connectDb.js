import mongoose from 'mongoose';
import { initGridFS } from '../utils/gridfsConfig.js';

// MongoDB connection with GridFS initialization
export const connectDb = async () => {
  try {
    // Check if MONGODB_URI is defined
    if (!process.env.MONGODB_URI) {
      console.error('Error: MONGODB_URI is not defined in environment variables');
      console.error('Please check your .env file and ensure MONGODB_URI is properly set');
      process.exit(1);
    }

    console.log('Attempting to connect to MongoDB...');
    console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000, // Increased from 5000ms
      socketTimeoutMS: 45000,
      maxIdleTimeMS: 30000,
      connectTimeoutMS: 10000,
      // Retry configuration
      retryWrites: true
    });
    
    // Initialize GridFS
    const { gfs, gridFSBucket } = initGridFS(conn.connection);
    console.log('GridFS initialized successfully');
    
    console.log(`MongoDB connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    console.error('Full error details:', error);
    process.exit(1); // Exit the process with failure
  }
};