const { Router } = require("express");
const {
    verifyEmailPassword,
    signUpUser,
} = require("../controllers/AuthController");

const authRoutes = Router();

authRoutes.route("/login", verifyEmailPassword);
authRoutes.route("/register", signUpUser);

module.exports = authRoutes;
