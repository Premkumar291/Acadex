/**
 * Database indexes and optimization configuration
 */
import { User } from './user.model.js';
import { Subject } from './subject.model.js';
import { Faculty } from './faculty.model.js';

/**
 * Create database indexes for optimal query performance
 */
export const createIndexes = async () => {
  try {
    if (process.env.NODE_ENV !== 'production') {
      console.log('Creating database indexes...');
    }

    // User model indexes
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ department: 1 });
    await User.collection.createIndex({ role: 1 });
    await User.collection.createIndex({ createdAt: -1 });
    // Removed hierarchyPath.level index as field doesn't exist in current schema

    // Subject model indexes
    await Subject.collection.createIndex({ subjectCode: 1 }, { unique: true });
    await Subject.collection.createIndex({ department: 1 });
    await Subject.collection.createIndex({ semester: 1 });
    await Subject.collection.createIndex({ subjectType: 1 });
    await Subject.collection.createIndex({ active: 1 });
    await Subject.collection.createIndex({ department: 1, semester: 1 });

    // Faculty model indexes
    await Faculty.collection.createIndex({ email: 1 }, { unique: true });
    await Faculty.collection.createIndex({ employeeId: 1 }, { unique: true });
    await Faculty.collection.createIndex({ department: 1 });
    await Faculty.collection.createIndex({ active: 1 });
    await Faculty.collection.createIndex({ dateOfJoining: -1 });


    if (process.env.NODE_ENV !== 'production') {
      console.log('Database indexes created successfully');
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
