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

// Routes that require admin privileges
router.use(verifyToken, verifyAdmin);

// Faculty CRUD operations (admin only)
router.post('/', createFaculty);                           // Create new faculty
router.put('/:id', updateFaculty);                         // Update faculty
router.delete('/:id', deleteFaculty);                      // Delete faculty

// Routes that allow both admin and faculty users
router.get('/', verifyToken, verifyAdminOrFaculty, getFaculty);                               // Get all active faculty
router.get('/:id', verifyToken, verifyAdminOrFaculty, getFacultyById);                        // Get faculty by ID
router.get('/department/:department', verifyToken, verifyAdminOrFaculty, getFacultyByDepartment); // Get faculty by department

export default router;