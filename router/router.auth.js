const express = require("express");
const { OAuth2Client } = require('google-auth-library')
const { loginUser, logoutUser } = require("../controller/User/controller.auth");

const router = express.Router();

router.post('/', loginUser);
router.get('/logout', logoutUser);

// oauth https://www.youtube.com/watch?v=17xwTuidqZw
module.exports = router;