import React, { useState, useEffect } from 'react';
import { Book, AlertCircle, CheckCircle, Loader, Minus } from 'lucide-react';
import { subjectAPI } from '../../../api/subjects';

const EnhancedSubjectNameInput = ({ subjectCode, value, onChange, error, department }) => {
  const [isFetching, setIsFetching] = useState(false);
  const [dbSubjectName, setDbSubjectName] = useState(null);
  const [showInput, setShowInput] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  // Fetch subject name from database when component mounts or subjectCode changes
  useEffect(() => {
    const fetchSubjectName = async () => {
      if (!subjectCode) return;
      
      // If we already have a value that's not the subject code itself, don't override it
      if (value && value !== subjectCode && value !== '--') {
        // Check if this value matches a database subject
        setIsFetching(true);
        setFetchError(null);
        
        try {
          // Try to find the subject by code to see if the current value is the correct name
          let exactMatch = null;
          
          try {
            const departmentResponse = await subjectAPI.getSubjectsByDepartment(department);
            
            if (departmentResponse.success && departmentResponse.data && departmentResponse.data.length > 0) {
              exactMatch = departmentResponse.data.find(subject => 
                subject.subjectCode === subjectCode
              );
            }
          } catch (deptError) {
            console.warn('Department-specific search failed:', deptError);
          }
          
          // If no match found in department, try global search as fallback
          if (!exactMatch) {
            try {
              const globalResponse = await subjectAPI.getSubjects({
                search: subjectCode
              });
              
              if (globalResponse.success && globalResponse.data && globalResponse.data.length > 0) {
                exactMatch = globalResponse.data.find(subject => 
                  subject.subjectCode === subjectCode
                );
              }
            } catch (globalError) {
              console.warn('Global search failed:', globalError);
            }
          }
          
          if (exactMatch) {
            setDbSubjectName(exactMatch.subjectName);
            // If the current value matches the database name, show readonly
            if (value === exactMatch.subjectName) {
              setShowInput(false);
            } else {
              // Otherwise, show input but with database name as default option
              setShowInput(true);
            }
          } else {
            // No database match, show input field
            setDbSubjectName(null);
            setShowInput(true);
          }
        } catch (err) {
          console.error('Error checking subject name:', err);
          setFetchError('Failed to verify subject name');
          setDbSubjectName(null);
          setShowInput(true);
        } finally {
          setIsFetching(false);
        }
        
        return;
      }
      
      // If no value or value is the subject code, try to fetch the correct name
      setIsFetching(true);
      setFetchError(null);
      
      try {
        // Try to find the subject by code in the specified department
        let exactMatch = null;
        
        try {
          const departmentResponse = await subjectAPI.getSubjectsByDepartment(department);
          
          if (departmentResponse.success && departmentResponse.data && departmentResponse.data.length > 0) {
            exactMatch = departmentResponse.data.find(subject => 
              subject.subjectCode === subjectCode
            );
          }
        } catch (deptError) {
          console.warn('Department-specific search failed:', deptError);
        }
        
        // If no match found in department, try global search as fallback
        if (!exactMatch) {
          try {
            const globalResponse = await subjectAPI.getSubjects({
              search: subjectCode
            });
            
            if (globalResponse.success && globalResponse.data && globalResponse.data.length > 0) {
              exactMatch = globalResponse.data.find(subject => 
                subject.subjectCode === subjectCode
              );
            }
          } catch (globalError) {
            console.warn('Global search failed:', globalError);
          }
        }
        
        if (exactMatch) {
          setDbSubjectName(exactMatch.subjectName);
          onChange(subjectCode, exactMatch.subjectName);
          setShowInput(false);
        } else {
          // If no match found in database, use dash icon as default value
          setDbSubjectName(null);
          onChange(subjectCode, '--'); // Set default value to dash icon
          setShowInput(false); // Hide input field and show readonly display
        }
      } catch (err) {
        console.error('Error fetching subject name:', err);
        setFetchError('Failed to fetch subject name');
        setDbSubjectName(null);
        // Even on error, use dash icon as default value
        onChange(subjectCode, '--');
        setShowInput(false); // Hide input field and show readonly display
      } finally {
        setIsFetching(false);
      }
    };

    fetchSubjectName();
  }, [subjectCode, department, onChange, value]);

  const handleInputChange = (e) => {
    onChange(subjectCode, e.target.value);
  };

  // If we have a database subject name and it matches the current value, show a readonly field
  const shouldShowReadOnly = !showInput;

  if (isFetching) {
    return (
      <div className="relative">
        <div className="flex items-center">
          <Loader className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
          <input
            type="text"
            value={value || subjectCode || ''}
            onChange={handleInputChange}
            placeholder="Fetching subject name..."
            className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled
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
  }

  if (shouldShowReadOnly) {
    // Show readonly display with either database name or dash icon
    const displayValue = dbSubjectName || value || '--';
    
    return (
      <div className="relative">
        <div className="flex items-center">
          {dbSubjectName ? (
            <Book className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
          ) : (
            <Minus className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          )}
          <div className="w-full pl-10 pr-3 py-2 text-sm border rounded bg-gray-50 text-gray-800">
            {displayValue}
          </div>
          {dbSubjectName && (
            <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
          )}
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
  }

  return (
    <div>
      <div className="relative">
        <div className="flex items-center">
          <Book className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={value || subjectCode || ''}
            onChange={handleInputChange}
            placeholder={dbSubjectName ? `Enter custom name (default: ${dbSubjectName})` : "Enter subject name..."}
            className={`w-full pl-10 pr-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              error ? 'border-red-300' : 'border-gray-300'
            }`}
          />
        </div>
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

export default EnhancedSubjectNameInput;