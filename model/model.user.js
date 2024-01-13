const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const crypto = require('crypto');
const CustomError = require('../utils/customError');

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
            select: false,
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
        policyStatus: {
            type: Boolean,
            enum: [true, false]
        },
        verified: {
            type: Boolean,
            enum: [true, false],
            default: false
        },
        wishlist: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                }
            }
        ],
        cart: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                size: {
                    type: String,
                    required: true,
                },
                count: {
                    type: Number,
                    required: true,
                    default: 1,
                },
                price: {
                    type: Number,
                    required: true,
                },
            }
        ],
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
    if (!this.isModified('password')) return next();

    //encrypt the password befor creating it...
    this.password = await bcrypt.hash(this.password, 12);

    this.confirmPassword = undefined;
    this.lastUpdate = Date.now();
    next();
});


userSchema.pre('save', async function (next) {

    if (!this.policyStatus) {
        const error = new CustomError("Accept the company policy", 500);
        return next(error);
    }
})

userSchema.methods.generateUserVerifyToken = async function () {
    const VerifyToken = crypto.randomBytes(32).toString('hex');
    const expireTime = Date.now() + 24 * 60 * 60 * 1000;

    this.userVerifyToken = crypto.createHash('sha256').update(VerifyToken).digest('hex');
    this.userVerifyTokenExpire = expireTime;

    return VerifyToken;
};

userSchema.methods.markAsVerified = async function () {
    this.verified = true;
    this.userVerifyToken = undefined;
    this.userVerifyTokenExpire = undefined;

    await this.save({ validateBeforeSave: false });
};

// To invalidate the user token after user modify their password
userSchema.methods.isPasswordModified = async function (JWTtimestamp) {
    if (this.passwordChangedAt) {

        const passwordChangedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTtimestamp < passwordChangedTimestamp;
    }
    return false;
}

// To login the user compare the user password with db password
userSchema.methods.comparePasswordInDb = async function (password, passwordDb) {
    return await bcrypt.compare(password, passwordDb);
}

userSchema.methods.updateWishlist = async function (productId, action) {
    try {
        if (action === 'add') {
            // Check if the product ID is already in the wishlist
            if (!this.wishlist.some(item => item.product.equals(productId))) {
                this.wishlist.push({ product: productId });
            }

            return "Added successfully"
        } else if (action === 'remove') {
            this.wishlist = this.wishlist.filter(item => !item.product.equals(productId));
            return "Removed successfully"

        } else {
            throw new CustomError("Invalid action. Use 'add' or 'remove'.", 400);
        }

        await this.save({ validateBeforeSave: false });
    } catch (error) {
        throw error;
    }
};

userSchema.methods.updateCart = async function (productId, size, quantity, price, action) {
    try {
        const existingCartItem = this.cart.find(item => item.product.equals(productId) && item.size === size);

        if (action === 'add') {
            if (existingCartItem) {
                // If the product with the same size already exists, update the quantity
                existingCartItem.quantity += quantity;
            } else {
                // If the product with the same size doesn't exist, add it to the cart
                this.cart.push({ product: productId, size, quantity, price });
            }
            return "Added to cart successfully";
        } else if (action === 'remove') {
            if (existingCartItem) {
                // If the product with the same size exists, decrease the quantity
                existingCartItem.quantity -= quantity;
                if (existingCartItem.quantity <= 0) {
                    // If the quantity becomes zero or negative, remove the item from the cart
                    this.cart = this.cart.filter(item => !(item.product.equals(productId) && item.size === size));
                }
            }
            return "Removed from cart successfully";
        } else {
            throw new CustomError("Invalid action. Use 'add' or 'remove'.", 400);
        }

        await this.save({ validateBeforeSave: false });
    } catch (error) {
        throw error;
    }
};


const User = mongoose.model('user', userSchema);

module.exports = User;