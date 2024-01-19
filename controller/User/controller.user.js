const AsyncErrorHandler = require("../../utils/asyncErrorHandler");
const CustomError = require("../../utils/customError");

const getUserDetailsById = AsyncErrorHandler(async (req, res, next) => {
    const user = req.user;

    if (!user) {
        const error = new CustomError("User not found", 404);
        return next(error);
    }

    res.status(200).json({
        status: 'success',
        data: {
            user: user
        }
    });
});

const wishlistHandler = AsyncErrorHandler(async (req, res, next) => {
    const user = req.user;
    const productId = req.params.id;
    const { action } = req.body;

    if (!user) {
        const error = new CustomError("User not found", 404);
        return next(error);
    }

    const result = await user.updateWishlist(productId);

    res.status(200).json({
        status: 'success',
        message: result
    });
});

const kartHandler = AsyncErrorHandler(async (req, res, next) => {
    const user = req.user;
    const productId = req.params.id;
    const { size, count, price, action } = req.body;

    if (!user) {
        const error = new CustomError("User not found", 404);
        return next(error);
    }

    const result = await user.addCart({productId, size, count, price, action});

    res.status(200).json({
        status: 'success',
        message: result
    });
})

module.exports = { getUserDetailsById, wishlistHandler,kartHandler };

