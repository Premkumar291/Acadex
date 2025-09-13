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
    // Admin management fields
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken : String,
    verificationTokenExpiresAt : Date
}, { timestamps: true });

// Indexes for admin queries
userSchema.index({ createdBy: 1 });
userSchema.index({ role: 1 });

// Pre-save middleware for basic validation
userSchema.pre('save', async function(next) {
    try {
        next();
    } catch (error) {
        next(error);
    }
});

// Static method to get users created by an admin
userSchema.statics.getUsersCreatedBy = function(adminId) {
    return this.find({
        createdBy: adminId
    }).populate('createdBy');
};

// Method to check if user can see another user (only users they created)
userSchema.methods.canSeeUser = function(targetUserId) {
    if (this.role !== 'admin') return false;
    
    // Can only see users they created directly
    return this.createdBy && this.createdBy.equals(targetUserId);
};

export const User = mongoose.model('User', userSchema);

