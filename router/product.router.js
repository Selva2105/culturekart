const express = require('express');
const { validationResult } = require('express-validator');
const productValidators = require('../validators/productValidators');
const productController = require('../controller/product.controller');
const CustomError = require('../utils/customError');
const router = express.Router();

// Import the validator function


// Route to create a new product
router.post('/', productValidators, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const validationErrors = errors.array().map(err => `${err.msg} (${err.path}: ${err.value})`).join(', ');
        const customError = new CustomError(`Validation error: ${validationErrors}`, 400);
        next(customError);
    }
    // Call the controller function to create the product
    productController.createProduct(req, res, next);
});

module.exports = router;