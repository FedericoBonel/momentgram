const { Router } = require("express");

const {
    getUser,
    getUserFollowers,
    getUserFollowings,
    getUserMoments,
    followUser,
    unfollowUser,
    deleteAccount,
} = require("../controllers/UserController");
const authenticateToken = require("../middleware/JwtAuth");

const userRouter = Router();

userRouter.route("/").delete(authenticateToken, deleteAccount);
userRouter.route("/:id").get(authenticateToken, getUser);
userRouter
    .route("/:id/followers")
    .get(getUserFollowers)
    .post(authenticateToken, followUser)
    .delete(authenticateToken, unfollowUser);
userRouter.route("/:id/followings").get(getUserFollowings);
userRouter.route("/:id/moments").get(getUserMoments);

module.exports = userRouter;
