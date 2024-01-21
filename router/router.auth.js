const express = require("express");
const { loginUser, logoutUser } = require("../controller/User/controller.auth");

// Create an instance of Express Router
const router = express.Router();

// Route for user login using email and password
router.post('/', loginUser);

// Route for user logout
router.get('/logout', logoutUser);

// OAuth route for Google authentication
// https://www.youtube.com/watch?v=17xwTuidqZw
// router.get('/oauth', (req, res) => {

//   res.redirect('URL_HERE');
// });

// Export the router to be used in the main application
module.exports = router;
