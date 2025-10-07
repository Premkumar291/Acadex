import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
    subjectCode: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true,
        match: [/^[A-Z]{2,4}\d{3,4}[A-Z]?$/, 'Subject code must be in format like CS101, MATH201, etc.']
    },
    subjectName: {
        type: String,
        required: true,
        trim: true
    },
    departments: [{
        type: String,
        required: true,
        trim: true,
        uppercase: true
    }],
    semester: {
        type: Number,
        required: false,
        min: 1,
        max: 8
    },
    credits: {
        type: Number,
        required: false,
        min: 1,
        max: 6
    },
    subjectType: {
        type: String,
        enum: ['Theory', 'Practical', 'Inbuilt', 'Project'],
        default: 'Theory'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Indexes for better performance
subjectSchema.index({ subjectCode: 1 });
subjectSchema.index({ departments: 1 });
subjectSchema.index({ subjectName: 1 });

// Virtual for full subject display
subjectSchema.virtual('displayName').get(function() {
    return `${this.subjectCode} - ${this.subjectName}`;
});

// Virtual for department display - use first department as primary
subjectSchema.virtual('primaryDepartment').get(function() {
    return this.departments.length > 0 ? this.departments[0] : null;
});

// Virtual for department display
subjectSchema.virtual('departmentDisplay').get(function() {
    if (this.departments.length === 1) {
        return this.departments[0];
    }
    return `${this.departments[0]} (+${this.departments.length - 1} more)`;
});

// Static method to find subjects by department (supports multiple departments)
subjectSchema.statics.findByDepartment = function(department) {
    return this.find({ 
        departments: { $in: [department.toUpperCase()] }, 
        isActive: true 
    });
};

// Static method to find subjects by multiple departments
subjectSchema.statics.findByDepartments = function(departments) {
    const upperDepartments = departments.map(dept => dept.toUpperCase());
    return this.find({ 
        departments: { $in: upperDepartments }, 
        isActive: true 
    });
};

// Static method to search subjects
subjectSchema.statics.searchSubjects = function(searchTerm) {
    const regex = new RegExp(searchTerm, 'i');
    return this.find({
        $or: [
            { subjectCode: regex },
            { subjectName: regex }
        ],
        isActive: true
    });
};

// Instance method to check if subject belongs to department
subjectSchema.methods.belongsToDepartment = function(department) {
    return this.departments.includes(department.toUpperCase());
};

// Instance method to add department
subjectSchema.methods.addDepartment = function(department) {
    const upperDept = department.toUpperCase();
    if (!this.departments.includes(upperDept)) {
        this.departments.push(upperDept);
    }
    return this;
};

// Instance method to remove department
subjectSchema.methods.removeDepartment = function(department) {
    const upperDept = department.toUpperCase();
    this.departments = this.departments.filter(dept => dept !== upperDept);
    return this;
};

export const Subject = mongoose.model('Subject', subjectSchema);