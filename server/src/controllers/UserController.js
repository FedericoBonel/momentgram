const { StatusCodes } = require("http-status-codes");
const { SuccessPayload } = require("../payloads");

const {
    getUserById,
    getUsersByFilters,
    deleteUserById,
    updateUserById,
    verifyUserAccount,
    updateUserPasswordById,
    addProfileImage,
} = require("../services/UserService");
const { getMomentsOf } = require("../services/MomentService");
const {
    getFollowersOf,
    getFollowingsOf,
    follow,
    stopFollowing,
} = require("../services/FollowerService");

const getUser = async (req, res) => {
    const { _id: loggedUserId } = req.user;
    const { id: userId } = req.params;

    const user = await getUserById(userId, loggedUserId);

    res.status(StatusCodes.OK).json(new SuccessPayload(user));
};

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

    const users = await getUsersByFilters(
        filters,
        page && page,
        limit && limit,
        userId
    );

    res.status(StatusCodes.OK).json(new SuccessPayload(users));
};

const getUserFollowers = async (req, res) => {
    const { id: userId } = req.params;
    const { page, limit } = req.query;

    const followers = await getFollowersOf(
        userId,
        page && page,
        limit && limit
    );

    res.status(StatusCodes.OK).json(new SuccessPayload(followers));
};

const getUserFollowings = async (req, res) => {
    const { id: userId } = req.params;
    const { page, limit } = req.query;

    const followings = await getFollowingsOf(
        userId,
        page && page,
        limit && limit
    );

    res.status(StatusCodes.OK).json(new SuccessPayload(followings));
};

const getUserMoments = async (req, res) => {
    const { id: userId } = req.params;
    const { page, limit } = req.query;

    const moments = await getMomentsOf(userId, page && page, limit && limit);

    res.status(StatusCodes.OK).json(new SuccessPayload(moments));
};

const followUser = async (req, res) => {
    const { id: followedId } = req.params;
    const { _id: followerId } = req.user;

    const followerObject = await follow(followerId, followedId);

    res.status(StatusCodes.CREATED).json(new SuccessPayload(followerObject));
};

const unfollowUser = async (req, res) => {
    const { id: followedId } = req.params;
    const { _id: followerId } = req.user;

    const followerObject = await stopFollowing(followerId, followedId);

    res.status(StatusCodes.OK).json(new SuccessPayload(followerObject));
};

const deleteAccount = async (req, res) => {
    const { _id: userId } = req.user;

    const deletedResult = await deleteUserById(userId);

    res.status(StatusCodes.OK).json(new SuccessPayload(deletedResult));
};

const updateUser = async (req, res) => {
    const { _id: userId } = req.user;
    const updatedUser = req.body;

    const savedUser = await updateUserById(userId, updatedUser);

    res.status(StatusCodes.OK).json(new SuccessPayload(savedUser));
};

const verifyUser = async (req, res) => {
    const { verificationCode } = req.params;

    const verifiedUser = await verifyUserAccount(verificationCode);

    res.status(StatusCodes.OK).json(new SuccessPayload(verifiedUser));
};

const updateUserPassword = async (req, res) => {
    const { _id: userId } = req.user;
    const { oldPassword, newPassword } = req.body;

    const userWithToken = await updateUserPasswordById(
        userId,
        oldPassword,
        newPassword
    );

    res.status(StatusCodes.OK).json(new SuccessPayload(userWithToken));
};

const uploadImage = async (req, res) => {
    const { _id: userId } = req.user;
    const files = req.files;

    const updatedUser = await addProfileImage(userId, files);

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
