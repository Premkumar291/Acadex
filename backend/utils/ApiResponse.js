/**
 * Utility class for standardizing API responses
 */
class ApiResponse {
    /**
     * Create a standardized API response
     * @param {number} statusCode - HTTP status code
     * @param {any} data - Response data
     * @param {string} message - Response message
     * @param {Object} [meta] - Additional metadata for pagination, etc.
     */
    constructor(statusCode, data = null, message = 'Success', meta = {}) {
        this.success = statusCode >= 200 && statusCode < 300;
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        
        // Only include meta if it has properties
        if (Object.keys(meta).length > 0) {
            this.meta = meta;
        }
    }

    /**
     * Send the response
     * @param {Object} res - Express response object
     * @returns {Object} The response object
     */
    send(res) {
        return res.status(this.statusCode).json(this.toJSON());
    }

    /**
     * Convert the response to a plain object
     * @returns {Object} The response as a plain object
     */
    toJSON() {
        const response = {
            success: this.success,
            statusCode: this.statusCode,
            message: this.message,
            data: this.data
        };

        if (this.meta) {
            response.meta = this.meta;
        }

        return response;
    }

    /**
     * Create a success response
     * @param {Object} res - Express response object
     * @param {any} data - Response data
     * @param {string} message - Success message
     * @param {Object} meta - Additional metadata
     * @returns {Object} The response object
     */
    static success(res, data = null, message = 'Success', meta = {}) {
        const response = new ApiResponse(200, data, message, meta);
        return response.send(res);
    }

    /**
     * Create a created response
     * @param {Object} res - Express response object
     * @param {any} data - Response data
     * @param {string} message - Success message
     * @returns {Object} The response object
     */
    static created(res, data = null, message = 'Resource created successfully') {
        const response = new ApiResponse(201, data, message);
        return response.send(res);
    }

    /**
     * Create a no content response
     * @param {Object} res - Express response object
     * @returns {Object} The response object
     */
    static noContent(res) {
        return res.status(204).end();
    }

    /**
     * Create a paginated response
     * @param {Object} res - Express response object
     * @param {Array} items - Array of items
     * @param {number} total - Total number of items
     * @param {number} page - Current page
     * @param {number} limit - Items per page
     * @param {string} message - Success message
     * @returns {Object} The response object
     */
    static paginated(res, items, total, page, limit, message = 'Success') {
        const totalPages = Math.ceil(total / limit);
        const meta = {
            pagination: {
                total,
                totalPages,
                page: parseInt(page, 10),
                limit: parseInt(limit, 10),
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1
            }
        };

        const response = new ApiResponse(200, items, message, meta);
        return response.send(res);
    }
}

export { ApiResponse };
