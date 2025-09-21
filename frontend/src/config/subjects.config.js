// Department configuration for consistent department names across faculty and subjects
// This ensures consistency between faculty departments and subject departments

export const DEPARTMENT_OPTIONS = [
    'CSE',
    'ECE', 
    'EEE',
    'MECH',
    'CIVIL',
    'IT',
    'AUTO',
    'CS & DS',
    'English',
    'Maths',
    'Physics',
    'Chemistry',
    'OTHER'
];

// Get all departments
export const getAllDepartments = () => {
    return DEPARTMENT_OPTIONS;
};

export default DEPARTMENT_OPTIONS;
