/**
 * Async handler to wrap around async route handlers
 * @param {Function} fn - The async route handler function
 * @returns {Function} - A middleware function that handles async/await errors
 */
const asyncHandler = (fn) => (req, res, next) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
