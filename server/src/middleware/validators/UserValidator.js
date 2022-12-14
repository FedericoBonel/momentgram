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
        .withMessage("Username must be a string with length 4 to 20"),
    body("password")
        .isString()
        .withMessage("Please provide a password")
        .isLength({ min: 4, max: 100 })
        .withMessage("Username must be a string with length 4 to 100"),
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("firstName")
        .isString()
        .withMessage("Please provide a first name")
        .isLength({ min: 2, max: 50 })
        .withMessage("fistName must be 2 to 50 characters long"),
    body("lastName")
        .isString("Please provide a last name")
        .isLength({ min: 2, max: 50 })
        .withMessage("lastName must be 2 to 50 characters long"),
    body("birthDate").isISO8601().withMessage("Please provide a valid date"),
    body("description")
        .isString()
        .isLength({ min: 1, max: 150 })
        .withMessage("Description must be 1 to 150 characters long")
        .optional(),
    checkValidation,
];

/**
 * Set of rules that validates a User update schema
 */
const validateUserUpdateSchema = [
    body("username")
        .isString()
        .isLength({ min: 4, max: 20 })
        .withMessage("Username must be a string with length 4 to 20")
        .optional(),
    body("email")
        .isEmail()
        .withMessage("Please provide a valid email")
        .optional(),
    body("firstName")
        .isString()
        .isLength({ min: 2, max: 50 })
        .withMessage("fistName must be 2 to 50 characters long")
        .optional(),
    body("lastName")
        .isString()
        .isLength({ min: 2, max: 50 })
        .withMessage("lastName must be 2 to 50 characters long")
        .optional(),
    body("birthDate")
        .isISO8601()
        .withMessage("Please provide a valid date")
        .optional(),
    body("description")
        .isString()
        .isLength({ min: 1, max: 150 })
        .withMessage("Description must be 1 to 150 characters long")
        .optional(),
    checkValidation,
];

const validatePasswordUpd = [
    body("oldPassword")
        .isString()
        .withMessage("Please provide the previous password")
        .isLength({ min: 4, max: 100 })
        .withMessage("Previous Password must be a string with length 4 to 100"),
    body("newPassword")
        .isString()
        .withMessage("Please provide the new password")
        .isLength({ min: 4, max: 100 })
        .withMessage("New Password must be a string with length 4 to 100"),
    checkValidation,
];

module.exports = {
    validateLoginBody,
    validateUserSchema,
    validateUserUpdateSchema,
    validatePasswordUpd,
};
