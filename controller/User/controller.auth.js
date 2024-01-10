const User = require("../../model/model.user");
const SignToken = require("../../utils/SignToken");
const AsyncErrorHandler = require("../../utils/asyncErrorHandler");
const CustomError = require("../../utils/customError");

const CreateUser = AsyncErrorHandler(async (req, res, next) => {

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

    const { email, password } = req.body;


    // 1. Check both email and password is received from request
    if (!email || !password) {
        const error = new CustomError('Please provide email and password', 400);
        return next(error)
    }

    // 2. Find if user is exist and password match...
    const user = await User.findOne({ email }).select('+password'); // to get the password also use select

    if (!user || !(await user.comparePasswordInDb(password, user.password))) {
        const error = new CustomError('Incorrect email or password', 400);
        return next(error);
    }

    // 3. Generate the token for logging in
    const token = SignToken(user._id);

    // 4. Send the token
    res.status(200).json({
        status: 'success',
        message: "User logged in sucessfully",
        token,
    })
})


module.exports = { CreateUser, loginUser }