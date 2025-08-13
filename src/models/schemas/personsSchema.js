import mongoose, { Model, Document } from "mongoose";
import bcrypt from 'bcryptjs';

const PersonSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters'],
        maxlength: [30, 'Username cannot exceed 30 characters'],
        match: [/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, hyphens and underscores']
    },
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        minlength: [2, 'First name must be at least 2 characters'],
        maxlength: [50, 'First name cannot exceed 50 characters'],
        match: [/^[a-zA-ZÀ-ÿ\s'-]+$/, 'First name can only contain letters, spaces, hyphens and apostrophes']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        minlength: [2, 'Last name must be at least 2 characters'],
        maxlength: [50, 'Last name cannot exceed 50 characters'],
        match: [/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Last name can only contain letters, spaces, hyphens and apostrophes']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        maxlength: [255, 'Email cannot exceed 255 characters'],
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email']
    },
    roles: {
        type: [String],
        enum: {
            values: ["user", "admin", "professor", "mentor", "orientador", "monitor", "aluno", "pesquisador"],
            message: 'Invalid role: {VALUE}'
        },
        default: ["user"],
        validate: {
            validator: function(v) {
                return v && v.length > 0;
            },
            message: 'At least one role is required'
        }
    },
    avatarId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Storage',
        required: false
    },
    coverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Storage',
        required: false
    },
    hex: {
        type: String,
        required: [true, 'Hex color is required'],
        default: '#3498db',
        match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please enter a valid hex color']
    },
    passwordHash: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [60, 'Invalid password hash']
    },
    bio: {
        type: String,
        required: false,
        trim: true,
        maxlength: [500, 'Bio cannot exceed 500 characters'],
        default: 'Biografia não disponível'
    },
    social: {
        github: {
            type: String,
            required: false,
            trim: true,
            default: 'NÃO INFORMADO'
        },
        linkedin: {
            type: String,
            required: false,
            trim: true,
            default: 'NÃO INFORMADO'
        },
        twitter: {
            type: String,
            required: false,
            trim: true,
            default: 'NÃO INFORMADO'
        },
        instagram: {
            type: String,
            required: false,
            trim: true,
            default: 'NÃO INFORMADO'
        },
        facebook: {
            type: String,
            required: false,
            trim: true,
            default: 'NÃO INFORMADO'
        }
    },
    newsletter: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date,
        default: null
    }
}, {
    timestamps: true,
    versionKey: false
});

// Indexes for better performance (removed duplicates to fix warnings)
PersonSchema.index({ roles: 1 });
PersonSchema.index({ isActive: 1 });

// Virtual for full name
PersonSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

// Pre-save middleware to hash password if it's being modified
PersonSchema.pre('save', async function(next) {
    if (!this.isModified('passwordHash')) {
        return next();
    }

    try {
        // If passwordHash is actually a plain password, hash it
        if (this.passwordHash && this.passwordHash.length < 60) {
            const saltRounds = 12;
            this.passwordHash = await bcrypt.hash(this.passwordHash, saltRounds);
        }
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
PersonSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.passwordHash);
    } catch (error) {
        throw new Error('Error comparing passwords');
    }
};

// Method to change password
PersonSchema.methods.changePassword = async function(newPassword) {
    try {
        const saltRounds = 12;
        this.passwordHash = await bcrypt.hash(newPassword, saltRounds);
        return await this.save();
    } catch (error) {
        throw new Error('Error changing password');
    }
};

// Transform output to remove sensitive data
PersonSchema.methods.toJSON = function() {
    const personObject = this.toObject();
    delete personObject.passwordHash;
    return personObject;
};

const Person = mongoose.model("Person", PersonSchema);

export { Person };