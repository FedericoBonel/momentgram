const { Router } = require("express");
const fileUpload = require("express-fileupload");

const {
    getMoments,
    getMomentById,
    createNewMoment,
    deleteMoment,
    updateMoment,
    getMomentLikes,
    likeMoment,
    stopLikingMoment,
    addComment,
    getComments,
    updateComment,
    deleteComment,
    uploadImage,
} = require("../controllers/MomentController");
const authenticateToken = require("../middleware/JwtAuth");
const {
    validateMomentSchema,
    validateMomentCommentSchema,
} = require("../middleware/validators/MomentValidator");
const {
    validateExtensions,
    checkFileExists,
    checkFileLimit,
} = require("../middleware/fileupload");

const momentRoutes = Router();

momentRoutes.use(authenticateToken);

// Moments -------------------------------------------------------------
momentRoutes
    .route("/")
    .get(getMoments)
    .post(validateMomentSchema, createNewMoment);
momentRoutes
    .route("/:id")
    .get(getMomentById)
    .put(validateMomentSchema, updateMoment)
    .delete(deleteMoment);
// Moment images -------------------------------------------------------------
momentRoutes
    .route("/:id/images")
    .post(
        fileUpload({ createParentPath: true }),
        checkFileExists,
        validateExtensions([".jpg", ".jpeg", ".png"]),
        checkFileLimit,
        uploadImage
    );
// Moment likes -------------------------------------------------------------
momentRoutes
    .route("/:id/likes")
    .get(getMomentLikes)
    .post(likeMoment)
    .delete(stopLikingMoment);
// Moment comments -------------------------------------------------------------
momentRoutes
    .route("/:id/comments")
    .post(validateMomentCommentSchema, addComment)
    .get(getComments);
momentRoutes
    .route("/:id/comments/:commentId")
    .put(validateMomentCommentSchema, updateComment)
    .delete(deleteComment);

module.exports = momentRoutes;
