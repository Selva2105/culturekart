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
        profileImage: {
            type: String,
            default: 'default-profile-image.jpg'
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
        premium_member: {
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
    const verifyToken = crypto.randomBytes(32).toString('hex');
    let expireTime = new Date();
    
    // Set expiration time to 2 days from today
    expireTime.setDate(expireTime.getDate() + 2);

    this.userVerifyToken = crypto.createHash('sha256').update(verifyToken).digest('hex');
    this.userVerifyTokenExpire = expireTime;

    return verifyToken;
};

userSchema.methods.markAsVerified = async function () {
    this.verified = true;
    this.userVerifyToken = undefined;
    this.userVerifyTokenExpire = undefined;

    await this.save({ validateBeforeSave: false });
};

userSchema.methods.changepToPremiumMember = async function () {
    this.premium_member = true;

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

userSchema.methods.updateWishlist = async function (productId) {
    try {
        // Check if the product ID is already in the wishlist
        const existingItemIndex = this.wishlist.findIndex(item => item.product.equals(productId));

        if (existingItemIndex !== -1) {
            // If the product is already in the wishlist, remove it
            this.wishlist.splice(existingItemIndex, 1);
            await this.save({ validateBeforeSave: false });  // Save changes here
            return "Removed successfully";
        } else {
            // If the product is not in the wishlist, add it
            this.wishlist.push({ product: productId });
            await this.save({ validateBeforeSave: false });  // Save changes here
            return "Added successfully";
        }
    } catch (error) {
        throw error;
    }
};

userSchema.methods.addCart = async function ({ productId, count, action }) {
    try {
        const existingCartItemIndex = this.cart.findIndex(item => item.product.equals(productId));

        if (action === 'add') {
            if (existingCartItemIndex !== -1) {
                // If the product already exists, update the count
                this.cart[existingCartItemIndex].count = count;
            } else {
                // If the product doesn't exist, add it to the cart
                this.cart.push({ product: productId, count });
            }
        } else if (action === 'remove') {
            if (existingCartItemIndex !== -1) {
                // If the product exists, decrease the count
                this.cart[existingCartItemIndex].count = 0;
                if (this.cart[existingCartItemIndex].count <= 0) {
                    // If the count becomes zero or negative, remove the item from the cart
                    this.cart.splice(existingCartItemIndex, 1);
                }
            } else {
                return "Product not found in cart";
            }
        } else {
            throw new CustomError("Invalid action. Use 'add' or 'remove'.", 400);
        }

        // Remove items from the cart where count is zero or negative
        this.cart = this.cart.filter(item => item.count > 0);

        await this.save({ validateBeforeSave: false });  // Save changes here

        if (action === 'add') {
            if (existingCartItemIndex !== -1) {
                return "Updated count in cart successfully";
            } else {
                return "Added to cart successfully";
            }
        } else {
            return "Removed from cart successfully";
        }
    } catch (error) {
        throw error;
    }
};



const User = mongoose.model('user', userSchema);

module.exports = User;