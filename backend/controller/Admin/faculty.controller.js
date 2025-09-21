import { Faculty } from "../../models/faculty.model.js";

// Create a new faculty member
export const createFaculty = async (req, res) => {
    try {
        const { 
            title, 
            name, 
            initials, 
            department
        } = req.body;
        const userId = req.user.userId;

        // Validate required fields
        if (!title || !name || !initials || !department) {
            return res.status(400).json({
                success: false,
                message: 'Title, name, initials, and department are required'
            });
        }

        // Check if faculty already exists with same name and initials
        const existingFaculty = await Faculty.findOne({
            name: name.trim(),
            initials: initials.trim(),
            department: department.toUpperCase()
        });

        if (existingFaculty) {
            return res.status(400).json({
                success: false,
                message: 'Faculty with this name and initials already exists in this department'
            });
        }

        // Create new faculty
        const faculty = new Faculty({
            title,
            name: name.trim(),
            initials: initials.trim(),
            department: department.toUpperCase(),
            createdBy: userId
        });

        await faculty.save();

        res.status(201).json({
            success: true,
            message: 'Faculty created successfully',
            data: faculty
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating faculty',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get all faculty with pagination and filters
export const getFaculty = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 20, 
            department, 
            search 
        } = req.query;

        console.log('Faculty API called with params:', { page, limit, department, search });
        console.log('User ID from token:', req.user?.userId);

        let filter = {};

        // Add department filter
        if (department) {
            filter.department = department.toUpperCase();
        }

        // Add search filter
        if (search) {
            const regex = new RegExp(search, 'i');
            filter.$or = [
                { name: regex },
                { initials: regex }
            ];
        }

        console.log('Faculty filter:', filter);

        const skip = (parseInt(page) - 1) * parseInt(limit);

        // First, let's check total count in database
        const totalInDB = await Faculty.countDocuments({});
        console.log(`Total faculty in DB: ${totalInDB}`);

        const faculty = await Faculty.find(filter)
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ name: 1 })
            .lean();

        console.log(`Found ${faculty.length} faculty members matching filter`);

        const totalFaculty = await Faculty.countDocuments(filter);
        const totalPages = Math.ceil(totalFaculty / parseInt(limit));

        res.status(200).json({
            success: true,
            data: faculty,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalFaculty,
                hasNext: parseInt(page) < totalPages,
                hasPrev: parseInt(page) > 1
            }
        });
    } catch (error) {
        console.error('Error fetching faculty:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching faculty',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get faculty by ID
export const getFacultyById = async (req, res) => {
    try {
        const { id } = req.params;

        const faculty = await Faculty.findById(id).lean();

        if (!faculty) {
            return res.status(404).json({
                success: false,
                message: 'Faculty not found'
            });
        }

        res.status(200).json({
            success: true,
            data: faculty
        });
    } catch (error) {
        console.error('Error fetching faculty by ID:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching faculty',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Update faculty
export const updateFaculty = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Remove fields that shouldn't be updated directly
        delete updates._id;
        delete updates.createdBy;
        delete updates.createdAt;
        delete updates.updatedAt;

        // Convert department to uppercase if provided
        if (updates.department) {
            updates.department = updates.department.toUpperCase();
        }

        // Trim name and initials if provided
        if (updates.name) {
            updates.name = updates.name.trim();
        }
        if (updates.initials) {
            updates.initials = updates.initials.trim();
        }

        const faculty = await Faculty.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        );

        if (!faculty) {
            return res.status(404).json({
                success: false,
                message: 'Faculty not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Faculty updated successfully',
            data: faculty
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating faculty',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Delete faculty (soft delete)
export const deleteFaculty = async (req, res) => {
    try {
        const { id } = req.params;

        const faculty = await Faculty.findByIdAndDelete(id);

        if (!faculty) {
            return res.status(404).json({
                success: false,
                message: 'Faculty not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Faculty deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting faculty',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get faculty by department
export const getFacultyByDepartment = async (req, res) => {
    try {
        const { department } = req.params;

        const faculty = await Faculty.find({ department: department.toUpperCase() })
            .sort({ name: 1 })
            .lean();

        res.status(200).json({
            success: true,
            data: faculty
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching faculty by department',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

