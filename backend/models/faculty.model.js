import mongoose from 'mongoose';

const facultySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        enum: ['Dr.', 'Prof.', 'Asst. Prof.', 'Assoc. Prof.', 'Mr.', 'Ms.', 'Mrs.']
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    initials: {
        type: String,
        required: true,
        trim: true,
        maxlength: 10
    },
    department: {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
        enum: ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'AUTO', 'CS & DS', 'ENGLISH', 'MATHS', 'PHYSICS', 'CHEMISTRY', 'OTHER']
    },
    // College name field
    collegeName: {
        type: String,
        required: true,
        trim: true
    },
    // Reference to the user account
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Add a pre-save hook to log the data being saved
facultySchema.pre('save', function(next) {
    console.log('Saving faculty with data:', {
        title: this.title,
        name: this.name,
        initials: this.initials,
        department: this.department,
        collegeName: this.collegeName,
        createdBy: this.createdBy
    });
    next();
});

// Add a post-save hook to log the saved data
facultySchema.post('save', function(doc) {
    console.log('Faculty saved with data:', {
        _id: doc._id,
        title: doc.title,
        name: doc.name,
        initials: doc.initials,
        department: doc.department,
        collegeName: doc.collegeName,
        createdBy: doc.createdBy
    });
});

// Indexes for better performance
facultySchema.index({ name: 1 });
facultySchema.index({ department: 1 });
facultySchema.index({ initials: 1 });
facultySchema.index({ collegeName: 1 });
facultySchema.index({ user: 1 }); // Index for user field

// Virtual for full name display
facultySchema.virtual('fullName').get(function() {
    return `${this.title} ${this.name}`;
});

// Virtual for display name with initials
facultySchema.virtual('displayName').get(function() {
    return `${this.title} ${this.name} (${this.initials})`;
});

// Method to get associated user information
facultySchema.methods.getUserInfo = async function() {
    if (this.user) {
        const User = mongoose.model('User');
        return await User.findById(this.user).select('email name department role');
    }
    return null;
};

// Static method to find faculty by user ID
facultySchema.statics.findByUserId = function(userId) {
    return this.findOne({ user: userId });
};

// Static method to find faculty by department
facultySchema.statics.findByDepartment = function(department) {
    return this.find({ department: department.toUpperCase(), isActive: true });
};

// Static method to search faculty
facultySchema.statics.searchFaculty = function(searchTerm) {
    const regex = new RegExp(searchTerm, 'i');
    return this.find({
        $or: [
            { name: regex },
            { initials: regex }
        ],
        isActive: true
    });
};

// Static method to get faculty visible to an admin
facultySchema.statics.getVisibleFaculty = async function(adminId) {
    const User = mongoose.model('User');
    
    // Get all users visible to this admin
    const visibleUsers = await User.getVisibleUsers(adminId);
    const visibleUserIds = visibleUsers.map(user => user._id);
    
    // Return faculty created by visible users
    return this.find({
        createdBy: { $in: visibleUserIds },
        isActive: true
    }).populate('createdBy', 'name email role adminLevel');
};

// Static method to check if admin can see specific faculty
facultySchema.statics.canAdminSeeFaculty = async function(adminId, facultyId) {
    const faculty = await this.findById(facultyId).populate('createdBy');
    if (!faculty) return false;
    
    const User = mongoose.model('User');
    const admin = await User.findById(adminId);
    
    if (!admin || admin.role !== 'admin') return false;
    
    // Can see faculty they created
    if (faculty.createdBy && faculty.createdBy._id.equals(adminId)) {
        return true;
    }
    
    // Can see faculty created by users in their visibility scope
    if (faculty.createdBy) {
        const visibleUsers = await User.getVisibleUsers(adminId);
        const visibleUserIds = visibleUsers.map(user => user._id.toString());
        return visibleUserIds.includes(faculty.createdBy._id.toString());
    }
    
    return false;
};

export const Faculty = mongoose.model('Faculty', facultySchema);