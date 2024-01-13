const express = require("express");
const { CreateUser, verifyUser } = require("../controller/User/controller.auth");
const { getUserDetailsById, wishlistHandler, kartHandler } = require("../controller/User/controller.user");
const protect = require("../middleware/protectMiddleware");

const router = express.Router();

router.route('/').post(CreateUser);
router.get('/', protect, getUserDetailsById)
router.route('/verify/:token').get(verifyUser);
router.route('/wishlist/:id').patch(protect, wishlistHandler);
router.route('/kart/:id').patch(protect, kartHandler);

module.exports = router