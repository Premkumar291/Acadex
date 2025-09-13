// MongoDB initialization script for Docker
db = db.getSiblingDB('automated-result-portal');

// Create collections
db.createCollection('users');
db.createCollection('students');
db.createCollection('subjects');
db.createCollection('results');
db.createCollection('sessions');

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "role": 1 });
db.users.createIndex({ "createdBy": 1 });

db.students.createIndex({ "rollNumber": 1 }, { unique: true });
db.students.createIndex({ "email": 1 }, { unique: true });
db.students.createIndex({ "department": 1 });
db.students.createIndex({ "semester": 1 });

db.subjects.createIndex({ "code": 1 }, { unique: true });
db.subjects.createIndex({ "department": 1 });
db.subjects.createIndex({ "semester": 1 });

db.results.createIndex({ "studentId": 1 });
db.results.createIndex({ "subjectId": 1 });
db.results.createIndex({ "semester": 1 });
db.results.createIndex({ "academicYear": 1 });

// Create default admin user
db.users.insertOne({
  name: "System Administrator",
  email: "admin@college.edu",
  password: "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj2CPQM4Oj/K", // password: admin123
  role: "admin",
  department: "Administration",
  isVerified: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

print('Database initialized successfully with collections, indexes, and default admin user.');
