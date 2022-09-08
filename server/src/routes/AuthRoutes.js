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

authRoutes.route("/login").post(validateLoginBody, verifyEmailPassword);
authRoutes.route("/register").post(validateUserSchema, signUpUser);

module.exports = authRoutes;
