import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { X, User, Search, Check, BookOpen, Users, AlertCircle } from 'lucide-react';
import { facultyAPI } from '../../../api/faculty';

const FacultyAssignmentModal = ({ 
  isOpen, 
  onClose, 
  subjectCodes = [], 
  currentAssignments = {}, 
  onSave,
  department
}) => {
  const [assignments, setAssignments] = useState(currentAssignments);
  const [availableFaculty, setAvailableFaculty] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Fetch available faculty when modal opens
  useEffect(() => {
    const fetchFaculty = async () => {
      setLoading(true);
      try {
        const response = await facultyAPI.getFacultyByDepartment(department);
        setAvailableFaculty(response.data || []);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Error fetching faculty:', error);
        }
        setAvailableFaculty([]);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && department) {
      fetchFaculty();
    }
  }, [isOpen, department]);

  const handleAssignmentChange = (subjectCode, facultyData) => {
    setAssignments(prev => ({
      ...prev,
      [subjectCode]: facultyData
    }));
    
    // Clear any existing error for this subject
    if (errors[subjectCode]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[subjectCode];
        return newErrors;
      });
    }
  };

  const handleManualEntry = (subjectCode, facultyName) => {
    if (facultyName.trim()) {
      setAssignments(prev => ({
        ...prev,
        [subjectCode]: {
          name: facultyName.trim(),
          displayName: facultyName.trim(),
          isManual: true
        }
      }));
    } else {
      setAssignments(prev => {
        const newAssignments = { ...prev };
        delete newAssignments[subjectCode];
        return newAssignments;
      });
    }
  };

  const validateAssignments = () => {
    const newErrors = {};
    let hasErrors = false;

    subjectCodes.forEach(subjectCode => {
      if (!assignments[subjectCode] || !assignments[subjectCode].name) {
        newErrors[subjectCode] = 'Faculty assignment is required';
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    return !hasErrors;
  };

  const handleSave = () => {
    if (validateAssignments()) {
      onSave(assignments);
      onClose();
    }
  };

  const filteredFaculty = availableFaculty.filter(faculty =>
    faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faculty.initials.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (faculty.email && faculty.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getAssignmentStats = () => {
    const assigned = Object.keys(assignments).length;
    const total = subjectCodes.length;
    const percentage = total > 0 ? Math.round((assigned / total) * 100) : 0;
    return { assigned, total, percentage };
  };

  const stats = getAssignmentStats();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          className={`w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl overflow-hidden bg-white border border-amber-200`}
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          {/* Header */}
          <div className={`px-6 py-4 border-b border-amber-200`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-amber-100`}>
                  <Users className={`w-5 h-5 text-amber-700`} />
                </div>
                <div>
                  <h2 className={`text-xl font-bold text-amber-950`}>
                    Faculty Assignment
                  </h2>
                  <p className={`text-sm text-amber-700`}>
                    Assign faculty members to subjects for report generation
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors hover:bg-amber-100 text-amber-600`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium text-amber-900`}>
                  Assignment Progress
                </span>
                <span className={`text-sm text-amber-700`}>
                  {stats.assigned}/{stats.total} subjects ({stats.percentage}%)
                </span>
              </div>
              <div className={`w-full h-2 rounded-full bg-amber-100`}>
                <div
                  className="h-2 rounded-full bg-amber-700 transition-all duration-500"
                  style={{ width: `${stats.percentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex h-[calc(90vh-200px)]">
            {/* Faculty List - Left Side */}
            <div className={`w-1/3 p-4 border-r border-amber-200 bg-amber-50`}>
              <div className="space-y-4">
                <div>
                  <h3 className={`text-sm font-medium text-amber-900 mb-2`}>
                    Available Faculty ({department})
                  </h3>
                  
                  {/* Search */}
                  <div className="relative mb-3">
                    <Search className={`absolute left-3 top-3 w-4 h-4 text-amber-600`} />
                    <input
                      type="text"
                      placeholder="Search faculty..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`w-full pl-10 pr-3 py-2 rounded-lg border bg-white border-amber-200 text-amber-950 placeholder-amber-600 focus:ring-2 focus:ring-amber-600 focus:border-transparent`}
                    />
                  </div>
                </div>

                {/* Faculty List */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : filteredFaculty.length > 0 ? (
                    filteredFaculty.map((faculty) => (
                      <div
                        key={faculty._id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all border-amber-300 hover:border-amber-400 bg-white hover:bg-amber-50`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-amber-100`}>
                            <User className={`w-4 h-4 text-amber-700`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className={`font-medium text-sm text-amber-950 truncate`}>
                              {faculty.displayName}
                            </h4>
                            <p className={`text-xs text-amber-700 truncate`}>
                              {faculty.email || `ID: ${faculty.employeeId || 'N/A'}`}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={`text-center py-8 text-amber-600`}>
                      <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No faculty found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Assignment Area - Right Side */}
            <div className="flex-1 p-4 overflow-y-auto bg-white">
              <div className="space-y-4">
                <h3 className={`text-sm font-medium text-amber-900 mb-4`}>
                  Subject Faculty Assignments
                </h3>

                {subjectCodes.map((subjectCode, index) => (
                  <motion.div
                    key={subjectCode}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 rounded-lg border ${
                      errors[subjectCode]
                        ? 'border-red-300 bg-red-50'
                        : assignments[subjectCode]
                        ? 'border-amber-300 bg-amber-50'
                        : 'border-amber-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <BookOpen className={`w-4 h-4 text-amber-700`} />
                        <span className={`font-medium text-amber-950`}>
                          {subjectCode}
                        </span>
                        {assignments[subjectCode] && (
                          <Check className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      {errors[subjectCode] && (
                        <div className="flex items-center space-x-1 text-red-600">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-xs">{errors[subjectCode]}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      {/* Faculty Selection Dropdown */}
                      <div>
                        <label className={`block text-xs font-medium text-amber-900 mb-1`}>
                          Select from available faculty
                        </label>
                        <select
                          value={assignments[subjectCode] && !assignments[subjectCode].isManual ? assignments[subjectCode].name : ''}
                          onChange={(e) => {
                            if (e.target.value) {
                              const selectedFaculty = availableFaculty.find(f => f.name === e.target.value);
                              if (selectedFaculty) {
                                handleAssignmentChange(subjectCode, {
                                  name: selectedFaculty.name,
                                  displayName: selectedFaculty.displayName,
                                  email: selectedFaculty.email,
                                  employeeId: selectedFaculty.employeeId,
                                  _id: selectedFaculty._id,
                                  isManual: false
                                });
                              }
                            }
                          }}
                          className={`w-full p-2 rounded-lg border bg-white border-amber-200 text-amber-950 focus:ring-2 focus:ring-amber-600 focus:border-transparent`}
                        >
                          <option value="">Choose a faculty member...</option>
                          {availableFaculty.map((faculty) => (
                            <option key={faculty._id} value={faculty.name}>
                              {faculty.displayName}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className={`text-center text-xs text-amber-700`}>
                        OR
                      </div>

                      {/* Manual Entry */}
                      <div>
                        <label className={`block text-xs font-medium text-amber-900 mb-1`}>
                          Enter faculty name manually
                        </label>
                        <input
                          type="text"
                          placeholder="Type faculty name..."
                          value={assignments[subjectCode] && assignments[subjectCode].isManual ? assignments[subjectCode].name : ''}
                          onChange={(e) => handleManualEntry(subjectCode, e.target.value)}
                          className={`w-full p-2 rounded-lg border bg-white border-amber-200 text-amber-950 placeholder-amber-600 focus:ring-2 focus:ring-amber-600 focus:border-transparent`}
                        />
                      </div>

                      {/* Current Assignment Display */}
                      {assignments[subjectCode] && (
                        <div className={`mt-2 p-2 rounded-md bg-amber-50 border border-amber-200`}>
                          <div className="flex items-center justify-between">
                            <span className={`text-sm font-medium text-amber-900`}>
                              Assigned: {assignments[subjectCode].displayName || assignments[subjectCode].name}
                            </span>
                            <button
                              onClick={() => {
                                setAssignments(prev => {
                                  const newAssignments = { ...prev };
                                  delete newAssignments[subjectCode];
                                  return newAssignments;
                                });
                              }}
                              className={`text-xs px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200`}
                            >
                              Remove
                            </button>
                          </div>
                          {assignments[subjectCode].isManual && (
                            <p className={`text-xs mt-1 text-amber-700`}>
                              Manually entered
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className={`px-6 py-4 border-t border-amber-200 flex justify-end space-x-3`}>
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all bg-amber-100 hover:bg-amber-200 text-amber-900`}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={stats.assigned === 0}
              className={`px-6 py-2 rounded-lg font-medium text-sm transition-all ${
                stats.assigned > 0
                  ? 'bg-amber-800 hover:bg-amber-900 text-white transform hover:-translate-y-0.5'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Save Assignments ({stats.assigned}/{stats.total})
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FacultyAssignmentModal;
