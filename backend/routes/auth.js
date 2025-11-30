const router = require("express").Router();
const AuthController = require("../controller/auth");
const User  = require("../models/user");
const AuthService = require("../services/auth");


const authService = new AuthService(User);
const authController = new AuthController(authService);


router.post("/signup", authController.signup);
router.post("/login", authController.login);

module.exports = router;
