import { useState, useEffect } from "react"
import { Search, Plus, Edit2, Trash2, Users, X, Filter } from "lucide-react"
import { facultyAPI, TITLE_OPTIONS, DEPARTMENT_OPTIONS } from "../../../api/faculty"
import toast from "react-hot-toast"

const FacultyManagement = () => {
  const [faculty, setFaculty] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingFaculty, setEditingFaculty] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("")

  const [formData, setFormData] = useState({
    title: "",
    name: "",
    initials: "",
    department: "",
  })

  const fetchFaculty = async () => {
    setLoading(true)
    try {
      const params = {
        ...(searchTerm && { search: searchTerm }),
        ...(departmentFilter && { department: departmentFilter }),
      }
      
      const response = await facultyAPI.getFaculty(params)
      setFaculty(response.data || [])
    } catch (error) {
      console.error('Faculty fetch error:', error)
      toast.error("Failed to fetch faculty: " + (error.message || 'Unknown error'))
      setFaculty([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFaculty()
  }, [searchTerm, departmentFilter])

  const resetForm = () => {
    setFormData({
      title: "",
      name: "",
      initials: "",
      department: "",
    })
    setEditingFaculty(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editingFaculty) {
        await facultyAPI.updateFaculty(editingFaculty._id, formData)
        toast.success("Faculty updated successfully!")
      } else {
        await facultyAPI.createFaculty(formData)
        toast.success("Faculty created successfully!")
      }
      setShowModal(false)
      resetForm()
      fetchFaculty()
    } catch (error) {
      toast.error(error.message || "Operation failed")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (facultyId) => {
    if (!confirm("Are you sure you want to delete this faculty member?")) return
    try {
      await facultyAPI.deleteFaculty(facultyId)
      toast.success("Faculty deleted successfully!")
      fetchFaculty()
    } catch (error) {
      toast.error("Failed to delete faculty: " + error.message)
    }
  }

  const openEditModal = (facultyMember) => {
    setEditingFaculty(facultyMember)
    setFormData({
      title: facultyMember.title || "",
      name: facultyMember.name || "",
      initials: facultyMember.initials || "",
      department: facultyMember.department || "",
    })
    setShowModal(true)
  }

  const filteredFaculty = faculty.filter((facultyMember) => {
    const matchesSearch =
      facultyMember.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facultyMember.initials?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesDepartment = !departmentFilter || facultyMember.department === departmentFilter
    
    return matchesSearch && matchesDepartment
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6 font-ubuntu">
      {/* Header - Centered */}
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-700">Faculty Management</h1>
        <p className="text-gray-600 mt-2">Manage faculty members and their academic credentials</p>
      </div>

      {/* Add Faculty Button */}
      <div className="mb-8 flex justify-center">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 rounded-lg bg-primary-800 px-4 py-2 text-white shadow-md transition-all hover:bg-primary-900 hover:scale-105 active:scale-95"
        >
          <Plus size={20} />
          <span>Add Faculty</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search faculty members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-neutral-900 placeholder-gray-400"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-neutral-900"
          >
            <option value="">All Departments</option>
            {DEPARTMENT_OPTIONS.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Faculty Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Initials
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFaculty.map((facultyMember) => (
                  <tr
                    key={facultyMember._id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {facultyMember.title}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                      {facultyMember.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {facultyMember.initials}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-200 text-gray-800">
                        {facultyMember.department}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => openEditModal(facultyMember)}
                          className="text-primary-600 hover:text-primary-800 p-1 rounded"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(facultyMember._id)}
                          className="text-red-600 hover:text-red-800 p-1 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredFaculty.length === 0 && (
              <div className="text-center py-12">
                <Users size={48} className="mx-auto text-gray-300" />
                <h3 className="text-lg font-medium text-neutral-900 mt-2">No faculty members found</h3>
                <p className="text-gray-500 mt-1">
                  {searchTerm || departmentFilter 
                    ? "No faculty members match your search criteria." 
                    : "Start by adding your first faculty member to the system."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-neutral-900">
                {editingFaculty ? 'Edit Faculty' : 'Add New Faculty'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false)
                  resetForm()
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <select
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-neutral-900"
                >
                  <option value="">Select Title</option>
                  {TITLE_OPTIONS.map((title) => (
                    <option key={title} value={title}>{title}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-neutral-900 placeholder-gray-400"
                  placeholder="Enter full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Initials *
                </label>
                <input
                  type="text"
                  required
                  value={formData.initials}
                  onChange={(e) => setFormData({...formData, initials: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-neutral-900 placeholder-gray-400"
                  placeholder="e.g., A.B.C"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department *
                </label>
                <select
                  required
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-neutral-900"
                >
                  <option value="">Select Department</option>
                  {DEPARTMENT_OPTIONS.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    resetForm()
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:ring-2 focus:ring-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md focus:ring-2 focus:ring-primary-600 ${
                    loading ? "bg-primary-700 cursor-not-allowed" : "bg-primary-800 hover:bg-primary-900"
                  }`}
                >
                  {loading ? "Saving..." : editingFaculty ? "Update Faculty" : "Create Faculty"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default FacultyManagement