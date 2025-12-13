const mongoose = require('mongoose');
const { Subject } = require('./models/subject.model.js');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/acadex', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
}).then(async () => {
  console.log('Connected to database');
  
  // Check all subjects
  const allSubjects = await Subject.find({}).lean();
  console.log('All Subjects:', allSubjects);
  
  // Check IT department subjects
  const itSubjects = await Subject.findByDepartment('IT');
  console.log('IT Department Subjects:', itSubjects);
  
  // Close connection
  mongoose.connection.close();
}).catch(err => {
  console.error('Database connection error:', err);
});