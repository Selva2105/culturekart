const { Product } = require('../model/product.modal');
const asyncErrorHandler = require('../utils/asyncErrorHandler');
const CustomError = require('../utils/customError');
const ApiFeature = require('../utils/ApiFeature')

// Controller for handling product operations
const productController = {
    // Get all products
    getAllProducts: asyncErrorHandler(async (req, res) => {

        const productsQuery = new ApiFeature(Product.find(), req.query).filter().sort().limitFields().paginate();

        productsQuery.query.select('-__v -createdAt ');

        const products = await productsQuery.query;

        if (!products) {
            throw new CustomError('Products not found', 404);
        }
        res.status(200).json({
            status: 'success',
            message: 'Products fetched successfully',
            length: products.length,
            product: products
        });
    }),

    // Create a new product
    createProduct: asyncErrorHandler(async (req, res, next) => {

        if (Object.keys(req.body).length === 0) {
            const error = new CustomError("Give the required fields", 500);
            return next(error);
        }

        const newProduct = new Product(req.body);

        // Modify the createProduct method to exclude the 'createdAt' field from the response
        const savedProduct = await newProduct.save();

        res.status(201).json({
            status: 'success',
            message: 'Products created successfully',
            product: savedProduct
        });
    }),

    // Get a product by ID
    getProductById: asyncErrorHandler(async (req, res, next) => {
        const product = await Product.findById(req.params.id).select('--v,createdAt');

        if (!product) {
            throw new CustomError('Product not found', 404);
        }

        res.status(200).json({
            status: 'success',
            message: 'Product by id fetched sucessfully',
            product: product
        });
    }),

    // Update a product by ID
    // Update a product by ID
    updateProductById: asyncErrorHandler(async (req, res, next) => {
        console.log(req.body);

        // Check if the request body tries to update the seller field
        if (req.body.seller) {
            const error = new CustomError("Updating the seller field is not allowed", 400);
            return next(error);
        }

        // If variants are provided, ensure they are in the expected format and do not allow ratings updates
        if (req.body.variants) {
            if (!Array.isArray(req.body.variants) || req.body.variants.length === 0) {
                const error = new CustomError("Variants provided must be in an array format", 400);
                return next(error);
            }

            // Check each variant for ratings, assuming you want to disallow direct ratings updates
            const ratingsUpdateAttempt = req.body.variants.some(variant => variant.ratings && variant.ratings.length > 0);
            if (ratingsUpdateAttempt) {
                const error = new CustomError("Editing ratings directly is not allowed", 400);
                return next(error);
            }
        }

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        if (!updatedProduct) {
            throw new CustomError('Product not found', 404);
        }

        res.status(200).json({
            status: 'success',
            message: 'Product by id updated successfully',
            product: updatedProduct
        });
    }),

    // Add a rating to a product by ID
    // Add a rating to a product variant by ID
    addRatingToProductById: asyncErrorHandler(async (req, res, next) => {
        const { variantId, ratings } = req.body;

        if (!ratings || !variantId) {
            const error = new CustomError("Variant ID and rating are required", 400);
            return next(error);
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            throw new CustomError('Product not found', 404);
        }

        // Find the variant by ID using the variantId provided in the request body
        const variant = product.variants.id(variantId);
        if (!variant) {
            throw new CustomError('Variant not found', 404);
        }

        // Add the new rating to the variant's ratings array
        variant.ratings.push(ratings);

        await product.save();

        res.status(200).json({
            status: 'success',
            message: 'Rating added to product variant successfully',
            product: product
        });
    }),

    // Delete a product by ID
    deleteProductById: asyncErrorHandler(async (req, res, next) => {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            throw new CustomError('Product not found', 404);
        }
        res.status(200).json({
            status: 'success',
            message: 'Product deleted successfully'
        });
    })
};

module.exports = productController;