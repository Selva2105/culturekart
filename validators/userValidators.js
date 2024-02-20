const { body } = require('express-validator');

const userValidators = {
    validateUserFields: [
        // User fields validators
        body('firstName').isString().notEmpty(),
        body('lastName').isString().notEmpty(),
        body('userName').isString().notEmpty(),
        body('email').isEmail(),
        body('password').isLength({ min: 6 }),
        body('confirmPassword').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),
        body('phone.country_code').isString().notEmpty(),
        body('phone.number').matches(/^\+[1-9]\d{1,14}$/).withMessage('Phone number must be in international format'),
        body('dateOfBirth').isISO8601().toDate(),
    ],

    validateAddressFields: [
        // Address fields validators
        body('addresses.*.type').isIn(['billing', 'shipping']),
        body('addresses.*.street').isString().notEmpty(),
        body('addresses.*.city').isString().notEmpty(),
        body('addresses.*.district').isString().notEmpty(),
        body('addresses.*.state').isString().notEmpty(),
        body('addresses.*.country').isString().notEmpty(),
        body('addresses.*.pincode').isString().notEmpty(),
    ]
};

module.exports = userValidators;