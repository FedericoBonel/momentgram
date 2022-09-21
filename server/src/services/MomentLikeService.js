const { BadRequestError } = require("../errors");
const {
    getNumberLikesBy,
    getLikeBy,
    createLike,
    deleteLikeBy,
} = require("../repositories/MomentLikeRepository");

const getLikeByUserAndMoment = async (userId, momentId) => {
    const likes = await getLikeBy({ moment: momentId, createdBy: userId });

    return likes.length ? likes[0] : undefined;
};

const getNumberLikesOf = async (momentId) => {
    return await getNumberLikesBy({ moment: momentId });
};

const getLikesOf = async (momentId, page = 1, limit = 20) => {
    const skip = (page - 1) * limit;

    const likes = await getLikeBy({ moment: momentId }, skip, limit);

    return createListOfLikeBodies(likes);
};

const createListOfLikeBodies = (likes) => {
    return likes.map((like) => createLikeBody(like));
};

const createLikeBody = (like) => {
    return {
        _id: like._id,
        createdBy: {
            _id: like.createdBy._id,
            username: like.createdBy.username,
            email: like.createdBy.username,
        },
        createdAt: like.createdAt,
    };
};

const addLikeTo = async (userId, momentId) => {
    const savedLike = await getLikeBy({ createdBy: userId, moment: momentId });

    if (savedLike.length > 0) {
        throw new BadRequestError("The post is already liked by the user");
    }

    return await createLike({ moment: momentId, createdBy: userId });
};

const deleteLikeFrom = async (userId, momentId) => {
    return await deleteLikeBy({ moment: momentId, createdBy: userId });
};

module.exports = {
    getLikeByUserAndMoment,
    getNumberLikesOf,
    getLikesOf,
    addLikeTo,
    deleteLikeFrom,
};
