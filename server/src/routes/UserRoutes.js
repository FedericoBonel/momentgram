const { Router } = require("express");
const fileUpload = require("express-fileupload");

const userController = require("../controllers/UserController");
const authenticateToken = require("../middleware/JwtAuth");
const fileUploadMiddleware = require("../middleware/fileupload");
const userValidator = require("../middleware/validators/UserValidator");

const userRouter = Router();

// Users -------------------------------------------------------------
userRouter
    .route("/")
    .all(authenticateToken)
    .get(userController.getUsersByQuery)
    .delete(userController.deleteAccount)
    .put(userValidator.validateUserUpdateSchema, userController.updateUser);
userRouter
    .route("/password")
    .all(authenticateToken)
    .post(userValidator.validatePasswordUpd, userController.updateUserPassword);
userRouter
    .route("/image")
    .all(authenticateToken)
    .post(
        fileUpload({ createParentPath: true }),
        fileUploadMiddleware.checkFileExists,
        fileUploadMiddleware.validateExtensions([".jpg", ".jpeg", ".png"]),
        fileUploadMiddleware.checkFileLimit,
        userController.uploadImage
    );
userRouter.route("/:id").get(authenticateToken, userController.getUser);
// User followers -------------------------------------------------------------
userRouter
    .route("/:id/followers")
    .get(userController.getUserFollowers)
    .post(authenticateToken, userController.followUser)
    .delete(authenticateToken, userController.unfollowUser);
// User followings -------------------------------------------------------------
userRouter.route("/:id/followings").get(userController.getUserFollowings);
// User moments -------------------------------------------------------------
userRouter.route("/:id/moments").get(userController.getUserMoments);
// User verification --------------------------------------------------------
userRouter.route("/verify/:verificationCode").get(userController.verifyUser);

module.exports = userRouter;
