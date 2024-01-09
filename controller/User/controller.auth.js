const User = require("../../model/model.user");
const SignToken = require("../../utils/SignToken");
const AsyncErrorHandler = require("../../utils/asyncErrorHandler");
const CustomError = require("../../utils/customError");

const CreateUser = AsyncErrorHandler(async (req, res, next) => {
    const { userName, email, phoneNumber, dob, password, confirmPassword } = req.body;

    if (Object.keys(req.body).length === 0) {
        const error = new CustomError("Give the required fields", 500);
        return next(error);
    }

    // 2. Create new user
    const newUser = await User.create(req.body);

    // 3. Generate access token and verify token and save it in the DB
    const token = SignToken(newUser._id);
    const verifyToken = await newUser.generateUserVerifyToken();
    await newUser.save({ validateBeforeSave: false });

    res.status(201).json({
        status: 'sucess',
        message: "User created sucessfully",
        token
    })
})

const loginUser = AsyncErrorHandler(async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        const error = new CustomError("Email or password is missing !", 500);
        return next(error);
    }

    res.status(201).json({
        status: 'sucess',
        message: "User logged in sucessfully",
    })
})


module.exports = { CreateUser, loginUser }