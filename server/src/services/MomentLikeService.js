const { BadRequestError } = require("../errors");
const momentLikeRepository = require("../repositories/MomentLikeRepository");

/**
 * Gets like object by creator id and moment id
 * @param {String} userId Like creator id
 * @param {String} momentId Moment id
 * @returns The like object or undefined if not found
 */
const getLikeByUserAndMoment = async (userId, momentId) => {
    const likes = await momentLikeRepository.getLikeBy({
        moment: momentId,
        createdBy: userId,
    });

    return likes.length ? likes[0] : undefined;
};

/**
 * Gets the number of likes of the specific moment 
 * @param {String} momentId Moment id
 * @returns The number of likes of the moment
 */
const getNumberLikesOf = async (momentId) => {
    return await momentLikeRepository.getNumberLikesBy({ moment: momentId });
};

/**
 * Gets the users that liked the specific moment
 * @param {*} momentId Moment id
 * @param {*} page Page number of the user list
 * @param {*} limit Number of users per page
 * @returns Array of like objects of that specific moment
 */
const getLikesOf = async (momentId, page = 1, limit = 20) => {
    const skip = (page - 1) * limit;

    const likes = await momentLikeRepository.getLikeBy(
        { moment: momentId },
        skip,
        limit
    );

    return likes.map((like) => toLikeDTO(like));
};

/**
 * Extracts the public information of a like object
 * @param {*} like Like object to be transformed
 * @returns Relevant information of the like object
 */
const toLikeDTO = (like) => {
    return {
        _id: like._id,
        createdBy: {
            _id: like.createdBy._id,
            username: like.createdBy.username,
            email: like.createdBy.email,
            profileImg: like.createdBy.profileImg,
        },
        createdAt: like.createdAt,
    };
};

/**
 * Creates a new like from the user to the moment
 * @param {*} userId User id
 * @param {*} momentId Moment id
 * @throws {BadRequestError} if the user already liked the moment
 * @returns Created like
 */
const addLikeTo = async (userId, momentId) => {
    const savedLike = await momentLikeRepository.getLikeBy({
        createdBy: userId,
        moment: momentId,
    });

    if (savedLike.length > 0) {
        throw new BadRequestError("The post is already liked by the user");
    }

    return await momentLikeRepository.createLike({
        moment: momentId,
        createdBy: userId,
    });
};

/**
 * Deletes an existing like from the user to the moment
 * @param {*} userId User id
 * @param {*} momentId Moment id
 * @returns Deleted like
 */
const deleteLikeFrom = async (userId, momentId) => {
    return await momentLikeRepository.deleteLikeBy({
        moment: momentId,
        createdBy: userId,
    });
};

module.exports = {
    getLikeByUserAndMoment,
    getNumberLikesOf,
    getLikesOf,
    addLikeTo,
    deleteLikeFrom,
};
