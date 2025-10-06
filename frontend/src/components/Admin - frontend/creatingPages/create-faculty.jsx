import { useState } from "react"
import { createAdmin, createFacultyUser } from "../../../api/adminHierarchy"
import { Search, Plus, User, Mail, Building, Lock, Eye, EyeOff, Users } from "lucide-react"

// Department options matching the backend validation
const DEPARTMENT_OPTIONS = [
  'CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 
  'AUTO', 'CS & DS', 'ENGLISH', 'MATHS', 'PHYSICS', 'CHEMISTRY'
]

const ROLE_OPTIONS = [
  { value: "faculty", label: "Faculty" },
  { value: "admin", label: "Admin" }
]

const CreateFaculty = () => {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    role: "faculty"
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    
    setForm({
      ...form,
      [name]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      let response;
      if (form.role === 'admin') {
        // Use admin creation API for admin role
        response = await createAdmin(form)
      } else {
        // Validate name
        if (!form.name || form.name.trim().length === 0) {
          throw new Error('Name is required')
        }
        
        // Validate department
        const department = form.department.toUpperCase()
        const validDepartments = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'AUTO', 'CS & DS', 'ENGLISH', 'MATHS', 'PHYSICS', 'CHEMISTRY', 'OTHER']
        if (!validDepartments.includes(department)) {
          throw new Error(`Invalid department. Must be one of: ${validDepartments.join(', ')}`)
        }
        
        // Create the faculty user account in the User model
        const userData = {
          name: form.name.trim(),
          email: form.email,
          password: form.password,
          department: department,
          role: 'faculty' // Explicitly set role to faculty
        }
        
        // Create the faculty user account
        response = await createFacultyUser(userData)
      }
      
      if (response.success) {
        // Reset form
        setForm({
          name: "",
          email: "",
          password: "",
          department: "",
          role: "faculty"
        })
        // Show success message
        alert(`${form.role === 'admin' ? 'Admin' : 'Faculty'} created successfully!`)
      } else {
        alert(`Failed to create ${form.role}: ${response.message}`)
      }
    } catch (error) {
      console.error('Error creating user:', error)
      alert(`Error creating ${form.role}: ${error.message || 'Please try again.'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Faculty & Admin Management</h1>
            <p className="text-gray-600 mt-2">Create new faculty and admin accounts</p>
          </div>
        </div>
      </div>

      {/* Create New User Form */}
      <div className="bg-white rounded-lg shadow overflow-hidden max-w-2xl mx-auto">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {form.role === 'admin' ? 'Create New Admin Account' : 'Create New Faculty Account'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <User className="mr-2" size={16} />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter full name"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Mail className="mr-2" size={16} />
                College Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter college email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              />
            </div>

            {/* Department Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Building className="mr-2" size={16} />
                Department
              </label>
              <select
                name="department"
                value={form.department}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              >
                <option value="">Select Department</option>
                {DEPARTMENT_OPTIONS.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Users className="mr-2" size={16} />
                Role
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              >
                {ROLE_OPTIONS.map((role) => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </select>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Lock className="mr-2" size={16} />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-md font-medium text-white transition-all duration-200 flex items-center justify-center ${
                  loading 
                    ? "bg-blue-400 cursor-not-allowed" 
                    : "bg-blue-600 hover:bg-blue-700 hover:scale-[1.02]"
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  `Create ${form.role === 'admin' ? 'Admin' : 'Faculty'} Account`
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Information Section */}
      <div className="mt-8 max-w-2xl mx-auto">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-2">Account Creation Guidelines</h3>
          <ul className="list-disc list-inside text-blue-800 space-y-1 text-sm">
            <li>Faculty accounts will be created with the 'faculty' role in the system</li>
            <li>Admin accounts will be created with the 'admin' role and can manage other users</li>
            <li>All accounts will inherit the college name from the current admin's account</li>
            <li>Passwords must be at least 8 characters long for security</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default CreateFaculty