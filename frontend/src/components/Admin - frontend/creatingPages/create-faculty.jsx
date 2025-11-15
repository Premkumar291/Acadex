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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4 sm:p-6">
      {/* Header - Centered */}
      <div className="mb-12 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-700 mb-2">Faculty & Admin Management</h1>
        <p className="text-gray-600">Create new faculty and admin accounts</p>
      </div>

      {/* Create New User Form - Horizontal Layout */}
      <div className="max-w-6xl mx-auto">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Name Input */}
            <div>
              <label className="flex text-sm font-medium text-gray-700 mb-1 items-center">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-neutral-900 placeholder-gray-400"
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="flex text-sm font-medium text-gray-700 mb-1 items-center">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-neutral-900 placeholder-gray-400"
              />
            </div>

            {/* Department Input */}
            <div>
              <label className="flex text-sm font-medium text-gray-700 mb-1 items-center">
                <Building className="mr-2" size={16} />
                Department
              </label>
              <select
                name="department"
                value={form.department}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-neutral-900"
              >
                <option value="">Select Department</option>
                {DEPARTMENT_OPTIONS.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Role Selection */}
            <div>
              <label className="flex text-sm font-medium text-gray-700 mb-1 items-center">
                <Users className="mr-2" size={16} />
                Role
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-neutral-900"
              >
                {ROLE_OPTIONS.map((role) => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </select>
            </div>

            {/* Password Input */}
            <div>
              <label className="flex text-sm font-medium text-gray-700 mb-1 items-center">
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
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-neutral-900 placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
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
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-md text-sm font-medium text-white ${
                  loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {loading ? "Creating..." : `Create ${form.role === 'admin' ? 'Admin' : 'Faculty'}`}
              </button>
            </div>
        </form>
      </div>
    </div>
  )
}

export default CreateFaculty