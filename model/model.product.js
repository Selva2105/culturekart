const mongoose = require("mongoose");

// Define the product schema
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ['Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Toys', 'Beauty', 'Sports', 'Other'],
    },
    product_list: [
      {
        size: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: [true, "Stock Quantity is required"],
          default: 0,
        },
      },
    ],
    inStock: {
      type: Boolean,
      default: true,
    },
    images: [
      {
        type: String,
      },
    ],
    brand: String,
    modelNumber: {
      type: String,
      unique: true
    },
    manufacturer: String,
    releaseDate: Date,
    totalSales: {
      type: Number,
    },
    ratings: [
      {
        reviewer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User', // Reference to the User model
          required: true
        },
        rating: Number,
        review: String,
      },
    ],
  },
  { timestamps: true } // Add timestamps for createdAt and updatedAt
);

// Indexes for better performance in queries
productSchema.index({ name: 1 });
productSchema.index({ category: 1 });
productSchema.index({ "product_list.size": 1 });
productSchema.index({ inStock: 1 });

// Create the Product model
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
