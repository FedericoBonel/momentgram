const { body } = require("express-validator");

const checkValidation = require("./CheckValidation");

/**
 * Set of rules that validates a Login payload request
 */
const validateLoginBody = [
    body("password").isString().withMessage("Please provide a password"),
    body("email").isEmail().withMessage("Please provide a valid email"),
    checkValidation,
];

/**
 * Set of rules that validates a User schema
 */
const validateUserSchema = [
    body("username")
        .isString()
        .withMessage("Please provide a name")
        .isLength({ min: 4, max: 20 })
        .withMessage("Name must be a string with length 4 to 20"),
    body("password").isString().withMessage("Please provide a password"),
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("firstName")
        .isString()
        .withMessage("Please provide a first name")
        .isLength({ min: 2, max: 50 })
        .withMessage("fistName must be 2 to 50 characters long"),
    body("lastName")
        .isString("Please provide a last name")
        .isLength({ min: 2, max: 50 })
        .withMessage("lastName must be 2, to 50 characters long"),
    body("birthDate").isISO8601().withMessage("Please provide a valid date"),
    checkValidation,
];

module.exports = { validateLoginBody, validateUserSchema };
