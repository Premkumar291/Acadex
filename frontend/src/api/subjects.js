import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: `${API_URL}/subjects`,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor for debugging
api.interceptors.request.use(
    (config) => {
        // The backend expects JWT token in cookies, not Authorization header
        // Since withCredentials: true is set, cookies will be sent automatically
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('Subject API Error:', {
            status: error.response?.status,
            message: error.response?.data?.message || error.message,
            url: error.config?.url
        });
        return Promise.reject(error);
    }
);

// Subject Management API
export const subjectAPI = {
    // Create new subject
    createSubject: async (subjectData) => {
        try {
            const response = await api.post('/', subjectData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || error.response?.data || error.message || 'Failed to create subject');
        }
    },

    // Get all subjects with filters
    getSubjects: async (params = {}) => {
        try {
            const response = await api.get('/', { params });
            return response.data;
        } catch (error) {
            console.error('Error in getSubjects:', error);
            throw new Error(error.response?.data?.message || error.response?.data || error.message || 'Failed to fetch subjects');
        }
    },

    // Get subject by ID
    getSubjectById: async (id) => {
        try {
            const response = await api.get(`/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || error.response?.data || error.message || 'Failed to fetch subject');
        }
    },

    // Update subject
    updateSubject: async (id, updateData) => {
        try {
            const response = await api.put(`/${id}`, updateData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || error.response?.data || error.message || 'Failed to update subject');
        }
    },

    // Delete subject
    deleteSubject: async (id) => {
        try {
            const response = await api.delete(`/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || error.response?.data || error.message || 'Failed to delete subject');
        }
    },

    // Get subjects by department
    getSubjectsByDepartment: async (department) => {
        try {
            if (!department) {
                throw new Error('Department is required');
            }
            const response = await api.get(`/department/${encodeURIComponent(department)}`);
            return response.data;
        } catch (error) {
            console.error('Error in getSubjectsByDepartment:', error);
            throw new Error(error.response?.data?.message || error.response?.data || error.message || `Failed to fetch subjects for department: ${department}`);
        }
    },

    // Note: Faculty-Subject assignment is handled separately through Faculty Management system
};

// Constants for dropdowns
export const DEGREE_OPTIONS = [
    'PhD', 'M.Tech', 'M.E', 'M.Sc', 'M.A', 'M.Com', 'MBA', 'MCA', 
    'B.Tech', 'B.E', 'B.Sc', 'B.A', 'B.Com', 'BCA', 'Diploma', 'Other'
];

export const TITLE_OPTIONS = [
    'Dr.', 'Prof.', 'Asst. Prof.', 'Assoc. Prof.', 'Mr.', 'Ms.', 'Mrs.'
];

export const DEPARTMENT_OPTIONS = [
    'CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'AIDS', 'AIML', 'CSBS', 'OTHER'
];

export default subjectAPI;