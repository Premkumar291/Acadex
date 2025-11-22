# 🎓 Automated College Result Portal

A comprehensive web-based academic management system designed for educational institutions to manage student results, faculty assignments, and administrative tasks with modern security and user experience.

## ✨ Features /

### 🔐 Authentication & Authorization
- **Role-based Access Control**: Admin and Faculty user roles with hierarchical permissions
- **JWT Authentication**: Secure token-based authentication with refresh tokens
- **Password Security**: Bcrypt hashing with salt rounds for password protection
- **Session Management**: Secure session handling with HTTP-only cookies

### 👥 User Management
- **Student Management**: Complete CRUD operations with department filtering
- **Faculty Management**: Comprehensive faculty profiles with academic qualifications
- **Admin Dashboard**: Centralized control panel for system administration
- **Department Organization**: Multi-department support with role-based access

### 📊 Result Management
- **PDF Processing**: Automated PDF splitting and analysis using PDF.co API
- **GridFS Storage**: Efficient file storage using MongoDB GridFS
- **Result Analysis**: Intelligent parsing of PDF result documents
- **Data Extraction**: Automated extraction of student marks and grades

### 📋 Academic Management
- **Subject Management**: Complete subject catalog with codes, credits, and departments
- **Smart Subject Codes**: Auto-uppercase conversion with real-time validation (CS101, MATH201A)
- **Faculty Profiles**: Comprehensive faculty management with academic qualifications
- **Department Organization**: Multi-department support with role-based filtering
- **Semester Organization**: Multi-semester academic structure support
- **Input Validation**: Real-time regex validation with visual feedback indicators

### 📈 Reporting & Analytics
- **Excel Report Generation**: Institutional format Excel reports with dynamic subject columns
- **PDF Analysis Reports**: Automated PDF processing and result extraction
- **Student Performance Analytics**: Comprehensive student performance tracking
- **Department-wise Reports**: Filtered reporting by department and semester

### 🎨 Modern UI/UX
- **React 19**: Latest React with modern hooks and concurrent features
- **TailwindCSS**: Utility-first CSS framework for responsive design
- **Framer Motion**: Smooth animations and transitions
- **Responsive Design**: Mobile-first approach with cross-device compatibility
- **Dark/Light Theme**: User preference-based theme switching

## 🛠️ Technology Stack

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **GridFS** for file storage
- **ExcelJS** for report generation
- **PDF.co API** for PDF processing
- **Nodemailer** for email services

### Frontend
- **React 19** with Vite build tool
- **TailwindCSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **Axios** for API communication
- **Chart.js** for data visualization

### Security & Performance
- **Helmet.js** for security headers
- **Rate Limiting** for API protection
- **CORS** configuration
- **Input Validation** with Validator.js
- **HPP** for parameter pollution protection

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Premkumar291/Automated-Result-Portel.git
   cd Automated-Result-Portel/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   **⚠️ CRITICAL: Configure your .env file with the following variables:**
   ```env
   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/result-portal
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_REFRESH_SECRET=your-refresh-secret-key-here
   JWT_EXPIRE=24h
   JWT_REFRESH_EXPIRE=7d
   
   # Email Configuration
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   
   # PDF.co API
   PDFCO_API_KEY=your-pdfco-api-key
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   ```

4. **Start the backend server**
   ```bash
   npm run dev    # Development mode with nodemon
   npm start      # Production mode
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Configure your frontend .env:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_APP_NAME=Automated Result Portal
   ```

4. **Start the frontend development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 🔒 Security Considerations

### ⚠️ CRITICAL SECURITY REQUIREMENTS

1. **Environment Variables Protection**
   - **NEVER** commit `.env` files to version control
   - Use strong, unique secrets for JWT tokens
   - Rotate API keys regularly
   - Use environment-specific configurations

2. **Production Deployment Checklist**
   - [ ] Set `NODE_ENV=production`
   - [ ] Use HTTPS in production
   - [ ] Configure proper CORS origins
   - [ ] Enable rate limiting
   - [ ] Set up proper logging (remove console.log statements)
   - [ ] Use a process manager (PM2, Docker)
   - [ ] Configure database connection pooling
   - [ ] Set up proper backup strategies

3. **Database Security**
   - Use MongoDB authentication
   - Configure proper network access rules
   - Regular security updates
   - Data encryption at rest

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration (Admin only)
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout

### Faculty Management
- `GET /api/faculty` - Get all faculty members
- `POST /api/faculty` - Create new faculty
- `PUT /api/faculty/:id` - Update faculty
- `DELETE /api/faculty/:id` - Delete faculty
- `GET /api/faculty/department/:dept` - Get faculty by department

