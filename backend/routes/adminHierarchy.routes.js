import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { verifyHierarchyAdmin, canCreateAdmin, canSeeUser } from '../middleware/hierarchyAuth.js';
import {
    createAdmin,
    createFacultyUser,
    getAdminInfo,
    getCreatedUsers,
    getAdminStatistics,
    updateAdmin,
    deleteAdmin,
    deleteFacultyUser,
    getAdminCreationStatus
} from '../controller/Admin/adminHierarchy.controller.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(verifyToken);
router.use(verifyHierarchyAdmin);

// Get admin info and their created users
router.get('/info', getAdminInfo);

// Get users created by current admin
router.get('/created-users', getCreatedUsers);

// Get admin statistics
router.get('/statistics', getAdminStatistics);

// Get admin creation status
router.get('/creation-status', getAdminCreationStatus);

// Create admin (with permission check)
router.post('/admin', canCreateAdmin, createAdmin);

// Create faculty user (admins can always create faculty)
router.post('/faculty', createFacultyUser);

// Update admin (with visibility check)
router.put('/admin/:id', canSeeUser, updateAdmin);

// Delete admin (with visibility check)
router.delete('/admin/:id', canSeeUser, deleteAdmin);

// Delete faculty user (with visibility check)
router.delete('/faculty/:id', canSeeUser, deleteFacultyUser);

export default router;