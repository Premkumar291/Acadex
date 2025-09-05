import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email : {
        type:String,
        required:true,
        unique:true
    },
    password : {
        type:String,
        required:true
    },
    name : {
        type:String,
        required:true
    },
    department : {
        type:String,
        required:true
    },
    lastLogin : {
        type: Date,
        default: Date.now()
    },
    isVerified : {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ['faculty', 'admin'],
        required: true,
        default: 'faculty'
    },
    // Hierarchical admin fields
    parentAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    adminLevel: {
        type: Number,
        default: 0, // 0 = root admin, 1 = level 1 sub-admin, 2 = level 2 sub-admin, 3 = level 3 sub-admin
        min: 0,
        max: 3
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    hierarchyPath: {
        type: String,
        default: '' // Stores the path like "rootId/level1Id/level2Id" for efficient querying
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken : String,
    verificationTokenExpiresAt : Date
}, { timestamps: true });

// Indexes for hierarchical queries
userSchema.index({ parentAdmin: 1 });
userSchema.index({ createdBy: 1 });
userSchema.index({ hierarchyPath: 1 });
userSchema.index({ role: 1, adminLevel: 1 });

// Pre-save middleware to update hierarchy path
userSchema.pre('save', async function(next) {
    try {
        console.log('Pre-save middleware triggered for user:', this.email, 'role:', this.role);
        console.log('isNew:', this.isNew, 'isModified(parentAdmin):', this.isModified('parentAdmin'));
        console.log('parentAdmin:', this.parentAdmin);
        
        // Always set hierarchy fields for new users or when parentAdmin is modified
        if (this.isNew || this.isModified('parentAdmin')) {
            if (this.parentAdmin) {
                console.log('Finding parent admin with ID:', this.parentAdmin);
                const parent = await this.constructor.findById(this.parentAdmin);
                console.log('Parent found:', parent ? parent.email : 'null');
                
                if (parent) {
                    this.hierarchyPath = parent.hierarchyPath ? 
                        `${parent.hierarchyPath}/${this.parentAdmin}` : 
                        this.parentAdmin.toString();
                    this.adminLevel = parent.adminLevel + 1;
                    console.log('Set hierarchyPath:', this.hierarchyPath);
                    console.log('Set adminLevel:', this.adminLevel);
                } else {
                    console.log('Parent not found, setting default values');
                    this.hierarchyPath = '';
                    this.adminLevel = 0;
                }
            } else {
                // No parent admin - set defaults
                this.hierarchyPath = '';
                this.adminLevel = 0;
                console.log('No parent admin - hierarchyPath set to empty, adminLevel set to 0');
            }
        }
        
        // Ensure hierarchyPath is never undefined
        if (this.hierarchyPath === undefined) {
            this.hierarchyPath = '';
        }
        
        next();
    } catch (error) {
        console.error('Error in pre-save middleware:', error);
        next(error);
    }
});

// Static method to get all admins in hierarchy
userSchema.statics.getAdminsInHierarchy = function(adminId) {
    return this.find({
        role: 'admin',
        $or: [
            { _id: adminId },
            { hierarchyPath: new RegExp(`(^|/)${adminId}(/|$)`) },
            { parentAdmin: adminId }
        ]
    }).populate('parentAdmin createdBy');
};

// Static method to get visible users for an admin
userSchema.statics.getVisibleUsers = function(adminId) {
    return this.find({
        $or: [
            { createdBy: adminId },
            { hierarchyPath: new RegExp(`(^|/)${adminId}(/|$)`) },
            { parentAdmin: adminId }
        ]
    }).populate('parentAdmin createdBy');
};

// Method to check if user can see another user
userSchema.methods.canSeeUser = function(targetUserId) {
    if (this.role !== 'admin') return false;
    
    // Can see users they created
    if (this.createdBy && this.createdBy.equals(targetUserId)) return true;
    
    // Can see users in their hierarchy path
    if (this.hierarchyPath.includes(targetUserId.toString())) return true;
    
    // Can see their parent
    if (this.parentAdmin && this.parentAdmin.equals(targetUserId)) return true;
    
    return false;
};

// Method to get sub-admin count
userSchema.methods.getSubAdminCount = async function() {
    return await this.constructor.countDocuments({
        parentAdmin: this._id,
        role: 'admin'
    });
};

// Method to check if can create sub-admin
userSchema.methods.canCreateSubAdmin = async function() {
    if (this.role !== 'admin') return false;
    if (this.adminLevel >= 3) return false; // Max 3 levels deep
    
    const subAdminCount = await this.getSubAdminCount();
    return subAdminCount < 3; // Max 3 sub-admins per admin
};

// Static method to fix existing users' hierarchy paths
userSchema.statics.fixHierarchyPaths = async function() {
    console.log('Starting hierarchy path migration...');
    
    // Find all users with undefined or null hierarchyPath
    const usersToFix = await this.find({
        $or: [
            { hierarchyPath: { $exists: false } },
            { hierarchyPath: null },
            { hierarchyPath: undefined }
        ]
    });
    
    console.log(`Found ${usersToFix.length} users to fix`);
    
    for (const user of usersToFix) {
        if (user.parentAdmin) {
            const parent = await this.findById(user.parentAdmin);
            if (parent) {
                user.hierarchyPath = parent.hierarchyPath ? 
                    `${parent.hierarchyPath}/${user.parentAdmin}` : 
                    user.parentAdmin.toString();
                user.adminLevel = parent.adminLevel + 1;
            } else {
                user.hierarchyPath = '';
                user.adminLevel = 0;
            }
        } else {
            user.hierarchyPath = '';
            user.adminLevel = 0;
        }
        
        await user.save();
        console.log(`Fixed hierarchy for user: ${user.email}`);
    }
    
    console.log('Hierarchy path migration completed');
};

export const User = mongoose.model('User', userSchema);

