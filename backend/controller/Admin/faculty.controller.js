import { Faculty } from "../../models/faculty.model.js";
import { User } from "../../models/user.model.js";

// Create a new faculty member
export const createFaculty = async (req, res) => {
    try {
        console.log('Faculty creation request received:', {
            body: req.body,
            user: req.user,
            userId: req.userId
        });
        
        const { 
            title, 
            name, 
            initials, 
            department,
            user // User ID linking to the user account
        } = req.body;
        const userId = req.user.userId || req.user._id || req.userId;

        // Validate required fields
        if (!title || !name || !initials || !department) {
            return res.status(400).json({
                success: false,
                message: 'Title, name, initials, and department are required'
            });
        }

        // Validate user ID
        if (!userId) {
            console.error('No user ID found in request');
            return res.status(401).json({
                success: false,
                message: 'User authentication required'
            });
        }

        console.log('Looking up admin user with ID:', userId);
        
        // Get the admin user who is creating this faculty
        const adminUser = await User.findById(userId);
        console.log('Admin user found:', adminUser);
        if (!adminUser) {
            console.error('Admin user not found for ID:', userId);
            return res.status(404).json({
                success: false,
                message: 'Admin user not found'
            });
        }
        
        if (adminUser.role !== 'admin') {
            console.error('User is not an admin:', {
                userId: userId,
                role: adminUser.role
            });
            return res.status(403).json({
                success: false,
                message: 'Only admin users can create faculty members'
            });
        }

        // Get the college name from the admin user
        console.log('Getting college name from admin user');
        const collegeName = await adminUser.getCollegeName();
        console.log('Admin user college name:', collegeName);
        if (!collegeName) {
            console.error('Admin user does not have a college name assigned');
            return res.status(400).json({
                success: false,
                message: 'Admin user does not have a college name assigned'
            });
        }

        // Check if faculty already exists with same name and initials
        console.log('Checking for existing faculty with:', {
            name: name.trim(),
            initials: initials.trim(),
            department: department.toUpperCase(),
            collegeName: collegeName
        });
        
        const existingFaculty = await Faculty.findOne({
            name: name.trim(),
            initials: initials.trim(),
            department: department.toUpperCase(),
            collegeName: collegeName
        });

        if (existingFaculty) {
            console.log('Faculty already exists:', existingFaculty);
            return res.status(400).json({
                success: false,
                message: 'Faculty with this name and initials already exists in this department and college'
            });
        }

        // Create new faculty
        console.log('Creating new faculty with data:', {
            title,
            name: name.trim(),
            initials: initials.trim(),
            department: department.toUpperCase(),
            collegeName: collegeName,
            user: user, // Link to user account
            createdBy: userId
        });
        
        const faculty = new Faculty({
            title,
            name: name.trim(),
            initials: initials.trim(),
            department: department.toUpperCase(),
            collegeName: collegeName, // Auto-assign college name from admin
            user: user, // Link to user account
            createdBy: userId
        });

        await faculty.save();
        console.log('Created faculty with college name:', faculty.collegeName);
        
        // Fetch the faculty again to ensure all fields are populated
        const populatedFaculty = await Faculty.findById(faculty._id).lean();
        console.log('Populated faculty data:', populatedFaculty);

        res.status(201).json({
            success: true,
            message: 'Faculty created successfully',
            data: populatedFaculty
        });
    } catch (error) {
        console.error('Error creating faculty:', error);
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
            .populate('user', 'email name') // Populate user information
            .lean();

        console.log(`Found ${faculty.length} faculty members matching filter`);
        if (faculty.length > 0) {
            console.log('Faculty data sample:', {
                _id: faculty[0]._id,
                title: faculty[0].title,
                name: faculty[0].name,
                initials: faculty[0].initials,
                department: faculty[0].department,
                collegeName: faculty[0].collegeName,
                user: faculty[0].user,
                createdBy: faculty[0].createdBy
            });
        }

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

        const faculty = await Faculty.findById(id).populate('user', 'email name').lean();
        console.log('Faculty by ID:', faculty);

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
        ).populate('user', 'email name'); // Populate user information

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
            .populate('user', 'email name') // Populate user information
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

