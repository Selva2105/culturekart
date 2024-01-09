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

const router = express.Router();

router.route("/").post(createProduct).get(getProducts);
router.route("/category").get(getAllCaregory);

router.route("/:id").patch(updateProduct).post(addQuantityPrice).delete(deleteQuantityPrice).delete(deleteProduct);
router.route("/:id/delete").delete(deleteProduct);

module.exports = router;
