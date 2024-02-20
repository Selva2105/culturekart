const express = require('express');
const { validationResult } = require('express-validator');
const router = express.Router();

// Import the validator function

const { createUser } = require('../controller/auth.controller');
const userValidators = require('../validators/userValidators');

// Route to create a new user
router.post('/users', userValidators.validateUserFields, userValidators.validateAddressFields, (req, res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        next(errors.array());
    }

    // Call the controller function to create the user
    createUser(req, res, next);
});

module.exports = router;