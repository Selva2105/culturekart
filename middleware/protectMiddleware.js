const jwt = require('jsonwebtoken');
const util = require('util');
const CustomError = require("../utils/customError");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const User = require('../model/model.user');

const protect = asyncErrorHandler(async (req, res, next) => {

    // 1. Read the token & check if it exist
    const testToken = req.headers.authorization;
    let token;

    if (testToken && testToken.startsWith('Bearer')) {
        token = testToken.split(' ')[1];
    }

    if (!token) return next(new CustomError('Your not logged in', 401));

    // 2. validate the token

    const decodedToken = await util.promisify(jwt.verify)(token, process.env.SECRET_STR);

    // 3. If the user exists
    const user = await User.findById({ _id: decodedToken.id });

    if (!user) {
        const error = new CustomError('The user with the given token doesn`t exist', 401);
        next(error);
    }

    // 4. Check if user is verified
    if (!user.verified) {
        const error = new CustomError('User not verified. Please verify to continue!', 401);
        next(error);
    }

    // 5. If the user changed the password after the token was issued;
    const isPasswordChanged = await user.isPasswordModified(decodedToken.iat);
    if (isPasswordChanged) {
        const error = new CustomError('Password has chnaged recently. Please login again !', 401);
        return next(error);
    }

    // 6. Alllow the user to route
    req.user = user;
    next();
});

module.exports = protect;