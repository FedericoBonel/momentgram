const { Router } = require("express");

const authController = require("../controllers/AuthController");
const userValidator = require("../middleware/validators/userValidator");

const authRoutes = Router();

// User Login -------------------------------------------------------------
authRoutes
    .route("/login")
    .post(userValidator.validateLoginBody, authController.verifyEmailPassword);
// User Registration -------------------------------------------------------------
authRoutes
    .route("/register")
    .post(userValidator.validateUserSchema, authController.signUpUser);

module.exports = authRoutes;
