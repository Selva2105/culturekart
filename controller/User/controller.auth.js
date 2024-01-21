const crypto = require("crypto");
const path = require('path');
const fs = require('fs')

const RevokedToken = require("../../model/model.revokedTokens");
const User = require("../../model/model.user");
const SignToken = require("../../utils/SignToken");
const AsyncErrorHandler = require("../../utils/asyncErrorHandler");
const CustomError = require("../../utils/customError");
const sendMail = require("../../utils/mailer");
const emailTemplate = require("../../view/email-template");
const { upload } = require("../../config/sinlgeMulterConfig");

/**
 * Create a new user with optional profile image upload.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const CreateUser = AsyncErrorHandler(async (req, res, next) => {
    // Use Multer to handle image upload
    upload(req, res, async function (err) {
        if (err) {
            // Remove the uploaded image if any error occurs during multer
            if (req.file) {
                const imagePath = path.join('public/images/user', req.file.filename);
                fs.unlinkSync(imagePath);
            }
            return next(err);
        }

        // Check if the request body is empty
        if (Object.keys(req.body).length === 0) {
            // Remove the uploaded image if any error occurs during user creation
            if (req.file) {
                const imagePath = path.join('public/images/user', req.file.filename);
                fs.unlinkSync(imagePath);
            }
            const error = new CustomError('Give the required fields', 500);
            return next(error);
        }

        // Create new user with the uploaded image path or default image
        const newUser = new User({
            ...req.body,
            profileImage: req.file ? `images/user/${req.file.filename}` : 'default-profile-image.jpg'
        });

        try {
            await newUser.save();
        } catch (error) {
            // Remove the saved image if any error occurs during user creation
            if (req.file) {
                const imagePath = path.join('public/images/user', req.file.filename);
                fs.unlinkSync(imagePath);
            }
            return next(error);
        }

        // Generate access token and verify token and save it in the DB
        const token = SignToken(newUser._id);
        const verifyToken = await newUser.generateUserVerifyToken();
        await newUser.save({ validateBeforeSave: false });
        const mailOptions = {
            from: {
                name: "i Kart",
                address: process.env.ADMIN_MAIL,
            },
            to: req.body.email,
            subject: "Verify your iKart Account",
            html: emailTemplate(`https://culturekart.vercel.app/api/v1/user/verify/${verifyToken}`, newUser.userName),
        }

        console.log("Token", verifyToken);

        await sendMail(mailOptions)

        res.status(201).json({
            status: 'success',
            message: 'User created successfully',
            token
        });
    });
});

/**
 * Authenticate a user and generate a login token.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const loginUser = AsyncErrorHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Check if both email and password are received from the request
    if (!email || !password) {
        const error = new CustomError('Please provide email and password', 400);
        return next(error);
    }

    const user = await User.findOne({ email }).select('+password'); // Include '+password' projection

    // Check if the user and password match
    const isPasswordMatch = user && await user.comparePasswordInDb(password, user.password);

    console.log('Password Match:', isPasswordMatch);

    if (!user || !isPasswordMatch) {
        const error = new CustomError('Incorrect email or password', 400);
        return next(error);
    }

    // Generate the token for logging in
    const token = SignToken(user._id);

    // Send the token
    res.status(201).json({
        status: 'success',
        message: 'User logged in successfully',
        token,
    });
});

/**
 * Logout a user by adding the token to the blacklist.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const logoutUser = AsyncErrorHandler(async (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    // Add the token to the blacklist in the database
    await RevokedToken.create({ token });

    res.status(200).json({ message: 'Logout successful' });
});

/**
 * Verify a user's account using the provided verification token.
 * @param {Object} req - Express request object with token parameter.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const verifyUser = AsyncErrorHandler(async (req, res, next) => {
    // Decrypting the token
    const decryptedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    // Finding the user and checking if the user's token is still valid
    const user = await User.findOne({ userVerifyToken: decryptedToken });

    if (!user || user.userVerifyTokenExpire < Date.now()) {
        const error = new CustomError('Token is invalid or expired', 400);
        return next(error);
    }

    // Mark the user as verified
    await user.markAsVerified();

    // Check if the user's verified status has turned to true after saving changes
    if (user.verified) {
        // Send the email-result.html file as a response
        const filePath = path.join(__dirname, '../', '../', 'view', 'email-result.html');
        return res.sendFile(filePath);
    } else {
        const error = new CustomError('User verification failed', 500);
        return next(error);
    }
});

module.exports = { CreateUser, loginUser, logoutUser, verifyUser }
