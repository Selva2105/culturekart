const { log } = require("console");
const RevokedToken = require("../../model/model.revokedTokens");
const User = require("../../model/model.user");
const SignToken = require("../../utils/SignToken");
const AsyncErrorHandler = require("../../utils/asyncErrorHandler");
const CustomError = require("../../utils/customError");
const sendMail = require("../../utils/mailer");
const emailTemplate = require("../../view/email-template");
const crypto = require("crypto");
const path = require('path');

const CreateUser = AsyncErrorHandler(async (req, res, next) => {

    // 1. Check the req body
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
        status: 'sucess',
        message: "User created sucessfully",
        token
    })
})

const loginUser = AsyncErrorHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // 1. Check both email and password are received from the request
    if (!email || !password) {
        const error = new CustomError('Please provide email and password', 400);
        return next(error);
    }

    const user = await User.findOne({ email }).select('+password'); // Include '+password' projection

    // 3. Check if the user and password match
    const isPasswordMatch = await user.comparePasswordInDb(password, user.password);

    console.log('Password Match:', isPasswordMatch);

    if (!user || !isPasswordMatch) {
        const error = new CustomError('Incorrect email or password', 400);
        return next(error);
    }

    // 4. Generate the token for logging in
    const token = SignToken(user._id);

    // 5. Send the token
    res.status(201).json({
        status: 'success',
        message: 'User logged in successfully',
        token,
    });
});


const logoutUser = AsyncErrorHandler(async (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    // Add the token to the blacklist in the database
    await RevokedToken.create({ token });

    res.status(200).json({ message: 'Logout successful' });
});

const verifyUser = AsyncErrorHandler(async (req, res, next) => {
    // 1. Decrypting the token
    const decryptedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    // 2. Finding the user and checking if the user's token is still valid
    const user = await User.findOne({ userVerifyToken: decryptedToken });

    if (!user || user.userVerifyTokenExpire < Date.now()) {
        const error = new CustomError('Token is invalid or expired', 400);
        return next(error);
    }

    // 3. Mark the user as verified
    await user.markAsVerified();

    // 4. Check if the user's verified status has turned to true after saving changes
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