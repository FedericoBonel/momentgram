const { StatusCodes } = require("http-status-codes");
const { SuccessPayload } = require("../payloads");

const { getUserById, deleteUserById } = require("../services/UserService");
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

module.exports = {
    getUser,
    getUserFollowers,
    getUserFollowings,
    getUserMoments,
    followUser,
    unfollowUser,
    deleteAccount
};
