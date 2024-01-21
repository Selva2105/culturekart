const express = require("express");
const { CreateUser, verifyUser } = require("../controller/User/controller.auth");
const { getUserDetailsById, wishlistHandler, kartHandler } = require("../controller/User/controller.user");
const protect = require("../middleware/protectMiddleware");
const multer = require("multer");
const verifiedUser = require("../middleware/verifiedUserMiddleware");

// Create an instance of Express Router
const router = express.Router();

// Multer storage configuration for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Route for creating a new user with an optional profile image upload
router.post("/", upload.single("image"), CreateUser);

// Route for getting user details (Protected Route)
router.get('/', protect, getUserDetailsById);

// Routes for verifying user email based on the provided token
router.route('/verify/:token').get(verifyUser);

// Routes for handling wishlist operations (Protected Route)
router.route('/wishlist/:id').patch(protect, wishlistHandler);

// Routes for handling shopping cart (kart) operations (Protected Route)
router.route('/kart/:id').patch(protect, kartHandler);

module.exports = router;