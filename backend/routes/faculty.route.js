import express from 'express';
import { verifyToken, verifyAdmin } from '../middleware/verifyToken.js';
import { canSeeFaculty } from '../middleware/hierarchyAuth.js';
import {
    createFaculty,
    getFaculty,
    getFacultyById,
    updateFaculty,
    deleteFaculty,
    getFacultyByDepartment,
    addStudyToFaculty,
    removeStudyFromFaculty
} from '../controller/Admin/faculty.controller.js';

const router = express.Router();

// All routes require authentication and admin privileges
router.use(verifyToken, verifyAdmin);

// Faculty CRUD operations
router.post('/', createFaculty);                           // Create new faculty
router.get('/', getFaculty);                               // Get faculty created by this admin only
router.get('/:id', canSeeFaculty, getFacultyById);         // Get faculty by ID (with permission check)
router.put('/:id', canSeeFaculty, updateFaculty);          // Update faculty (with permission check)
router.delete('/:id', canSeeFaculty, deleteFaculty);       // Delete faculty (with permission check)

// Department-specific routes
router.get('/department/:department', getFacultyByDepartment); // Get faculty by department (filtered by creator)

// Studies management within faculty
router.post('/:id/studies', canSeeFaculty, addStudyToFaculty);            // Add study to faculty
router.delete('/:id/studies/:studyId', canSeeFaculty, removeStudyFromFaculty); // Remove study from faculty

export default router;
