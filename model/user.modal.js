const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const addressSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['billing', 'shipping'],
        required: true
    },
    street: {
        type: String,
        required: true,
        trim: true
    },
    landmark: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    district: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    country: {
        type: String,
        required: true,
        trim: true
    },
    pincode: {
        type: String,
        required: true,
        trim: true
    },
    isPrimary: {
        type: Boolean,
        default: false
    }
}, { _id: false });

const paymentMethodSchema = new mongoose.Schema({
    provider: {
        type: String,
        required: true
    },
    paymentMethodId: {
        type: String,
        required: true
    }
}, { _id: false, timestamps: true });

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    userName: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String,
    },
    addresses: [addressSchema],
    paymentMethods: [paymentMethodSchema],
    phone: {
        country_code: {
            type: String,
            required: true
        },
        number: {
            type: String,
            required: true
        }
    },
    profilePicture: {
        type: String
    },
    dateOfBirth: {
        type: Date
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'dev', 'owner'],
        default: 'user'
    },
    preferences: {
        language: {
            type: String,
            default: 'en'
        },
        currency: {
            type: String,
            default: 'USD'
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    twoFactorEnabled: {
        type: Boolean,
        default: false
    },
    twoFactorSecret: {
        type: String
    },
    backupCodes: [{
        code: {
            type: String
        },
        used: {
            type: Boolean,
            default: false
        }
    }],
    emailVerificationToken: {
        type: String
    },
    emailVerificationExpires: {
        type: Date
    },
    passwordResetToken: {
        type: String
    },
    passwordResetExpires: {
        type: Date
    },
    auditLogs: [{
        action: {
            type: String
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        details: {
            type: mongoose.Schema.Types.Mixed
        }
    }]
}, { timestamps: true });

// Password hashing middleware
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

// Method to check password validity
userSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;