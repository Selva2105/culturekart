const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const crypto = require('crypto');

const phoneNumberSchema = mongoose.Schema({
    CountryCode: {
        type: String,
        required: [true, "Country code required"]
    },
    Number: {
        type: String,
        required: [true, "Phone number required"],
        unique: true
    }
})

const userSchema = mongoose.Schema(
    {
        userName: {
            type: String,
            required: [true, "Username is required"],
            trim: true,
            unique: true
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, 'Please enter a valid email']
        },
        phoneNumber: phoneNumberSchema,
        dob: {
            type: Date,
            required: [true, "Date of birth is required"],
        },
        role: {
            type: String,
            enum: ['user', 'admin', 'dev', 'owner'],
            default: 'user'
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            min: 8,
            max: 15,
            select: false, //to aviod anyone to see the password in response
            validate: {
                validator: function (value) {
                    return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/.test(value);
                },
                message: "Provide a valid password"
            }
        },
        confirmPassword: {
            type: String,
            required: [true, "Confirm password is required"],
            validate: {
                validator: function (value) {
                    return value === this.password;
                },
                message: "Passwords don't match"
            }
        },
        verified: {
            type: Boolean,
            enum: [true, false],
            default: false
        },
        passwordChangedAt: Date,
        passwordResetToken: String,
        passwordResetTokenExpire: Date,
        userVerifyToken: String,
        userVerifyTokenExpire: Date,
        lastUpdate: {
            type: Date,
            default: Date.now()
        },
        sellerRequest: Boolean

    },
    { timestamps: true }
);


userSchema.pre('save', async function (next) {
    if (this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 10);

    this.confirmPassword = undefined;
    this.lastUpdate = Date.now();

    return next();
});

userSchema.methods.generateUserVerifyToken = async function () {
    const VerifyToken = crypto.randomBytes(32).toString('hex');
    let expireTime = new Date();
    expireTime.setMinutes(expireTime.getMinutes() + 10);

    this.userVerifyToken = crypto.createHash('sha256').update(VerifyToken).digest('hex');
    this.userVerifyTokenExpire = expireTime;

    return VerifyToken;
};

const User = mongoose.model('user', userSchema);

module.exports = User;