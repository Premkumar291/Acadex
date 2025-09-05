import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { verifyHierarchyAdmin, canCreateSubAdmin, canSeeUser } from '../middleware/hierarchyAuth.js';
import {
    createSubAdmin,
    getHierarchy,
    getVisibleUsers,
    getAdminStatistics,
    updateSubAdmin,
    deleteSubAdmin,
    getSubAdminCreationStatus
} from '../controller/Admin/adminHierarchy.controller.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(verifyToken);
router.use(verifyHierarchyAdmin);

// Get hierarchy tree for current admin
router.get('/hierarchy', getHierarchy);

// Get visible users (admins and faculty)
router.get('/visible-users', getVisibleUsers);

// Get admin statistics
router.get('/statistics', getAdminStatistics);

// Get sub-admin creation status
router.get('/sub-admin-status', getSubAdminCreationStatus);

// Create sub-admin (with permission check)
router.post('/sub-admin', canCreateSubAdmin, createSubAdmin);

// Update sub-admin (with visibility check)
router.put('/sub-admin/:id', canSeeUser, updateSubAdmin);

// Delete sub-admin (with visibility check)
router.delete('/sub-admin/:id', canSeeUser, deleteSubAdmin);

export default router;
