import express from 'express';
import { verifyToken, verifyAdmin } from '../middleware/verifyToken.js';
import {
    createSubject,
    getSubjects,
    getSubjectById,
    updateSubject,
    deleteSubject,
    getSubjectsByDepartment
} from '../controller/Admin/subject.controller.js';

const router = express.Router();

// Public routes (no authentication required) - subjects are globally visible
router.get('/', getSubjects);                              // Get all subjects with filters
router.get('/:id', getSubjectById);                        // Get subject by ID
router.get('/department/:department', getSubjectsByDepartment); // Get subjects by department

// Admin-only routes require authentication and admin privileges
router.use(verifyToken, verifyAdmin);
router.post('/', createSubject);                           // Create new subject
router.put('/:id', updateSubject);                         // Update subject
router.delete('/:id', deleteSubject);                      // Delete subject (soft delete)

export default router;
