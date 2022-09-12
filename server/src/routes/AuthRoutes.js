const { Router } = require("express");

const {
    verifyEmailPassword,
    signUpUser,
} = require("../controllers/AuthController");
const {
    validateLoginBody,
    validateUserSchema,
} = require("../middleware/validators/AuthValidator");

const authRoutes = Router();

// User Login -------------------------------------------------------------
authRoutes.route("/login").post(validateLoginBody, verifyEmailPassword);
// User Registration -------------------------------------------------------------
authRoutes.route("/register").post(validateUserSchema, signUpUser);

module.exports = authRoutes;
