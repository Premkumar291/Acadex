/**
 * Custom API error class that extends the built-in Error class
 */
class ApiError extends Error {
    /**
     * Create a new ApiError instance
     * @param {number} statusCode - HTTP status code
     * @param {string} message - Error message
     * @param {boolean} [isOperational=true] - Whether the error is operational or programming error
     * @param {string} [stack=''] - Error stack trace
     */
    constructor(
        statusCode,
        message,
        isOperational = true,
        stack = ''
    ) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default ApiError;
