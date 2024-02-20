const User = require("../model/user.modal");
const asyncErrorHandler = require('../utils/asyncErrorHandler')

// Function to create a new user
exports.createUser = asyncErrorHandler(async (req, res,next) => {
    // Destructure the request body
    const { firstName, lastName, userName, email, password, confirmPassword, addresses, phone, profilePicture, dateOfBirth } = req.body;

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
        throw new CustomError('Passwords do not match', 400);
    }

    // Create a new user instance without the confirmPassword field
    const user = new User({
        firstName,
        lastName,
        userName,
        email,
        password, // Password hashing is handled in the model
        addresses,
        phone,
        profilePicture,
        dateOfBirth,
    });

    // Save the user to the database
    await user.save();

    // Prepare the response object without sensitive data
    const userResponse = {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
        email: user.email,
        addresses: user.addresses,
        phone: user.phone,
        profilePicture: user.profilePicture,
        dateOfBirth: user.dateOfBirth,
    };

    // Send a response back to the client
    res.status(201).json({
        message: 'User created successfully',
        user: userResponse
    });
});