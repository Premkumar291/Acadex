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
  getSubAdminCreationStatus,
  createSubAdmin,
  updateSubAdmin,
  deleteSubAdmin
} from '../api/adminHierarchy.js';

const AdminHierarchyPage = () => {
  const [hierarchyData, setHierarchyData] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [creationStatus, setCreationStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
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
      const [hierarchyRes, statsRes, statusRes] = await Promise.all([
        getHierarchy(),
        getAdminStatistics(),
        getSubAdminCreationStatus()
      ]);
      
      setHierarchyData(hierarchyRes.data);
      setStatistics(statsRes.data);
      setCreationStatus(statusRes.data);
      
      // Auto-expand root nodes
      if (hierarchyRes.data.tree.length > 0) {
        const rootIds = hierarchyRes.data.tree.map(node => node._id);
        setExpandedNodes(new Set(rootIds));
      }
    } catch (error) {
      console.error('Error loading hierarchy data:', error);
      toast.error('Failed to load hierarchy data');
    } finally {
      setLoading(false);
    }
  };

  const toggleNode = (nodeId) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const handleCreateSubAdmin = async (e) => {
    e.preventDefault();
    try {
      await createSubAdmin(formData);
      toast.success('Sub-admin created successfully');
      setShowCreateModal(false);
      setFormData({ name: '', email: '', department: '', password: '' });
      loadHierarchyData();
    } catch (error) {
      toast.error(error.message || 'Failed to create sub-admin');
    }
  };

  const handleUpdateSubAdmin = async (e) => {
    e.preventDefault();
    try {
      await updateSubAdmin(selectedAdmin._id, {
        name: formData.name,
        email: formData.email,
        department: formData.department
      });
      toast.success('Sub-admin updated successfully');
      setShowEditModal(false);
      setSelectedAdmin(null);
      setFormData({ name: '', email: '', department: '', password: '' });
      loadHierarchyData();
    } catch (error) {
      toast.error(error.message || 'Failed to update sub-admin');
    }
  };

  const handleDeleteSubAdmin = async (adminId, adminName) => {
    if (window.confirm(`Are you sure you want to delete ${adminName}? This action cannot be undone.`)) {
      try {
        await deleteSubAdmin(adminId);
        toast.success('Sub-admin deleted successfully');
        loadHierarchyData();
      } catch (error) {
        toast.error(error.message || 'Failed to delete sub-admin');
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

  const renderTreeNode = (node, level = 0) => {
    const isExpanded = expandedNodes.has(node._id);
    const hasChildren = node.children && node.children.length > 0;
    const hasFaculty = node.faculty && node.faculty.length > 0;
    
    // Filter logic
    const shouldShow = selectedFilter === 'all' || 
      (selectedFilter === 'admins' && node.role === 'admin') ||
      (selectedFilter === 'faculty' && node.role === 'faculty');
    
    // Search logic
    const matchesSearch = !searchTerm || 
      node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.department.toLowerCase().includes(searchTerm.toLowerCase());

    if (!shouldShow || !matchesSearch) return null;

    return (
      <div
        key={node._id}
        className="mb-2"
        style={{ marginLeft: `${level * 24}px` }}
      >
        {/* Admin Node */}
        <div className="flex items-center p-3 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          {/* Expand/Collapse Button */}
          {(hasChildren || hasFaculty) && (
            <button
              onClick={() => toggleNode(node._id)}
              className="mr-2 p-1 hover:bg-gray-100 rounded"
            >
              {isExpanded ? (
                <ChevronDownIcon className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronRightIcon className="w-4 h-4 text-gray-600" />
              )}
            </button>
          )}

          {/* Role Icon */}
          <div className="mr-3">
            {node.role === 'admin' ? (
              <ShieldCheckIcon className="w-6 h-6 text-blue-600" />
            ) : (
              <AcademicCapIcon className="w-6 h-6 text-green-600" />
            )}
          </div>

          {/* User Info */}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{node.name}</h3>
                <p className="text-sm text-gray-600">{node.email}</p>
                <div className="flex items-center mt-1 space-x-4">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {node.department}
                  </span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {node.role === 'admin' ? `Level ${node.adminLevel}` : 'Faculty'}
                  </span>
                  {node.createdBy && (
                    <span className="text-xs text-gray-500">
                      Created by: {node.createdBy.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {node.role === 'admin' && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => openEditModal(node)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Admin"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteSubAdmin(node._id, node.name)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Admin"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Children and Faculty */}
        {isExpanded && (
          <div className="mt-2">
            {/* Sub-admins */}
            {hasChildren && node.children.map(child => renderTreeNode(child, level + 1))}
            
            {/* Faculty members */}
            {hasFaculty && (
              <div style={{ marginLeft: `${(level + 1) * 24}px` }}>
                {node.faculty.map(faculty => (
                  <div
                    key={faculty._id}
                    className="flex items-center p-2 bg-green-50 rounded-lg border border-green-200 mb-1"
                  >
                    <AcademicCapIcon className="w-5 h-5 text-green-600 mr-3" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{faculty.displayName}</p>
                      <p className="text-sm text-gray-600">{faculty.email}</p>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        {faculty.department}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Hierarchy Management</h1>
          <p className="text-gray-600">Manage your administrative hierarchy and view organizational structure</p>
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <ShieldCheckIcon className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Admin Level</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.adminLevel}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <UserGroupIcon className="w-8 h-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Direct Sub-Admins</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statistics.directSubAdmins}/{statistics.maxSubAdmins}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <UserIcon className="w-8 h-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Visible Admins</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.totalVisibleAdmins}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <AcademicCapIcon className="w-8 h-8 text-orange-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Visible Faculty</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.totalVisibleFaculty}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              {/* Search */}
              <input
                type="text"
                placeholder="Search by name, email, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              {/* Filter */}
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Users</option>
                <option value="admins">Admins Only</option>
                <option value="faculty">Faculty Only</option>
              </select>
            </div>

            {/* Create Sub-Admin Button */}
            {creationStatus?.canCreate && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Create Sub-Admin
              </button>
            )}
          </div>

          {/* Creation Status Info */}
          {creationStatus && !creationStatus.canCreate && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Cannot create sub-admin:</strong> {creationStatus.reason}
              </p>
            </div>
          )}
        </div>

        {/* Hierarchy Tree */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Organizational Hierarchy</h2>
          
          {hierarchyData?.tree && hierarchyData.tree.length > 0 ? (
            <div className="space-y-4">
              {hierarchyData.tree.map(node => renderTreeNode(node))}
            </div>
          ) : (
            <div className="text-center py-12">
              <UserGroupIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No hierarchy data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Sub-Admin Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Sub-Admin</h3>
            <form onSubmit={handleCreateSubAdmin}>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <input
                  type="text"
                  placeholder="Department"
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Sub-Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Sub-Admin Modal */}
      {showEditModal && selectedAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Sub-Admin</h3>
            <form onSubmit={handleUpdateSubAdmin}>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <input
                  type="text"
                  placeholder="Department"
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Sub-Admin
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
