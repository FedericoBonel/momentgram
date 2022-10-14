const { StatusCodes } = require("http-status-codes");
const { SuccessPayload } = require("../payloads");

const userService = require("../services/UserService");
const momentService = require("../services/MomentService");
const followerService = require("../services/FollowerService");
const { logger, extractReqOriginData } = require("../services/LoggerService");

/** Gets user by id */
const getUser = async (req, res) => {
    const { _id: loggedUserId } = req.user;
    const { id: userId } = req.params;

    const user = await userService.getUserById(userId, loggedUserId);

    res.status(StatusCodes.OK).json(new SuccessPayload(user));

    logger.info(
        `User: ${loggedUserId} 
        Successfully got a user by id ${userId}`,
        {
            ...extractReqOriginData(req),
            action: "readUserById",
            target: userId,
        }
    );
};

/** Gets user by queries, if "q" set uses regex  */
const getUsersByQuery = async (req, res) => {
    const { _id: userId } = req.user;
    const { username, email, firstName, lastName, page, limit, q } = req.query;

    let filters = {};
    if (!q) {
        username && (filters.username = username);
        email && (filters.email = email);
        firstName && (filters.firstName = firstName);
        lastName && (filters.lastName = lastName);
    } else {
        filters.username = { $regex: q, $options: "i" };
    }

    const users = await userService.getUsersByFilters(
        filters,
        page && page,
        limit && limit,
        userId
    );

    logger.info(
        `User: ${userId} 
        Successfully got ${users.length} 
        users by query in page ${page}`,
        {
            ...extractReqOriginData(req),
            action: "readUsersByQuery",
            query: filters
        }
    );

    res.status(StatusCodes.OK).json(new SuccessPayload(users));
};

/** Gets the user followers  */
const getUserFollowers = async (req, res) => {
    const { id: userId } = req.params;
    const { page, limit } = req.query;

    const followers = await followerService.getFollowersOf(
        userId,
        page && page,
        limit && limit
    );

    logger.info(
        `User: ${req.user?.id} 
        Successfully got ${followers.length} 
        followers in page ${page} of user: ${userId}`,
        {
            ...extractReqOriginData(req),
            action: "readFollowers",
            target: userId,
        }
    );

    res.status(StatusCodes.OK).json(new SuccessPayload(followers));
};

/** Gets the user following */
const getUserFollowings = async (req, res) => {
    const { id: userId } = req.params;
    const { page, limit } = req.query;

    const followings = await followerService.getFollowingsOf(
        userId,
        page && page,
        limit && limit
    );

    logger.info(
        `User: ${req.user?.id} 
        Successfully got ${followings.length} 
        followings in page ${page} of user: ${userId}`,
        {
            ...extractReqOriginData(req),
            action: "readFollowings",
            target: userId,
        }
    );

    res.status(StatusCodes.OK).json(new SuccessPayload(followings));
};

/** Gets the user moments  */
const getUserMoments = async (req, res) => {
    const { id: userId } = req.params;
    const { page, limit } = req.query;

    const moments = await momentService.getMomentsOf(
        userId,
        page && page,
        limit && limit
    );

    logger.info(
        `User: ${req.user?.id} 
        Successfully got ${moments.length} 
        moments in page ${page} of user: ${userId}`,
        { ...extractReqOriginData(req), action: "readUserMoments", target: userId }
    );

    res.status(StatusCodes.OK).json(new SuccessPayload(moments));
};

/** Makes logged user start following the params user */
const followUser = async (req, res) => {
    const { id: followedId } = req.params;
    const { _id: followerId } = req.user;

    const followerObject = await followerService.follow(followerId, followedId);

    logger.info(
        `User: ${followerId} 
        Successfully followed ${followedId}`,
        { ...extractReqOriginData(req), action: "follow", target: followedId }
    );

    res.status(StatusCodes.CREATED).json(new SuccessPayload(followerObject));
};

/** Makes logged user stop following the params user */
const unfollowUser = async (req, res) => {
    const { id: followedId } = req.params;
    const { _id: followerId } = req.user;

    const followerObject = await followerService.stopFollowing(
        followerId,
        followedId
    );

    logger.info(
        `User: ${followerId} 
        Successfully unfollowed ${followedId}`,
        { ...extractReqOriginData(req), action: "unfollow", target: followedId }
    );

    res.status(StatusCodes.OK).json(new SuccessPayload(followerObject));
};

/** Deletes account of logged user */
const deleteAccount = async (req, res) => {
    const { _id: userId } = req.user;

    const deletedResult = await userService.deleteUserById(userId);

    logger.info(`User: ${userId} successfully deleted their account`, {
        ...extractReqOriginData(req),
        action: "deleteAccount",
    });

    res.status(StatusCodes.OK).json(new SuccessPayload(deletedResult));
};

/** Updated the logged user */
const updateUser = async (req, res) => {
    const { _id: userId } = req.user;
    const updatedUser = req.body;

    const savedUser = await userService.updateUserById(userId, updatedUser);

    logger.info(`User: ${userId} successfully updated their account`, {
        ...extractReqOriginData(req),
        action: "updateAccount",
        update: {
            username: updatedUser.username,
            name: `${updatedUser.firstName} ${updatedUser.lastName}`,
            desc: updatedUser.description,
        },
    });

    res.status(StatusCodes.OK).json(new SuccessPayload(savedUser));
};

/** Verifies the user email by verification code */
const verifyUser = async (req, res) => {
    const { verificationCode } = req.params;

    const verifiedUser = await userService.verifyUserAccount(verificationCode);

    logger.info(
        `User: ${verifiedUser._id} successfully verified their account`,
        {
            ...extractReqOriginData(req),
            action: "verifyAccount",
        }
    );

    res.status(StatusCodes.OK).json(new SuccessPayload(verifiedUser));
};

/** Updates the logged user password */
const updateUserPassword = async (req, res) => {
    const { _id: userId } = req.user;
    const { oldPassword, newPassword } = req.body;

    const userWithToken = await userService.updateUserPasswordById(
        userId,
        oldPassword,
        newPassword
    );

    logger.info(`User: ${userId} successfully updated their password`, {
        ...extractReqOriginData(req),
        action: "updatePassword",
    });

    res.status(StatusCodes.OK).json(new SuccessPayload(userWithToken));
};

/** Uploads a profile photo for the logged user */
const uploadImage = async (req, res) => {
    const { _id: userId } = req.user;
    const files = req.files;

    const updatedUser = await userService.addProfileImage(userId, files);

    logger.info(`User: ${userId} successfully updated their profile image`, {
        ...extractReqOriginData(req),
        action: "updateProfileImage",
        update: updatedUser.profileImg,
    });

    res.status(StatusCodes.CREATED).json(new SuccessPayload(updatedUser));
};

module.exports = {
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
    uploadImage,
};
