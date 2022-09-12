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
    uploadImage
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
    checkMomentExists
} = require("../middleware/fileupload");

const momentRoutes = Router();

momentRoutes.use(authenticateToken);
momentRoutes
    .route("/")
    .get(getMoments)
    .post(validateMomentSchema, createNewMoment);
momentRoutes
    .route("/:id")
    .get(getMomentById)
    .put(validateMomentSchema, updateMoment)
    .delete(deleteMoment);
momentRoutes
    .route("/:id/images")
    .post(
        checkMomentExists,
        fileUpload({ createParentPath: true }),
        checkFileExists,
        validateExtensions([".jpg", ".jpeg", ".png"]),
        checkFileLimit,
        uploadImage
    );
momentRoutes
    .route("/:id/likes")
    .get(getMomentLikes)
    .post(likeMoment)
    .delete(stopLikingMoment);
momentRoutes
    .route("/:id/comments")
    .post(validateMomentCommentSchema, addComment)
    .get(getComments);
momentRoutes
    .route("/:id/comments/:commentId")
    .put(validateMomentCommentSchema, updateComment)
    .delete(deleteComment);

module.exports = momentRoutes;
