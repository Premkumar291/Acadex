/**
 * Application constants and configuration
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    SUBJECTS: '/admin/subject-management',
    FACULTY: '/admin/faculty-management',
    ASSIGNMENTS: '/admin/assignment-management',
    REPORTS: '/admin/reports'
  },
  FACULTY: {
    DASHBOARD: '/faculty/dashboard',
    REPORTS: '/faculty/reports',
    PROFILE: '/faculty/profile'
  }
};

export const USER_ROLES = {
  ADMIN: 'admin',
  FACULTY: 'faculty',
  STUDENT: 'student'
};

export const DEPARTMENTS = [
  'Computer Science',
  'Electronics',
  'Mechanical',
  'Civil',
  'Mathematics',
  'Physics',
  'Chemistry'
];

export const SEMESTERS = ['1', '2', '3', '4', '5', '6', '7', '8'];

export const SUBJECT_TYPES = ['Theory', 'Practical', 'Project'];

export const ASSIGNMENT_TYPES = [
  'Primary Instructor',
  'Co-Instructor',
  'Lab Instructor',
  'Guest Lecturer'
];

export const FILE_TYPES = {
  PDF: 'application/pdf',
  EXCEL: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  CSV: 'text/csv'
};

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100]
};

export const TOAST_DURATION = 4000;

export const DEBOUNCE_DELAY = 300;

export const LOCAL_STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
  LANGUAGE: 'language'
};
