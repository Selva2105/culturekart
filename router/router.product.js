const express = require("express");
const {
  createProduct,
  getProducts,
  updateProduct,
  addQuantityPrice,
  deleteQuantityPrice,
  deleteProduct,
  getAllCaregory,
} = require("../controller/Product/controller.product");
const protect = require("../middleware/protectMiddleware");

// Create an instance of Express Router
const router = express.Router();

// Routes for handling product operations
router.route("/")
  .post(protect, createProduct) // Create a new product (Protected Route)
  .get(getProducts); // Get all products

router.route("/category")
  .get(getAllCaregory) // Get all product categories
  .patch(protect, updateProduct); // Update product details (Protected Route)

router.route("/:id")
  .patch(protect, updateProduct) // Update product details (Protected Route)
  .post(protect, addQuantityPrice) // Add quantity and price to a product (Protected Route)
  .delete(protect, deleteQuantityPrice, deleteProduct); // Delete a product (Protected Route)

module.exports = router;
