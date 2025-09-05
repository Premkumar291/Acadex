import { User } from '../models/user.model.js';
import { Faculty } from '../models/faculty.model.js';

/**
 * Hierarchy utility functions for admin visibility and permission management
 */

/**
 * Get all users (admins and faculty) visible to a specific admin
 * @param {string} adminId - The admin's ObjectId
 * @returns {Object} Object containing visible admins and faculty
 */
export const getVisibleUsersForAdmin = async (adminId) => {
    try {
        const admin = await User.findById(adminId);
        if (!admin || admin.role !== 'admin') {
            throw new Error('Invalid admin');
        }

        // Build visibility query based on hierarchy rules
        const visibilityQuery = {
            $or: [
                // Users created by this admin
                { createdBy: adminId },
                // Users in the admin's subtree (sub-admins and their creations)
                { hierarchyPath: new RegExp(`(^|/)${adminId}(/|$)`) },
                // Parent admin (if this admin has a parent)
                ...(admin.parentAdmin ? [{ _id: admin.parentAdmin }] : []),
                // Sibling admins (same parent)
                ...(admin.parentAdmin ? [{ parentAdmin: admin.parentAdmin, _id: { $ne: adminId } }] : [])
            ]
        };

        // Get visible admins
        const visibleAdmins = await User.find({
            ...visibilityQuery,
            role: 'admin'
        }).populate('parentAdmin createdBy', 'name email role adminLevel');

        // Get visible faculty (faculty visibility follows same rules)
        const visibleFaculty = await Faculty.find({
            $or: [
                // Faculty created by this admin
                { createdBy: adminId },
                // Faculty created by admins in this admin's subtree
                { createdBy: { $in: visibleAdmins.map(a => a._id) } }
            ]
        }).populate('createdBy', 'name email role adminLevel');

        return {
            admins: visibleAdmins,
            faculty: visibleFaculty
        };
    } catch (error) {
        throw new Error(`Error getting visible users: ${error.message}`);
    }
};

/**
 * Check if an admin can see a specific user
 * @param {string} adminId - The admin's ObjectId
 * @param {string} targetUserId - The target user's ObjectId
 * @returns {boolean} True if admin can see the user
 */
export const canAdminSeeUser = async (adminId, targetUserId) => {
    try {
        const admin = await User.findById(adminId);
        const targetUser = await User.findById(targetUserId);

        if (!admin || !targetUser || admin.role !== 'admin') {
            return false;
        }

        // Admin can see themselves
        if (adminId === targetUserId) {
            return true;
        }

        // Can see users they created
        if (targetUser.createdBy && targetUser.createdBy.equals(adminId)) {
            return true;
        }

        // Can see their parent admin
        if (admin.parentAdmin && admin.parentAdmin.equals(targetUserId)) {
            return true;
        }

        // Can see sibling admins (same parent)
        if (admin.parentAdmin && targetUser.parentAdmin && 
            admin.parentAdmin.equals(targetUser.parentAdmin)) {
            return true;
        }

        // Can see users in their subtree
        if (targetUser.hierarchyPath.includes(adminId)) {
            return true;
        }

        return false;
    } catch (error) {
        return false;
    }
};

/**
 * Check if an admin can see a specific faculty member
 * @param {string} adminId - The admin's ObjectId
 * @param {string} facultyId - The faculty's ObjectId
 * @returns {boolean} True if admin can see the faculty
 */
export const canAdminSeeFaculty = async (adminId, facultyId) => {
    try {
        const admin = await User.findById(adminId);
        const faculty = await Faculty.findById(facultyId).populate('createdBy');

        if (!admin || !faculty || admin.role !== 'admin') {
            return false;
        }

        // Can see faculty they created
        if (faculty.createdBy && faculty.createdBy._id.equals(adminId)) {
            return true;
        }

        // Can see faculty created by users they can see
        if (faculty.createdBy) {
            return await canAdminSeeUser(adminId, faculty.createdBy._id.toString());
        }

        return false;
    } catch (error) {
        return false;
    }
};

/**
 * Check if an admin can create a sub-admin
 * @param {string} adminId - The admin's ObjectId
 * @returns {Object} Object with canCreate boolean and reason
 */
