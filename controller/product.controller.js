const { Product } = require('../model/product.modal');
const asyncErrorHandler = require('../utils/asyncErrorHandler');
const CustomError = require('../utils/customError');

// Controller for handling product operations
const productController = {
    // Get all products
    getAllProducts: asyncErrorHandler(async (req, res) => {
        const products = await Product.find();
        if (!products) {
            throw new CustomError('Products not found', 404);
        }
        res.json(products);
    }),

    // Create a new product
    createProduct: asyncErrorHandler(async (req, res) => {

        if (Object.keys(req.body).length === 0) {
            const error = new CustomError("Give the required fields", 500);
            return next(error);
        }

        const newProduct = new Product(req.body);

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    }),

    // Get a product by ID
    getProductById: asyncErrorHandler(async (req, res) => {
        const product = await Product.findById(req.params.id);
        if (!product) {
            throw new CustomError('Product not found', 404);
        }
        res.json(product);
    }),

    // Update a product by ID
    updateProduct: asyncErrorHandler(async (req, res) => {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) {
            throw new CustomError('Product not found', 404);
        }
        res.json(updatedProduct);
    }),

    // Delete a product by ID
    deleteProduct: asyncErrorHandler(async (req, res) => {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            throw new CustomError('Product not found', 404);
        }
        res.json({ message: 'Product deleted successfully' });
    })
};

module.exports = productController;