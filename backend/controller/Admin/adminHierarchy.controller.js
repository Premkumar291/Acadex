import { User } from '../../models/user.model.js';
import { Faculty } from '../../models/faculty.model.js';
import { getVisibleUsersForAdmin, getHierarchyTree, getAdminStats, canCreateSubAdmin } from '../../utils/hierarchyUtils.js';
import bcryptjs from 'bcryptjs';
import { generateTokenAndSetCookie } from '../../utils/generateTokenAndSetCookie.js';

/**
 * Controller for hierarchical admin management
 */

/**
 * Create a sub-admin
 */
export const createSubAdmin = async (req, res) => {
    try {
        const { email, password, name, department } = req.body;
        const creatorId = req.userId || req.user?.userId || req.user?._id;
        
        console.log('CreateSubAdmin - creatorId:', creatorId);
        console.log('CreateSubAdmin - req.userId:', req.userId);
        console.log('CreateSubAdmin - req.user:', req.user);

        // Validate required fields
        if (!email || !password || !name || !department) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Validate creatorId
        if (!creatorId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required - creator ID not found"
            });
        }

        // Validate creatorId is a valid ObjectId
        if (!creatorId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: "Invalid creator ID format"
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User with this email already exists"
            });
        }

        // Get creator admin
        const creator = await User.findById(creatorId);
        if (!creator || creator.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Only admins can create sub-admins"
            });
        }

        // Check if creator can create sub-admin
        const canCreate = await canCreateSubAdmin(creatorId);
        if (!canCreate.canCreate) {
            return res.status(403).json({
                success: false,
                message: canCreate.reason
            });
        }

        // Hash password
        const hashedPassword = await bcryptjs.hash(password, 12);

        // Create sub-admin
        console.log('Creating sub-admin with creatorId:', creatorId, 'type:', typeof creatorId);
        
        const subAdmin = new User({
            email,
            password: hashedPassword,
            name,
            department,
            role: 'admin',
            parentAdmin: creatorId,
            createdBy: creatorId,
            isVerified: true // Sub-admins are auto-verified
        });

        console.log('Sub-admin object before save:', {
            email: subAdmin.email,
            role: subAdmin.role,
            parentAdmin: subAdmin.parentAdmin,
            createdBy: subAdmin.createdBy,
            parentAdminType: typeof subAdmin.parentAdmin
        });

        console.log('About to save sub-admin with parentAdmin:', creatorId);
        await subAdmin.save();
        
        console.log('Sub-admin saved with:', {
            parentAdmin: subAdmin.parentAdmin,
            createdBy: subAdmin.createdBy,
            hierarchyPath: subAdmin.hierarchyPath,
            adminLevel: subAdmin.adminLevel
        });

        // Remove password from response
        const { password: _, ...subAdminData } = subAdmin.toObject();

        res.status(201).json({
            success: true,
            message: "Sub-admin created successfully",
            subAdmin: subAdminData
        });

    } catch (error) {
        console.error("Error creating sub-admin:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

/**
 * Get hierarchy tree for current admin
 */
export const getHierarchy = async (req, res) => {
    try {
        const adminId = req.user.userId;
        
        const hierarchyData = await getHierarchyTree(adminId);
        
        res.status(200).json({
            success: true,
            message: "Hierarchy retrieved successfully",
            data: hierarchyData
        });

    } catch (error) {
        console.error("Error getting hierarchy:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

/**
 * Get visible users for current admin
 */
export const getVisibleUsers = async (req, res) => {
    try {
        const adminId = req.user.userId;
        const { type } = req.query; // 'admins', 'faculty', or 'all'
        
        const visibleUsers = await getVisibleUsersForAdmin(adminId);
        
        let responseData = {};
        
        if (type === 'admins' || !type) {
            responseData.admins = visibleUsers.admins;
        }
        
        if (type === 'faculty' || !type) {
            responseData.faculty = visibleUsers.faculty;
        }
        
        if (!type) {
            responseData = visibleUsers;
        }
        
        res.status(200).json({
            success: true,
            message: "Visible users retrieved successfully",
            data: responseData
        });

    } catch (error) {
        console.error("Error getting visible users:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

/**
 * Get admin statistics
 */
export const getAdminStatistics = async (req, res) => {
    try {
        const adminId = req.user.userId;
        
        const stats = await getAdminStats(adminId);
        
        res.status(200).json({
            success: true,
            message: "Admin statistics retrieved successfully",
            data: stats
        });

    } catch (error) {
        console.error("Error getting admin statistics:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

/**
 * Update sub-admin information
 */
export const updateSubAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, department, email } = req.body;
        const adminId = req.user.userId;

        // Find the sub-admin
        const subAdmin = await User.findById(id);
        if (!subAdmin) {
            return res.status(404).json({
                success: false,
                message: "Sub-admin not found"
            });
        }

        // Check if current admin can modify this sub-admin
        const admin = await User.findById(adminId);
        const canModify = subAdmin.createdBy?.equals(adminId) || 
                         subAdmin.parentAdmin?.equals(adminId) ||
                         (admin.hierarchyPath && subAdmin.hierarchyPath.includes(adminId));

        if (!canModify) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to modify this sub-admin"
            });
        }

        // Update fields
        if (name) subAdmin.name = name;
        if (department) subAdmin.department = department;
        if (email && email !== subAdmin.email) {
            // Check if email is already taken
            const existingUser = await User.findOne({ email, _id: { $ne: id } });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: "Email already in use"
                });
            }
            subAdmin.email = email;
        }

        await subAdmin.save();

        // Remove password from response
        const { password: _, ...subAdminData } = subAdmin.toObject();

        res.status(200).json({
            success: true,
            message: "Sub-admin updated successfully",
            subAdmin: subAdminData
        });

    } catch (error) {
        console.error("Error updating sub-admin:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

/**
 * Delete sub-admin
 */
export const deleteSubAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const adminId = req.user.userId;

        // Find the sub-admin
        const subAdmin = await User.findById(id);
        if (!subAdmin) {
            return res.status(404).json({
                success: false,
                message: "Sub-admin not found"
            });
        }

        // Check if current admin can delete this sub-admin
        const admin = await User.findById(adminId);
        const canDelete = subAdmin.createdBy?.equals(adminId) || 
                         subAdmin.parentAdmin?.equals(adminId);

        if (!canDelete) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to delete this sub-admin"
            });
        }

        // Check if sub-admin has created users
        const createdUsers = await User.countDocuments({ createdBy: id });
        const createdFaculty = await Faculty.countDocuments({ createdBy: id });

        if (createdUsers > 0 || createdFaculty > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete sub-admin who has created ${createdUsers} users and ${createdFaculty} faculty members. Please reassign or delete them first.`
            });
        }

        await User.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Sub-admin deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting sub-admin:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

/**
 * Get sub-admin creation status
 */
export const getSubAdminCreationStatus = async (req, res) => {
    try {
        const adminId = req.user.userId;
        
        const canCreateStatus = await canCreateSubAdmin(adminId);
        const admin = await User.findById(adminId);
        const subAdminCount = await admin.getSubAdminCount();
        
        res.status(200).json({
            success: true,
            message: "Sub-admin creation status retrieved",
            data: {
                canCreate: canCreateStatus.canCreate,
                reason: canCreateStatus.reason,
                currentSubAdmins: subAdminCount,
                maxSubAdmins: 3,
                adminLevel: admin.adminLevel,
                maxLevel: 3
            }
        });

    } catch (error) {
        console.error("Error getting sub-admin creation status:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};
