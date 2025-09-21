import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to uploads directory
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
const CLEANUP_INTERVAL = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
const FILE_MAX_AGE = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

/**
 * Delete files older than the specified age
 */
export const cleanupOldFiles = async () => {
  try {
    if (process.env.NODE_ENV !== 'production') {
      console.log('🧹 Starting file cleanup process...');
    }
    
    // Ensure uploads directory exists
    if (!fs.existsSync(UPLOADS_DIR)) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('📁 Uploads directory does not exist, creating it...');
      }
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
      return;
    }

    const files = fs.readdirSync(UPLOADS_DIR);
    const now = Date.now();
    let deletedCount = 0;

    for (const file of files) {
      const filePath = path.join(UPLOADS_DIR, file);
      
      try {
        const stats = fs.statSync(filePath);
        const fileAge = now - stats.mtime.getTime();

        if (fileAge > FILE_MAX_AGE) {
          fs.unlinkSync(filePath);
          deletedCount++;
          if (process.env.NODE_ENV !== 'production') {
            console.log(`🗑️  Deleted old file: ${file} (age: ${Math.round(fileAge / (1000 * 60 * 60))} hours)`);
          }
        }
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.error(`❌ Error processing file ${file}:`, error.message);
        }
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log(`✅ File cleanup completed. Deleted ${deletedCount} files.`);
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('❌ Error during file cleanup:', error);
    }
  }
};

/**
 * Start the automatic file cleanup scheduler
 */
export const startFileCleanupScheduler = () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('🚀 Starting file cleanup scheduler (12-hour intervals)...');
  }
  
  // Run cleanup immediately on startup
  cleanupOldFiles();
  
  // Schedule cleanup every 12 hours
  setInterval(cleanupOldFiles, CLEANUP_INTERVAL);
  
  if (process.env.NODE_ENV !== 'production') {
    console.log('⏰ File cleanup scheduler is running');
  }
};

/**
 * Manually trigger file cleanup (for testing or manual cleanup)
 */
export const manualCleanup = () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('🔧 Manual file cleanup triggered');
  }
  return cleanupOldFiles();
};
