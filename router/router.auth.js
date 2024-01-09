const express = require("express");
const { OAuth2Client } = require('google-auth-library')
const { loginUser } = require("../controller/User/controller.auth");

const router = express.Router();

router.route('/').post(loginUser)

// oauth https://www.youtube.com/watch?v=17xwTuidqZw
module.exports = router;