export const canCreateSubAdmin = async (adminId) => {
    try {
        const admin = await User.findById(adminId);
        
        if (!admin || admin.role !== 'admin') {
            return { canCreate: false, reason: 'Invalid admin' };
        }

        // Check admin level (max 3 levels deep: 0, 1, 2, 3)
        if (admin.adminLevel >= 3) {
            return { canCreate: false, reason: 'Maximum hierarchy depth reached' };
        }

        // Check sub-admin count (max 3 per admin)
        const subAdminCount = await User.countDocuments({
            parentAdmin: adminId,
            role: 'admin'
        });

        if (subAdminCount >= 3) {
            return { canCreate: false, reason: 'Maximum sub-admin limit reached (3)' };
        }

        return { canCreate: true, reason: 'Can create sub-admin' };
    } catch (error) {
        return { canCreate: false, reason: `Error: ${error.message}` };
    }
};

/**
 * Get hierarchy tree for an admin
 * @param {string} adminId - The admin's ObjectId
 * @returns {Object} Hierarchical tree structure
 */
export const getHierarchyTree = async (adminId) => {
    try {
        const admin = await User.findById(adminId).populate('parentAdmin');
        if (!admin || admin.role !== 'admin') {
            throw new Error('Invalid admin');
        }

        // Get all visible users
        const { admins, faculty } = await getVisibleUsersForAdmin(adminId);

        // Build tree structure
        const buildTree = (users, parentId = null) => {
            return users
                .filter(user => {
                    if (parentId === null) {
                        return !user.parentAdmin || user.parentAdmin.equals(adminId);
                    }
                    return user.parentAdmin && user.parentAdmin.equals(parentId);
                })
                .map(user => ({
                    ...user.toObject(),
                    children: buildTree(users, user._id),
                    faculty: faculty.filter(f => f.createdBy && f.createdBy._id.equals(user._id))
                }));
        };

        // Start from the current admin or their root
        let rootAdmins = [];
        if (admin.adminLevel === 0) {
            // This is a root admin, start from them
            rootAdmins = [admin];
        } else {
            // Find the root admin in their hierarchy
            const rootAdmin = admins.find(a => a.adminLevel === 0 && 
                admin.hierarchyPath.startsWith(a._id.toString()));
            if (rootAdmin) {
                rootAdmins = [rootAdmin];
            }
        }

        const tree = buildTree([...rootAdmins, ...admins]);
        
        return {
            tree,
            currentAdmin: admin,
            totalAdmins: admins.length + 1, // +1 for current admin
            totalFaculty: faculty.length
        };
    } catch (error) {
        throw new Error(`Error building hierarchy tree: ${error.message}`);
    }
};

/**
 * Get admin statistics
 * @param {string} adminId - The admin's ObjectId
 * @returns {Object} Statistics about the admin's hierarchy
 */
export const getAdminStats = async (adminId) => {
    try {
        const admin = await User.findById(adminId);
        if (!admin || admin.role !== 'admin') {
            throw new Error('Invalid admin');
        }

        const { admins, faculty } = await getVisibleUsersForAdmin(adminId);

        // Count direct sub-admins
        const directSubAdmins = await User.countDocuments({
            parentAdmin: adminId,
            role: 'admin'
        });

        // Count direct faculty created
        const directFaculty = await Faculty.countDocuments({
            createdBy: adminId
        });

        // Count total in subtree
        const subtreeAdmins = admins.filter(a => 
            a.hierarchyPath.includes(adminId) || a.createdBy?.equals(adminId)
        ).length;

        return {
            adminLevel: admin.adminLevel,
            directSubAdmins,
            maxSubAdmins: 3,
            canCreateMoreSubAdmins: directSubAdmins < 3 && admin.adminLevel < 3,
            directFaculty,
            totalVisibleAdmins: admins.length,
            totalVisibleFaculty: faculty.length,
            subtreeAdmins,
            hierarchyDepth: admin.adminLevel
        };
    } catch (error) {
        throw new Error(`Error getting admin stats: ${error.message}`);
    }
};
