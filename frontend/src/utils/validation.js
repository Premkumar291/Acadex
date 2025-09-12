/**
 * Validation utilities for form inputs
 */

export const validators = {
  required: (value) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return 'This field is required';
    }
    return '';
  },

  email: (value) => {
    if (!value) return '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    return '';
  },

  minLength: (min) => (value) => {
    if (!value) return '';
    if (value.length < min) {
      return `Must be at least ${min} characters long`;
    }
    return '';
  },

  maxLength: (max) => (value) => {
    if (!value) return '';
    if (value.length > max) {
      return `Must be no more than ${max} characters long`;
    }
    return '';
  },

  password: (value) => {
    if (!value) return '';
    if (value.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/(?=.*[a-z])/.test(value)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(value)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(value)) {
      return 'Password must contain at least one number';
    }
    return '';
  },

  numeric: (value) => {
    if (!value) return '';
    if (isNaN(value)) {
      return 'Must be a valid number';
    }
    return '';
  },

  positiveNumber: (value) => {
    if (!value) return '';
    const num = Number(value);
    if (isNaN(num) || num <= 0) {
      return 'Must be a positive number';
    }
    return '';
  },

  phone: (value) => {
    if (!value) return '';
    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(value.replace(/\s/g, ''))) {
      return 'Please enter a valid phone number';
    }
    return '';
  }
};

/**
 * Combine multiple validators
 */
export const combineValidators = (...validators) => (value) => {
  for (const validator of validators) {
    const error = validator(value);
    if (error) return error;
  }
  return '';
};

/**
 * Common validation schemas
 */
export const validationSchemas = {
  login: {
    email: combineValidators(validators.required, validators.email),
    password: validators.required
  },

  signup: {
    name: combineValidators(validators.required, validators.minLength(2)),
    email: combineValidators(validators.required, validators.email),
    password: combineValidators(validators.required, validators.password),
    department: validators.required
  },

  subject: {
    subjectName: combineValidators(validators.required, validators.minLength(2)),
    subjectCode: combineValidators(validators.required, validators.minLength(2)),
    department: validators.required,
    semester: validators.required,
    credits: combineValidators(validators.required, validators.positiveNumber),
    subjectType: validators.required
  },

  faculty: {
    name: combineValidators(validators.required, validators.minLength(2)),
    email: combineValidators(validators.required, validators.email),
    department: validators.required,
    phone: validators.phone,
    employeeId: validators.required
  }
};
