const { StatusCodes } = require("http-status-codes");
const { SuccessPayload } = require("../payloads");

const { getUserById } = require("../services/UserService");
const { getMomentsOf } = require("../services/MomentService");
const {
    getFollowersOf,
    getFollowingsOf,
} = require("../services/FollowerService");

const getUser = async (req, res) => {
    const { id: userId } = req.params;

    const user = await getUserById(userId);

    res.status(StatusCodes.OK).json(new SuccessPayload(user));
};

const getUserFollowers = async (req, res) => {
    const { id: userId } = req.params;
    const { page, limit } = req.query;

    const followers = await getFollowersOf(userId, page && page, limit && limit);

    res.status(StatusCodes.OK).json(new SuccessPayload(followers));
};

const getUserFollowings = async (req, res) => {
    const { id: userId } = req.params;
    const { page, limit } = req.query;

    const followings = await getFollowingsOf(userId, page && page, limit && limit);

    res.status(StatusCodes.OK).json(new SuccessPayload(followings))
}

const getUserMoments = async (req, res) => {
    const { id: userId } = req.params;
    const { page, limit } = req.query;

    const moments = await getMomentsOf(userId, page && page, limit && limit);

    res.status(StatusCodes.OK).json(new SuccessPayload(moments))
}

module.exports = { getUser, getUserFollowers, getUserFollowings, getUserMoments };
