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

const router = express.Router();

router.route("/").post(createProduct).get(getProducts);
router.route("/category").get(getAllCaregory);

router.route("/:id").patch(protect, updateProduct).post(protect, addQuantityPrice).delete(protect, deleteQuantityPrice).delete(protect, deleteProduct);
router.route("/:id/delete").delete(protect, deleteProduct);

module.exports = router;
