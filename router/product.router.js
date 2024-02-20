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

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Route to update the product details by ID
router.patch('/productDetails/:id', productController.updateProductById);

// Route to update the product rating by ID
router.patch('/rating/:id', productController.addRatingToProductById);
router.delete('/:id', productController.deleteProductById);

module.exports = router;

