const CustomError = require("../utils/customError");
const asyncErrorHandler = require("../utils/asyncErrorHandler");


/**
 * Middleware to verifiy the user routes by validating JWT tokens.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const verifiedUser = asyncErrorHandler(async (req, res, next) => {

    const user = req.user;

    // 1. If no user is found, return an error
    if (!user) {
        const error = new CustomError('The user with the given token doesn\'t exist', 401);
        next(error);
    }

    // 2. Check if the user is verified
    if (!user.verified) {
        const error = new CustomError('User not verified. Please verify to continue!', 401);
        next(error);
    }

    // 6. Allow the user to proceed to the route
    req.user = user;
    next();

});

module.exports = verifiedUser;
