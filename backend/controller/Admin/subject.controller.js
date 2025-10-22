import { Subject } from "../../models/subject.model.js";

// Create a new subject
export const createSubject = async (req, res) => {
    try {
        const { subjectCode, subjectName, departments, semester, credits, subjectType } = req.body;
        const userId = req.user?.id || req.user?._id || req.user?.userId;

        // Validate user authentication for protected route
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required to create subjects'
            });
        }

        // Validate required fields
        if (!subjectCode || !subjectName || !departments) {
            return res.status(400).json({
                success: false,
                message: 'Subject code, subject name, and departments are required'
            });
        }

        // Validate departments array
        if (!Array.isArray(departments) || departments.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'At least one department must be selected'
            });
        }

        // Check if subject code already exists
        const existingSubject = await Subject.findOne({ 
            subjectCode: subjectCode.toUpperCase() 
        });

        if (existingSubject) {
            return res.status(400).json({
                success: false,
                message: `Subject code '${subjectCode.toUpperCase()}' already exists. Please use a different subject code.`
            });
        }

        // Create new subject
        const subject = new Subject({
            subjectCode: subjectCode.toUpperCase(),
            subjectName,
            departments: departments.map(dept => dept.toUpperCase()),
            semester,
            credits,
            subjectType: subjectType || 'Theory',
            createdBy: userId
        });

        await subject.save();

        res.status(201).json({
            success: true,
            message: 'Subject created successfully',
            data: subject
        });
    } catch (error) {
        console.error('Error creating subject:', error);
        console.error('Error stack:', error.stack);
        
        // Handle duplicate key error (MongoDB unique constraint)
        if (error.code === 11000 && error.keyPattern?.subjectCode) {
            return res.status(400).json({
                success: false,
                message: `Subject code '${req.body.subjectCode?.toUpperCase()}' already exists. Please use a different subject code.`
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Error creating subject',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get all subjects with pagination and filters
export const getSubjects = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 20, 
            department, 
            semester, 
            search 
        } = req.query;
        
        console.log('Fetching subjects with filters:', { page, limit, department, semester, search });

        let filter = { isActive: true };

        // Add department filter (supports multiple departments)
        if (department) {
            filter.departments = { $in: [department.toUpperCase()] };
        }

        // Add semester filter
        if (semester) {
            filter.semester = parseInt(semester);
        }

        // Add search filter
        if (search) {
            const regex = new RegExp(search, 'i');
            filter.$or = [
                { subjectCode: regex },
                { subjectName: regex }
            ];
        }
        
        console.log('Applied filter:', JSON.stringify(filter, null, 2));

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const subjects = await Subject.find(filter)
            .populate('createdBy', 'name email')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ subjectCode: 1 })
            .lean();
        
        console.log('Found subjects count:', subjects.length);

        const totalSubjects = await Subject.countDocuments(filter);
        const totalPages = Math.ceil(totalSubjects / parseInt(limit));
        
        console.log('Total subjects:', totalSubjects, 'Total pages:', totalPages);

        res.status(200).json({
            success: true,
            data: subjects,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalSubjects,
                hasNext: parseInt(page) < totalPages,
                hasPrev: parseInt(page) > 1
            }
        });
    } catch (error) {
        console.error('Error fetching subjects:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            success: false,
            message: 'Error fetching subjects',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get subject by ID
export const getSubjectById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Fetching subject with ID:', id);

        const subject = await Subject.findOne({ _id: id, isActive: true })
            .populate('createdBy', 'name email')
            .lean();
        
        console.log('Found subject:', subject);

        if (!subject) {
            console.log('Subject not found or inactive');
            return res.status(404).json({
                success: false,
                message: 'Subject not found'
            });
        }

        res.status(200).json({
            success: true,
            data: subject
        });
    } catch (error) {
        console.error('Error fetching subject by ID:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            success: false,
            message: 'Error fetching subject',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Update subject
export const updateSubject = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        console.log('Updating subject with ID:', id);
        console.log('Updates:', JSON.stringify(updates, null, 2));

        // Remove fields that shouldn't be updated directly
        delete updates._id;
        delete updates.createdBy;
        delete updates.createdAt;
        delete updates.updatedAt;

        // Convert departments and subjectCode to uppercase if provided
        if (updates.departments && Array.isArray(updates.departments)) {
            updates.departments = updates.departments.map(dept => dept.toUpperCase());
        }
        if (updates.subjectCode) {
            updates.subjectCode = updates.subjectCode.toUpperCase();
        }

        const subject = await Subject.findOneAndUpdate(
            { _id: id, isActive: true },
            updates,
            { new: true, runValidators: true }
        ).populate('createdBy', 'name email');
        
        console.log('Updated subject:', subject);

        if (!subject) {
            console.log('Subject not found or inactive');
            return res.status(404).json({
                success: false,
                message: 'Subject not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Subject updated successfully',
            data: subject
        });
    } catch (error) {
        console.error('Error updating subject:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            success: false,
            message: 'Error updating subject',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Delete subject
export const deleteSubject = async (req, res) => {
    try {
        const { id } = req.params;

        const subject = await Subject.findByIdAndDelete(id);

        if (!subject) {
            return res.status(404).json({
                success: false,
                message: 'Subject not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Subject deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting subject:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            success: false,
            message: 'Error deleting subject',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Note: Faculty-Subject assignment is handled separately through Faculty Management system

// Get subjects by department
export const getSubjectsByDepartment = async (req, res) => {
    try {
        const { department } = req.params;

        const subjects = await Subject.findByDepartment(department)
            .populate('createdBy', 'name email')
            .sort({ subjectCode: 1 })
            .lean();

        res.status(200).json({
            success: true,
            data: subjects
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching subjects by department',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
