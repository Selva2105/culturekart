const jwt = require('jsonwebtoken');
const util = require('util');
const CustomError = require("../utils/customError");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const User = require('../model/model.user');
const RevokedToken = require('../model/model.revokedTokens');

/**
 * Middleware to protect routes by validating JWT tokens.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const protect = asyncErrorHandler(async (req, res, next) => {

    // 1. Read the token & check if it exists
    const testToken = req.headers.authorization;
    let token;

    // Extract the token from the Authorization header
    if (testToken && testToken.startsWith('Bearer')) {
        token = testToken.split(' ')[1];
    }

    // If no token is found, return an error
    if (!token) return next(new CustomError('You are not logged in', 401));

    // Check if the token is blacklisted in the database
    const isBlacklisted = await RevokedToken.exists({ token });

    if (isBlacklisted) {
        // If the token is blacklisted, return an error
        return res.status(401).json({ message: 'Token revoked. Please log in again.' });
    }

    // 2. Validate the token

    // Verify the token using the JWT library
    const decodedToken = await util.promisify(jwt.verify)(token, process.env.SECRET_STR);

    // 3. Check if the user exists
    const user = await User.findById({ _id: decodedToken.id });

    // If no user is found, return an error
    if (!user) {
        const error = new CustomError('The user with the given token doesn\'t exist', 401);
        next(error);
    }

    // 4. Check if the user is verified
    if (!user.verified) {
        const error = new CustomError('User not verified. Please verify to continue!', 401);
        next(error);
    }

    // 5. Check if the user changed the password after the token was issued
    const isPasswordChanged = await user.isPasswordModified(decodedToken.iat);
    if (isPasswordChanged) {
        const error = new CustomError('Password has changed recently. Please login again!', 401);
        return next(error);
    }

    // 6. Allow the user to proceed to the route
    req.user = user;
    next();
});

module.exports = protect;
