const express = require("express");
const { OAuth2Client } = require('google-auth-library');
const { loginUser, logoutUser } = require("../controller/User/controller.auth");

// Create an instance of Express Router
const router = express.Router();

// Route for user login using email and password
router.post('/', loginUser);

// Route for user logout
router.get('/logout', logoutUser);

// OAuth route for Google authentication
// For more details, check out the provided YouTube link
// https://www.youtube.com/watch?v=17xwTuidqZw
// Note: It's recommended to include a meaningful comment or documentation link for OAuth routes
router.get('/oauth', (req, res) => {
  // Implement OAuth logic here
  // Redirect to the Google authentication URL
  res.redirect('URL_HERE');
});

// Export the router to be used in the main application
module.exports = router;