### Subject Management
- `GET /api/subjects` - Get all subjects
- `POST /api/subjects` - Create new subject
- `PUT /api/subjects/:id` - Update subject
- `DELETE /api/subjects/:id` - Delete subject
- `GET /api/subjects/department/:dept` - Get subjects by department

### PDF Analysis & Reports
- `POST /api/analyze/pdf` - Analyze PDF documents
- `GET /api/reports/generate` - Generate institutional reports
- `GET /api/reports/download-excel/:reportId` - Download Excel reports
- `POST /api/pdf/upload` - Upload PDF files for processing

### Admin Management
- `GET /api/admin/users` - Get all users (Admin hierarchy)
- `POST /api/admin/users` - Create new admin users
- `PUT /api/admin/users/:id` - Update user information
- `DELETE /api/admin/users/:id` - Delete users

## 👨‍💼 Usage Guide

### Admin Users
1. **Dashboard Access**: Login with admin credentials to access the full dashboard
2. **Faculty Management**: Add, edit, and manage faculty profiles with academic qualifications
3. **Subject Management**: Create and organize subjects by department and semester
4. **Student Management**: Add and manage student records with department filtering
5. **Report Generation**: Generate comprehensive Excel reports in institutional format
6. **User Management**: Create and manage faculty user accounts with hierarchical permissions

### Faculty Users
1. **Profile Management**: View and update personal profile information
2. **PDF Processing**: Upload and analyze PDF result documents
3. **Student Results**: Access and manage student results through PDF analysis
4. **Report Generation**: Generate institutional format Excel reports
5. **Result Analysis**: View comprehensive analytics and performance metrics

## 🗄️ Database Models

### User Model
- Authentication and authorization data
- Role-based permissions (admin/faculty)
- Profile information and preferences

### Faculty Model
- Personal and professional information
- Academic qualifications and studies
- Department and contact details
- Employment information

### Subject Model
- Subject code, name, and description
- Department and semester organization
- Credit hours and subject type
- Active status management

### GridFS PDF Model
- PDF file storage and metadata management
- Semester-wise PDF organization
- File processing status tracking
- Analysis results and extracted data

## 🚀 Development Scripts

### Backend
```bash
npm run dev     # Start development server with nodemon
npm start       # Start production server
```

### Frontend
```bash
npm run dev     # Start Vite development server
npm run build   # Build for production
npm run preview # Preview production build
npm run lint    # Run ESLint for code quality
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow ESLint configuration for code style
- Write meaningful commit messages
- Add proper error handling and validation
- Update documentation for new features
- Test thoroughly before submitting PRs

## 📝 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation for common solutions

## 🔄 Recent Updates

### Version 1.0.1 - Latest Enhancements (September 2025)
- ✅ **Fixed Subjects API 500 Error**: Resolved authentication issues and invalid search filters
- ✅ **Enhanced Subject Code Input**: Auto-uppercase conversion with real-time validation
  - Smart input field that converts lowercase to uppercase automatically
  - Real-time validation using regex pattern `/^[A-Z]{2,4}\d{3,4}[A-Z]?$/`
  - Visual feedback with green checkmarks (✓) for valid codes and red X marks (✗) for invalid
  - Professional monospace font styling for better code readability
- ✅ **Improved User Experience**: Visual feedback with color-coded validation indicators
- ✅ **Architecture Cleanup**: Removed unnecessary faculty-to-subject assignment logic
- ✅ **Department Consistency**: Aligned frontend/backend department configurations
- ✅ **Input Validation**: Real-time regex validation with professional styling

### Version 1.0.0 - Core Implementation
- ✅ Complete faculty management system with academic qualifications
- ✅ Subject management with department-wise organization
- ✅ Student management with CRUD operations
- ✅ PDF processing and analysis using PDF.co API
- ✅ Excel report generation with institutional format
- ✅ Admin hierarchy and user management system
- ✅ Security enhancements and console log cleanup
- ✅ Modern React UI with TailwindCSS and Framer Motion
- ✅ GridFS file storage for PDF documents
- ✅ Production-ready security configurations

### 🚧 Planned Features (Future Releases)
- 🔄 Faculty-Subject assignment system with academic year tracking
- 🔄 Advanced analytics dashboard with charts and metrics
- 🔄 Email notification system for result updates
- 🔄 Bulk import/export functionality for student data
- 🔄 Mobile-responsive design improvements

---

**⚠️ Important**: Always ensure your `.env` file is properly configured and never commit sensitive credentials to version control. Follow the security checklist before deploying to production.