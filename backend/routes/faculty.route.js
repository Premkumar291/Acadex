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

// All routes require authentication and admin privileges
router.use(verifyToken, verifyAdmin);

// Faculty CRUD operations
router.post('/', createFaculty);                           // Create new faculty
router.get('/', getFaculty);                               // Get all active faculty
router.get('/:id', getFacultyById);                        // Get faculty by ID
router.put('/:id', updateFaculty);                         // Update faculty
router.delete('/:id', deleteFaculty);                      // Delete faculty

// Department-specific routes
router.get('/department/:department', getFacultyByDepartment); // Get faculty by department

export default router;
