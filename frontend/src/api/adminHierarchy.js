import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/admin-hierarchy`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Admin Hierarchy API Service Functions
 */

// Get admin info and their created users
export const getHierarchy = async () => {
  try {
    const response = await api.get('/info');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get users created by current admin
export const getVisibleUsers = async (type = null) => {
  try {
    const params = type ? { type } : {};
    const response = await api.get('/created-users', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get admin statistics
export const getAdminStatistics = async () => {
  try {
    const response = await api.get('/statistics');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get admin creation status
export const getAdminCreationStatus = async () => {
  try {
    const response = await api.get('/creation-status');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Alias for backward compatibility
export const getSubAdminCreationStatus = getAdminCreationStatus;

// Create admin
export const createAdmin = async (adminData) => {
  try {
    const response = await api.post('/admin', adminData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Alias for backward compatibility
export const createSubAdmin = createAdmin;

// Update admin
export const updateAdmin = async (id, updateData) => {
  try {
    const response = await api.put(`/admin/${id}`, updateData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Alias for backward compatibility
export const updateSubAdmin = updateAdmin;

// Delete admin
export const deleteAdmin = async (id) => {
  try {
    const response = await api.delete(`/admin/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Alias for backward compatibility
export const deleteSubAdmin = deleteAdmin;

export default {
  getHierarchy,
  getVisibleUsers,
  getAdminStatistics,
  getAdminCreationStatus,
  getSubAdminCreationStatus,
  createAdmin,
  createSubAdmin,
  updateAdmin,
  updateSubAdmin,
  deleteAdmin,
  deleteSubAdmin,
};
