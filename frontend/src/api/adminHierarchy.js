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

// Get hierarchy tree for current admin
export const getHierarchy = async () => {
  try {
    const response = await api.get('/hierarchy');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get visible users (admins and faculty)
export const getVisibleUsers = async (type = null) => {
  try {
    const params = type ? { type } : {};
    const response = await api.get('/visible-users', { params });
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

// Get sub-admin creation status
export const getSubAdminCreationStatus = async () => {
  try {
    const response = await api.get('/sub-admin-status');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Create sub-admin
export const createSubAdmin = async (subAdminData) => {
  try {
    const response = await api.post('/sub-admin', subAdminData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update sub-admin
export const updateSubAdmin = async (id, updateData) => {
  try {
    const response = await api.put(`/sub-admin/${id}`, updateData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete sub-admin
export const deleteSubAdmin = async (id) => {
  try {
    const response = await api.delete(`/sub-admin/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export default {
  getHierarchy,
  getVisibleUsers,
  getAdminStatistics,
  getSubAdminCreationStatus,
  createSubAdmin,
  updateSubAdmin,
  deleteSubAdmin,
};
