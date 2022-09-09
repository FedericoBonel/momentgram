const { Router } = require("express");

const { getUser, getUserFollowers, getUserFollowings } = require("../controllers/UserController");

const userRouter = Router();

userRouter.route("/:id").get(getUser);
userRouter.route("/:id/followers").get(getUserFollowers);
userRouter.route("/:id/following").get(getUserFollowings);
userRouter.route("/:id/moments").get();

module.exports = userRouter;
