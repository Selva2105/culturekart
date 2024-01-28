const express = require("express");
const { CreateUser, verifyUser } = require("../controller/User/controller.auth");
const { getUserDetailsById, wishlistHandler, kartHandler, premiumUser } = require("../controller/User/controller.user");
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
router.get('/', getUserDetailsById);

// Routes for verifying user email based on the provided token
router.post('/verifyUser/:token',verifyUser);

// Routes for handling wishlist operations (Protected Route)
router.patch('/wishlist/:id',protect, wishlistHandler);

// Routes for handling shopping cart (kart) operations (Protected Route)
router.patch('/kart/:id',protect, kartHandler);

router.patch('/premium_member', protect, verifiedUser, premiumUser)

module.exports = router;