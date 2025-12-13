import { canAdminSeeUser, canAdminSeeFaculty } from '../utils/hierarchyUtils.js';
import { User } from '../models/user.model.js';

/**
 * Middleware to check hierarchical admin permissions
 */

/**
 * Middleware to verify admin can perform hierarchical operations
 */
export const verifyHierarchyAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Authentication required"
        });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: "Admin access required"
        });
    }

    next();
};

/**
 * Middleware to check if admin can see specific user
 */
export const canSeeUser = async (req, res, next) => {
    try {
        const adminId = req.userId || req.user?.userId || req.user?._id;
        const targetUserId = req.params.id || req.params.userId;

        if (!targetUserId) {
            return res.status(400).json({
                success: false,
                message: "Target user ID required"
            });
        }

        const canSee = await canAdminSeeUser(adminId, targetUserId);
        
        if (!canSee) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to access this user"
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error checking user permissions",
            error: error.message
        });
    }
};

/**
 * Middleware to check if admin can see specific faculty
 */
export const canSeeFaculty = async (req, res, next) => {
    try {
        const adminId = req.userId || req.user?.userId || req.user?._id;
        const facultyId = req.params.id || req.params.facultyId;

        if (!facultyId) {
            return res.status(400).json({
                success: false,
                message: "Faculty ID required"
            });
        }

        const canSee = await canAdminSeeFaculty(adminId, facultyId);
        
        if (!canSee) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to access this faculty member"
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error checking faculty permissions",
            error: error.message
        });
    }
};

/**
 * Middleware to check if admin can create another admin
 */
export const canCreateAdmin = async (req, res, next) => {
    try {
        const adminId = req.userId || req.user?.userId || req.user?._id;
        const admin = await User.findById(adminId);

        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Admin access required"
            });
        }

        // All admins can create other admins (no restrictions)
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error checking admin creation permissions",
            error: error.message
        });
    }
};

/**
 * Middleware to filter results based on creator visibility
 */
export const filterByCreator = (model) => {
    return async (req, res, next) => {
        try {
            const adminId = req.userId || req.user?.userId || req.user?._id;
            
            // Add creator filter to the request
            req.creatorFilter = {
                adminId,
                model
            };
            
            next();
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error setting up creator filter",
                error: error.message
            });
        }
    };
};
