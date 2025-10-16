import React from 'react';
import { User, AlertCircle } from 'lucide-react';
import FacultyDropdown from './FacultyDropdown';

const FacultyNameInput = ({ subjectCode, value, onChange, error, department }) => {
  // If department is provided, use the dropdown component
  if (department) {
    return (
      <FacultyDropdown
        subjectCode={subjectCode}
        value={value}
        onChange={onChange}
        error={error}
        department={department}
      />
    );
  }

  // Fallback to text input if no department is provided
  return (
    <div>
      <div className="relative">
        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(subjectCode, e.target.value)}
          placeholder="Enter faculty name..."
          className={`w-full pl-10 pr-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            error ? 'border-red-300' : 'border-gray-300'
          }`}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};

export default FacultyNameInput;