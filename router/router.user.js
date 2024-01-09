const express = require("express");
const { CreateUser, loginUser } = require("../controller/User/controller.auth");

const router = express.Router();

router.route('/').post(CreateUser)

module.exports = router;