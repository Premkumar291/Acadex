import { useState, useEffect } from "react"
import { signup } from "../../../api/auth"
import { createAdmin, getHierarchy, deleteAdmin } from "../../../api/adminHierarchy"

// Icons from reference UI



const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
)

const MailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
)

const DeptIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
  </svg>
)

const RoleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
)

const LockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <circle cx="12" cy="16" r="1"></circle>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
)

const CreateFaculty = () => {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState('create') // 'create' or 'manage'
  const [adminHierarchy, setAdminHierarchy] = useState([])
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    role: "faculty" // Default to faculty
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const fetchAdminHierarchy = async () => {
    try {
      const response = await getHierarchy()
      if (response.success && response.data) {
        // New API returns createdAdmins array
        const hierarchyData = response.data.createdAdmins || []
        setAdminHierarchy(hierarchyData)
      } else {
        setAdminHierarchy([])
      }
    } catch {
      setAdminHierarchy([]) // Set empty array on error
    }
  }

  const handleDeleteAdmin = async (adminId) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      try {
        const response = await deleteAdmin(adminId)
        if (response.success) {
          fetchAdminHierarchy() // Refresh the list
        }
      } catch {
        // Ignore deletion errors - user will see if operation failed
      }
    }
  }

  useEffect(() => {
    if (activeTab === 'manage') {
      fetchAdminHierarchy()
    }
  }, [activeTab])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      let response;
      if (form.role === 'admin') {
        // Use admin creation API for admin role
        response = await createAdmin(form)
      } else {
        // Use regular signup for faculty role
        response = await signup(form)
      }
      
      if (response.success) {
        // Reset form and refresh hierarchy if needed
        setForm({
          name: "",
          email: "",
          password: "",
          department: "",
          role: "faculty"
        })
        if (form.role === 'admin') {
          fetchAdminHierarchy()
        }
        // Show success message or redirect
        alert(`${form.role === 'admin' ? 'Admin' : 'Faculty'} created successfully!`)
      }
    } catch {
      alert(`Error creating ${form.role}. Please try again.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8 text-white">
        Faculty & Admin Management
      </h1>
      
      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
              activeTab === 'create'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Create New User
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
              activeTab === 'manage'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Manage Admin Hierarchy
          </button>
        </div>
      </div>

      {/* Create New User Tab */}
      {activeTab === 'create' && (
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-center mb-6 text-white">
            {form.role === 'admin' ? 'Create New Admin Account' : 'Create New Faculty Account'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <UserIcon />
              </div>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full Name"
                required
                className="w-full h-12 pl-12 pr-4 bg-gray-800/60 border border-gray-600/50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            {/* Email Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <MailIcon />
              </div>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="College Email"
                required
                className="w-full h-12 pl-12 pr-4 bg-gray-800/60 border border-gray-600/50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            {/* Department Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <DeptIcon />
              </div>
              <input
                type="text"
                name="department"
                value={form.department}
                onChange={handleChange}
                placeholder="Department"
                required
                className="w-full h-12 pl-12 pr-4 bg-gray-800/60 border border-gray-600/50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            {/* Role Selection */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <RoleIcon />
              </div>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                required
                className="w-full h-12 pl-12 pr-4 bg-gray-800/60 border border-gray-600/50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="faculty">Faculty</option>
                <option value="admin">Admin</option>
              </select>
            </div>


            {/* Password Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <LockIcon />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className="w-full h-12 pl-12 pr-12 bg-gray-800/60 border border-gray-600/50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>

                {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full h-12 bg-blue-600 rounded-md font-medium text-white transition-all duration-200 ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
              }`}
            >
              {loading ? "Creating Account..." : `Create ${form.role === 'admin' ? 'Admin' : 'Faculty'} Account`}
            </button>
          </form>
        </div>
      )}

      {/* Manage Admin Hierarchy Tab */}
      {activeTab === 'manage' && (
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-6">Admin Hierarchy Management</h2>
          
          {!Array.isArray(adminHierarchy) || adminHierarchy.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm6 3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-300 mb-2">No Admins Found</h3>
              <p className="text-gray-400">Create your first admin using the "Create New User" tab.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {adminHierarchy.map((admin) => (
                <div key={admin._id} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{admin.name}</h3>
                      <p className="text-sm text-gray-400">{admin.email}</p>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-900/50 text-blue-300">
                      ADMIN
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-300 mb-2">
                      <span className="font-medium">Department:</span> {admin.department}
                    </p>
                    <p className="text-sm text-gray-300">
                      <span className="font-medium">Created:</span> {new Date(admin.createdAt).toLocaleDateString()}
                    </p>
                  </div>


                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDeleteAdmin(admin._id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm py-2 px-3 rounded-md transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CreateFaculty
