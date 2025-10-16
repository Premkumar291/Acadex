import React, { useState, useEffect } from 'react';
import { User, AlertCircle, Loader } from 'lucide-react';
import { facultyAPI } from '../../../api/faculty';
import { getCurrentUserCollegeName } from '../../../utils/userUtils';

const ClassAdvisorDropdown = ({ value, onChange, error, department }) => {
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  // Fetch faculty members when department changes
  useEffect(() => {
    const fetchFaculty = async () => {
      if (!department) return;
      
      setLoading(true);
      setFetchError(null);
      
      try {
        // Get current user's college name (for future use or debugging)
        await getCurrentUserCollegeName();
        
        // Fetch faculty by department (backend will automatically filter by college)
        const response = await facultyAPI.getFacultyByDepartment(department);
        
        if (response.success && response.data) {
          setFacultyList(response.data);
        } else {
          setFacultyList([]);
        }
      } catch (err) {
        console.error('Error fetching faculty:', err);
        setFetchError('Failed to fetch faculty members');
        setFacultyList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFaculty();
  }, [department]);

  const handleChange = (e) => {
    onChange('classAdvisorName', e.target.value);
  };

  if (loading) {
    return (
      <div className="relative">
        <div className="flex items-center">
          <Loader className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
          <select
            disabled
            className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
          >
            <option>Loading faculty...</option>
          </select>
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="relative">
        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <select
          value={value || ''}
          onChange={handleChange}
          className={`w-full pl-10 pr-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            error ? 'border-red-300' : 'border-gray-300'
          }`}
        >
          <option value="">Select class advisor...</option>
          {facultyList.map((faculty) => (
            <option key={faculty._id} value={faculty.name}>
              {faculty.name}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </p>
      )}
      {fetchError && (
        <p className="mt-1 text-sm text-yellow-600 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {fetchError}
        </p>
      )}
    </div>
  );
};

export default ClassAdvisorDropdown;