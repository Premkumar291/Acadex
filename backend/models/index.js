/**
 * Database indexes and optimization configuration
 */
import { User } from './user.model.js';
import { Subject } from './subject.model.js';
// Faculty model is not used for faculty accounts, only for other purposes
import { Faculty } from './faculty.model.js';

/**
 * Create database indexes for optimal query performance
 */
export const createIndexes = async () => {
  try {
    if (process.env.NODE_ENV !== 'production') {
      console.log('Creating database indexes...');
    }

    // Indexes are handled by Mongoose Schema definitions

    if (process.env.NODE_ENV !== 'production') {
      console.log('Database indexes check completed');
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error creating database indexes:', error);
    }
  }
};

/**
 * Drop all indexes (for maintenance)
 */
export const dropIndexes = async () => {
  try {
    if (process.env.NODE_ENV !== 'production') {
      console.log('Dropping database indexes...');
    }

    await User.collection.dropIndexes();
    await Subject.collection.dropIndexes();
    await Faculty.collection.dropIndexes();

    if (process.env.NODE_ENV !== 'production') {
      console.log('Database indexes dropped successfully');
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error dropping database indexes:', error);
    }
  }
};