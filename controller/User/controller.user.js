const AsyncErrorHandler = require("../../utils/asyncErrorHandler");
const CustomError = require("../../utils/customError");

/**
 * Get user details by user ID.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const getUserDetailsById = AsyncErrorHandler(async (req, res, next) => {
    // Retrieve user from request object
    const user = req.user;

    // If user is not found, send a 404 error
    if (!user) {
        const error = new CustomError("User not found", 404);
        return next(error);
    }

    // Send user details in the response
    res.status(200).json({
        status: 'success',
        data: {
            user: user
        }
    });
});

/**
 * Handle wishlist operations (add/remove) for a user.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const wishlistHandler = AsyncErrorHandler(async (req, res, next) => {
    // Retrieve user, product ID, and action from request object
    const user = req.user;
    const productId = req.params.id;
    const { action } = req.body;

    // If user is not found, send a 404 error
    if (!user) {
        const error = new CustomError("User not found", 404);
        return next(error);
    }

    // Perform wishlist update and send success message in response
    const result = await user.updateWishlist(productId);
    res.status(200).json({
        status: 'success',
        message: result
    });
});

/**
 * Handle shopping cart operations (add/remove/update) for a user.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const kartHandler = AsyncErrorHandler(async (req, res, next) => {
    // Retrieve user, product ID, size, count, price, and action from request object
    const user = req.user;
    const productId = req.params.id;
    const { size, count, price, action } = req.body;

    // If user is not found, send a 404 error
    if (!user) {
        const error = new CustomError("User not found", 404);
        return next(error);
    }

    // Perform shopping cart update and send success message in response
    const result = await user.addCart({ productId, size, count, price, action });
    res.status(200).json({
        status: 'success',
        message: result
    });
});

module.exports = { getUserDetailsById, wishlistHandler, kartHandler };
