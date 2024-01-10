const express = require("express");
const { CreateUser } = require("../controller/User/controller.auth");
const { getUserDetailsById } = require("../controller/User/controller.user");
const protect = require("../middleware/protectMiddleware");

const router = express.Router();

router.route('/').post(CreateUser);
router.get('/', protect, getUserDetailsById)

module.exports = router