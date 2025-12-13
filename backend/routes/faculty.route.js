import express from 'express';
import { verifyToken, verifyAdmin } from '../middleware/verifyToken.js';
import {
    createFaculty,
    getFaculty,
    getFacultyById,
    updateFaculty,
    deleteFaculty,
    getFacultyByDepartment
} from '../controller/Admin/faculty.controller.js';

const router = express.Router();

// Middleware to verify admin or faculty role
const verifyAdminOrFaculty = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'faculty')) {
        next();
    } else {
        return res.status(403).json({ 
            success: false,
            message: "Access denied. Admin or faculty privileges required." 
        });
    }
};

// Routes that allow both admin and faculty users (must come first)
router.get('/', verifyToken, verifyAdminOrFaculty, getFaculty);                               // Get all active faculty
router.get('/department/:department', verifyToken, verifyAdminOrFaculty, getFacultyByDepartment); // Get faculty by department
router.get('/:id', verifyToken, verifyAdminOrFaculty, getFacultyById);                        // Get faculty by ID (must be after specific routes)

// Faculty CRUD operations (admin only)
router.post('/', verifyToken, verifyAdmin, createFaculty);                           // Create new faculty
router.put('/:id', verifyToken, verifyAdmin, updateFaculty);                         // Update faculty
router.delete('/:id', verifyToken, verifyAdmin, deleteFaculty);                      // Delete faculty

export default router;