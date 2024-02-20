const mongoose = require('mongoose');

const categoryEnum = ['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Beauty',
    'Toys', 'Sports & Outdoors', 'Automotive', 'Health & Personal Care', 'Jewelry',
    'Tools & Home Improvement', 'Grocery', 'Movies & TV', 'Music', 'Pet Supplies',
    'Baby', 'Office Products', 'Video Games', 'Industrial & Scientific',
    'Arts, Crafts & Sewing', 'Software', 'Luggage', 'Musical Instruments',
    'Furniture', 'Garden & Outdoor'];

const variantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true
    },
    price: {
        type: Number,
        required: true,
        index: true
    },
    images: [String],
    stock: {
        type: Number,
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    ratings: [{
        _id: false, 
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        rating: {
            type: Number,
            required: true
        },
        comment: {
            type: String,
            required: true
        }
    }]
});

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: categoryEnum,
        required: true,
        index: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    variants: [variantSchema],
}, { timestamps: true });

// Create a compound index on the name and seller fields
productSchema.index({ name: 1, seller: 1 }, { unique: true });

const Product = mongoose.model('Product', productSchema);

module.exports = { Product, categoryEnum };