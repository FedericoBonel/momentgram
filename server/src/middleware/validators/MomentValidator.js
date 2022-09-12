const { body } = require("express-validator");
const checkValidation = require("./CheckValidation");

/**
 * Set of rules that validates a Moment schema
 */
const validateMomentSchema = [
    body("location")
        .isString()
        .withMessage("Please provide a location")
        .isLength({ min: 4, max: 50 })
        .withMessage("Location must be a string with length 4 to 20"),
    body("description")
        .isString()
        .isLength({ max: 256 })
        .withMessage("Description must be at most 256 characters long")
        .optional(),
    checkValidation,
];

/**
 * Set of rules that validates a Moment comment schema
 */
 const validateMomentCommentSchema = [
    body("comment")
        .isString()
        .withMessage("Please provide a comment")
        .isLength({ min: 1, max: 256 })
        .withMessage("Comment must be a string with length 1 to 256"),
    checkValidation,
];

module.exports = { validateMomentSchema, validateMomentCommentSchema };
