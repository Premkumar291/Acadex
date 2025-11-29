import React, { useState, useEffect } from "react"
import { Search, Plus, Edit2, Trash2, X, Filter } from "lucide-react"
import toast from "react-hot-toast"
import { subjectAPI } from "../../../api/subjects.js"
import { DEPARTMENT_OPTIONS } from "../../../config/subjects.config.js"

const SEMESTER_OPTIONS = ["1", "2", "3", "4", "5", "6", "7", "8"]
const SUBJECT_TYPE_OPTIONS = ["Theory", "Practical", "Inbuilt","Project"]


// Validate subject code format
const isValidSubjectCode = (code) => {
  // Allow any non-empty string as a valid subject code
  return code && code.trim().length > 0;
}

const SubjectManagement = () => {
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("")
  const [semesterFilter, setSemesterFilter] = useState("") // Add semester filter state
  const [showModal, setShowModal] = useState(false)
  const [editingSubject, setEditingSubject] = useState(null)
  const [formData, setFormData] = useState({
    subjectName: "",
    subjectCode: "",
    departments: [],
    semester: "",
    credits: "",
    subjectType: ""
  })

  useEffect(() => {
    fetchSubjects()
  }, [])

  const fetchSubjects = async () => {
    try {
      setLoading(true)
      const response = await subjectAPI.getSubjects()
      setSubjects(response.data || [])
    } catch {
      toast.error("Failed to fetch subjects. Please check your connection and try again.")
      setSubjects([])
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (subject) => {
    setFormData({
      subjectName: subject.subjectName,
      subjectCode: subject.subjectCode,
      departments: (subject.departments || [subject.department]).map(dept => dept.toUpperCase()), // Ensure uppercase
      semester: subject.semester,
      credits: subject.credits.toString(),
      subjectType: subject.subjectType
    })
    setEditingSubject(subject)
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate departments selection
    if (formData.departments.length === 0) {
      toast.error("Please select at least one department")
      return
    }
    
    try {
      // Prepare subject data
      const subjectData = {
        subjectName: formData.subjectName,
        subjectCode: formData.subjectCode,
        departments: formData.departments,
        semester: formData.semester,
        credits: Number.parseInt(formData.credits),
        subjectType: formData.subjectType
      }

      if (editingSubject) {
        await subjectAPI.updateSubject(editingSubject._id, subjectData)
        toast.success("Subject updated successfully!")
      } else {
        await subjectAPI.createSubject(subjectData)
        toast.success("Subject created successfully!")
      }

      resetForm()
      fetchSubjects()
    } catch (error) {
      // Show specific error message from backend
      const errorMessage = error.response?.data?.message || error.message || `Failed to ${editingSubject ? "update" : "create"} subject`
      toast.error(errorMessage)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      try {
        const response = await subjectAPI.deleteSubject(id);
        toast.success(response.message || "Subject deleted successfully!");
        fetchSubjects();
      } catch (error) {
        toast.error(error.message || "Failed to delete subject");
      }
    }
  }

  const resetForm = () => {
    setFormData({
      subjectName: "",
      subjectCode: "",
      departments: [],
      semester: "",
      credits: "",
      subjectType: ""
    })
    setEditingSubject(null)
    setShowModal(false)
  }

  const filteredSubjects = subjects.filter((subject) => {
    const matchesSearch =
      subject.subjectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.subjectCode?.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Handle both new multi-department structure and legacy single department
    const subjectDepartments = subject.departments || [subject.department]
    const matchesDepartment = !departmentFilter || subjectDepartments.includes(departmentFilter)
    
    // Add semester filter
    const matchesSemester = !semesterFilter || subject.semester?.toString() === semesterFilter
    
    return matchesSearch && matchesDepartment && matchesSemester
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6 font-ubuntu">
      {/* Header - Centered */}
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-700">Subject Management</h1>
        <p className="text-gray-600 mt-2">Manage academic subjects and their details</p>
      </div>

      {/* Add Subject Button */}
      <div className="mb-8 flex justify-center">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 rounded-lg bg-amber-800 px-4 py-2 text-white shadow-md transition-all hover:bg-amber-900 hover:scale-105 active:scale-95"
        >
          <Plus size={20} />
          <span>Add Subject</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-neutral-900"
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
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <select
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-neutral-900"
          >
            <option value="">All Semesters</option>
            {SEMESTER_OPTIONS.map((sem) => (
              <option key={sem} value={sem}>Semester {sem}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Subjects Table */}
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
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Semester
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Credits
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSubjects.map((subject) => (
                  <tr
                    key={subject._id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-neutral-900">{subject.subjectName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      {subject.subjectCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      <div className="flex flex-wrap gap-1">
                        {(subject.departments || [subject.department]).map((dept) => (
                          <span 
                            key={dept} 
                            className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-200 text-gray-800"
                          >
                            {dept}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      {subject.semester}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      {subject.credits}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        subject.subjectType === 'Theory' ? 'bg-blue-100 text-blue-800' :
                        subject.subjectType === 'Practical' ? 'bg-green-100 text-green-800' :
                        subject.subjectType === 'Inbuilt' ? 'bg-yellow-100 text-yellow-800' :
                        subject.subjectType === 'Project' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {subject.subjectType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(subject)}
                          className="text-amber-600 hover:text-amber-800 p-1 rounded"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(subject._id)}
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
            {filteredSubjects.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No subjects found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div
            className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-neutral-900">
                {editingSubject ? 'Edit Subject' : 'Add New Subject'}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-neutral-900"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.subjectName}
                  onChange={(e) => setFormData({...formData, subjectName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-neutral-900 placeholder-gray-400"
                  placeholder="Enter subject name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.subjectCode}
                    onChange={(e) => setFormData({...formData, subjectCode: e.target.value.toUpperCase()})}
                    className={`w-full px-3 py-2 pr-10 border rounded-md focus:ring-2 focus:border-transparent uppercase font-mono tracking-wider placeholder-gray-400 ${
                      formData.subjectCode && !isValidSubjectCode(formData.subjectCode)
                        ? 'border-red-500 focus:ring-red-500 bg-white text-neutral-900'
                        : formData.subjectCode && isValidSubjectCode(formData.subjectCode)
                        ? 'border-green-500 focus:ring-green-500 bg-white text-neutral-900'
                        : 'border-gray-300 focus:ring-blue-500 bg-white text-neutral-900'
                    }`}
                    placeholder="Enter subject code"
                  />
                  {formData.subjectCode && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      {isValidSubjectCode(formData.subjectCode) ? (
                        <span className="text-green-600 text-sm">✓</span>
                      ) : (
                        <span className="text-red-600 text-sm">✗</span>
                      )}
                    </div>
                  )}
                </div>
                <p className={`mt-1 text-xs ${
                  formData.subjectCode && !isValidSubjectCode(formData.subjectCode)
                    ? 'text-red-600'
                    : 'text-gray-500'
                }`}>
                  Subject code (automatically converted to uppercase)
                </p>
              </div>
              
              {/* Multiple Departments Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Departments <span className="text-red-600">*</span>
                </label>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2 bg-gray-50">
                    {DEPARTMENT_OPTIONS.map((dept) => (
                      <label key={dept} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.departments.includes(dept)}
                          onChange={(e) => {
                            const upperDept = dept.toUpperCase();
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                departments: [...formData.departments, upperDept]
                              })
                            } else {
                              const newDepartments = formData.departments.filter(d => d !== upperDept)
                              setFormData({
                                ...formData,
                                departments: newDepartments
                              })
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-white"
                        />
                        <span className="text-sm text-neutral-900">{dept}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">
                    Select one or more departments that can access this subject
                  </p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Semester
                </label>
                <select
                  required
                  value={formData.semester}
                  onChange={(e) => setFormData({...formData, semester: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-neutral-900"
                >
                  <option value="">Select Semester</option>
                  {SEMESTER_OPTIONS.map((sem) => (
                    <option key={sem} value={sem}>{sem}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Credits
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="10"
                  value={formData.credits}
                  onChange={(e) => setFormData({...formData, credits: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-neutral-900 placeholder-gray-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject Type
                </label>
                <select
                  required
                  value={formData.subjectType}
                  onChange={(e) => setFormData({...formData, subjectType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-neutral-900"
                >
                  <option value="">Select Type</option>
                  {SUBJECT_TYPE_OPTIONS.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-amber-800 border border-transparent rounded-md hover:bg-amber-900 focus:ring-2 focus:ring-amber-600"
                >
                  {editingSubject ? 'Update' : 'Create'} Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default SubjectManagement