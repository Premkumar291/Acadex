import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  ChevronDownIcon, 
  ChevronRightIcon, 
  UserGroupIcon, 
  UserIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  EyeIcon,
  ShieldCheckIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import {
  getHierarchy,
  getAdminStatistics,
  updateAdmin,
  deleteAdmin,
  deleteFacultyUser
} from '../api/adminHierarchy.js';

// Helper function to format date as dd-mm-yyyy
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const AdminHierarchyPage = () => {
  const [hierarchyData, setHierarchyData] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    password: ''
  });

  useEffect(() => {
    loadHierarchyData();
  }, []);

  const loadHierarchyData = async () => {
    try {
      setLoading(true);
      const [hierarchyRes, statsRes] = await Promise.all([
        getHierarchy(),
        getAdminStatistics()
      ]);
      
      setHierarchyData(hierarchyRes.data);
      setStatistics(statsRes.data);
      
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error loading hierarchy data:', error);
      }
      toast.error('Failed to load hierarchy data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAdmin = async (e) => {
    e.preventDefault();
    try {
      await updateAdmin(selectedAdmin._id, {
        name: formData.name,
        email: formData.email,
        department: formData.department
      });
      toast.success('Admin updated successfully');
      setShowEditModal(false);
      setSelectedAdmin(null);
      setFormData({ name: '', email: '', department: '', password: '' });
      loadHierarchyData();
    } catch (error) {
      toast.error(error.message || 'Failed to update admin');
    }
  };

  const handleDeleteAdmin = async (adminId, adminName) => {
    if (window.confirm(`Are you sure you want to delete ${adminName}? This action cannot be undone.`)) {
      try {
        await deleteAdmin(adminId);
        toast.success('Admin deleted successfully');
        loadHierarchyData();
      } catch (error) {
        toast.error(error.message || 'Failed to delete admin');
      }
    }
  };

  const handleDeleteFaculty = async (facultyId, facultyName) => {
    if (window.confirm(`Are you sure you want to delete ${facultyName}? This action cannot be undone.`)) {
      try {
        await deleteFacultyUser(facultyId);
        toast.success('Faculty deleted successfully');
        loadHierarchyData();
      } catch (error) {
        toast.error(error.message || 'Failed to delete faculty');
      }
    }
  };

  const openEditModal = (admin) => {
    setSelectedAdmin(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      department: admin.department,
      password: ''
    });
    setShowEditModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Management</h1>
          <p className="text-gray-300">Manage admins & users  and view organizational structure</p>
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
              <div className="flex items-center">
                <UserGroupIcon className="w-8 h-8 text-green-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-400">Created Admins</p>
                  <p className="text-2xl font-bold text-white">{statistics.createdAdmins || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
              <div className="flex items-center">
                <UserIcon className="w-8 h-8 text-purple-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-400">Created Users</p>
                  <p className="text-2xl font-bold text-white">{statistics.createdUsers || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
              <div className="flex items-center">
                <AcademicCapIcon className="w-8 h-8 text-green-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-400">Created Faculty</p>
                  <p className="text-2xl font-bold text-white">{hierarchyData?.createdFaculty?.length || 0}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Admin List */}
        <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">Created Admins</h2>
          
          {hierarchyData?.createdAdmins && hierarchyData.createdAdmins.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {hierarchyData.createdAdmins.map(admin => (
                <div key={admin._id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <ShieldCheckIcon className="w-6 h-6 text-blue-500 mr-3" />
                      <div>
                        <h3 className="font-semibold text-white">{admin.name}</h3>
                        <p className="text-sm text-gray-300">{admin.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <span className="text-xs bg-blue-900 text-blue-200 px-2 py-1 rounded">
                      {admin.department}
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditModal(admin)}
                      className="flex-1 px-3 py-1 text-sm text-blue-400 hover:bg-blue-900 rounded transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteAdmin(admin._id, admin.name)}
                      className="flex-1 px-3 py-1 text-sm text-red-400 hover:bg-red-900 rounded transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <UserGroupIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No admins created yet</p>
            </div>
          )}
        </div>

        {/* Faculty List with Delete Option */}
        <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Created Faculty</h2>
          
          {hierarchyData?.createdFaculty && hierarchyData.createdFaculty.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {hierarchyData.createdFaculty.map(faculty => (
                <div key={faculty._id} className="bg-green-900/20 rounded-lg p-4 border border-green-800/30">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <AcademicCapIcon className="w-6 h-6 text-green-500 mr-3" />
                      <div>
                        <h3 className="font-semibold text-white">{faculty.name}</h3>
                        <p className="text-sm text-gray-300">{faculty.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3 space-y-1">
                    <span className="text-xs bg-green-900/50 text-green-200 px-2 py-1 rounded mr-2">
                      {faculty.department}
                    </span>
                    {faculty.phoneNumber && (
                      <p className="text-xs text-gray-400">📞 {faculty.phoneNumber}</p>
                    )}
                    <p className="text-xs text-gray-400">
                      Created: {formatDate(faculty.createdAt)}
                    </p>
                  </div>
                  
                  {/* Delete Button for Faculty */}
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={() => handleDeleteFaculty(faculty.user?._id || faculty._id, faculty.name)}
                      className="px-3 py-1 text-sm text-red-400 hover:bg-red-900 rounded transition-colors flex items-center"
                    >
                      <TrashIcon className="w-4 h-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <AcademicCapIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No faculty created yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Admin Modal */}
      {showEditModal && selectedAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-white mb-4">Edit Admin</h3>
            <form onSubmit={handleUpdateAdmin}>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
                  required
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
                  required
                />
                <input
                  type="text"
                  placeholder="Department"
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHierarchyPage;