const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const CustomError = require("../../utils/customError");
const { ObjectId } = require('mongodb');

const getUserDetailsById = asyncErrorHandler(async (req, res, next) => {
    
    const user = req.user;
    const id = req.params.id;

    if (!user || String(user._id) !== String(new ObjectId(id))) {
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

module.exports = { getUserDetailsById };
