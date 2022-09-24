const { Router } = require("express");

const {
    getUser,
    getUsersByQuery,
    getUserFollowers,
    getUserFollowings,
    getUserMoments,
    followUser,
    unfollowUser,
    deleteAccount,
    updateUser,
    verifyUser,
    updateUserPassword,
} = require("../controllers/UserController");
const authenticateToken = require("../middleware/JwtAuth");

const userRouter = Router();

// Users -------------------------------------------------------------
userRouter
    .route("/")
    .all(authenticateToken)
    .get(getUsersByQuery)
    .delete(deleteAccount)
    .put(updateUser);
userRouter.route("/password").all(authenticateToken).post(updateUserPassword);
userRouter.route("/:id").get(authenticateToken, getUser);
// User followers -------------------------------------------------------------
userRouter
    .route("/:id/followers")
    .get(getUserFollowers)
    .post(authenticateToken, followUser)
    .delete(authenticateToken, unfollowUser);
// User followings -------------------------------------------------------------
userRouter.route("/:id/followings").get(getUserFollowings);
// User moments -------------------------------------------------------------
userRouter.route("/:id/moments").get(getUserMoments);
// User verification --------------------------------------------------------
userRouter.route("/verify/:verificationCode").get(verifyUser);

module.exports = userRouter;
