const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const passport = require("passport");

// Маршрути автентифікації
router.get("/register", authController.getRegisterPage);
router.post("/register", authController.register);
router.get("/login", authController.getLoginPage);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

module.exports = router;
