// Import necessary modules
const { body, check } = require('express-validator');
const { categoryEnum } = require('../model/product.modal');

// Define productValidators for product.modal.js

const validateProduct = [
    body('name').isString().withMessage('Name must be a string').notEmpty().withMessage('Name is required'),
    body('description').isString().withMessage('Description must be a string').notEmpty().withMessage('Description is required'),
    body('category').isIn(categoryEnum).withMessage(`Category must be one of the following: ${categoryEnum.join(', ')}`),
    body('seller').isMongoId().withMessage('Seller must be a valid MongoDB ObjectId'),
    check('variants').custom((value, { req }) => {
        if (value.length === 0) {
            throw new Error('Variants must not be empty');
        }
        return true;
    }),    
    body('variants.*.name').isString().withMessage('Variant name must be a string').notEmpty().withMessage('Variant name is required'),
    body('variants.*.price').isNumeric().withMessage('Variant price must be a number').notEmpty().withMessage('Variant price is required'),
    body('variants.*.images').isArray().withMessage('Variant images must be an array'),
    body('variants.*.stock').isNumeric().withMessage('Variant stock must be a number').notEmpty().withMessage('Variant stock is required'),
    body('variants.*.isAvailable').isBoolean().withMessage('Variant availability must be a boolean'),
    body('variants.*.ratings').optional().isArray().withMessage('Variant ratings must be an array'),
    body('variants.*.ratings.*.user').optional().isMongoId().withMessage('Rating user must be a valid MongoDB ObjectId'),
    body('variants.*.ratings.*.rating').optional().isNumeric().withMessage('Rating must be a number'),
    body('variants.*.ratings.*.comment').optional().isString().withMessage('Rating comment must be a string'),
];

module.exports = validateProduct;