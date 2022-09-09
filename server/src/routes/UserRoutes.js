const { Router } = require("express");

const {
    getUser,
    getUserFollowers,
    getUserFollowings,
    getUserMoments,
} = require("../controllers/UserController");

const userRouter = Router();

userRouter.route("/:id").get(getUser);
userRouter.route("/:id/followers").get(getUserFollowers);
userRouter.route("/:id/following").get(getUserFollowings);
userRouter.route("/:id/moments").get(getUserMoments);

module.exports = userRouter;
