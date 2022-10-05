const { Router } = require("express");
const fileUpload = require("express-fileupload");

const momentController = require("../controllers/MomentController");
const authenticateToken = require("../middleware/JwtAuth");
const momentValidator = require("../middleware/validators/MomentValidator");
const fileUploadValidator = require("../middleware/fileupload");

const momentRoutes = Router();

momentRoutes.use(authenticateToken);

// Moments -------------------------------------------------------------
momentRoutes
    .route("/")
    .get(momentController.getMoments)
    .post(
        momentValidator.validateMomentSchema,
        momentController.createNewMoment
    );
momentRoutes
    .route("/:id")
    .get(momentController.getMomentById)
    .put(momentValidator.validateMomentSchema, momentController.updateMoment)
    .delete(momentController.deleteMoment);
// Moment images -------------------------------------------------------------
momentRoutes
    .route("/:id/images")
    .post(
        fileUpload({ createParentPath: true }),
        fileUploadValidator.checkFileExists,
        fileUploadValidator.validateExtensions([".jpg", ".jpeg", ".png"]),
        fileUploadValidator.checkFileLimit,
        momentController.uploadImage
    );
// Moment likes -------------------------------------------------------------
momentRoutes
    .route("/:id/likes")
    .get(momentController.getMomentLikes)
    .post(momentController.likeMoment)
    .delete(momentController.stopLikingMoment);
// Moment comments -------------------------------------------------------------
momentRoutes
    .route("/:id/comments")
    .post(
        momentValidator.validateMomentCommentSchema,
        momentController.addComment
    )
    .get(momentController.getComments);
momentRoutes
    .route("/:id/comments/:commentId")
    .put(
        momentValidator.validateMomentCommentSchema,
        momentController.updateComment
    )
    .delete(momentController.deleteComment);

module.exports = momentRoutes;
