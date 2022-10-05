const { NotFoundError, BadRequestError } = require("../errors");
const followerRepository = require("../repositories/FollowerRepository");

/**
 * Gets a list of the followers of the given user
 * @param {*} userId Id of the user
 * @param {*} page Page of the list of followers
 * @param {*} limit Maximum number of followers per page
 * @returns List of the followers of the given user
 */
const getFollowersOf = async (userId, page = 1, limit = 20) => {
    const skip = (page - 1) * limit;

    // Get the follower objects where the user is the one followed
    // and populate the user that follows them
    const followedFollowing = await followerRepository.getFollowerBy(
        { followed: userId },
        skip,
        limit,
        "follower"
    );

    // Return only relevant information
    return followedFollowing.map(({ follower }) => ({
        _id: follower._id,
        email: follower.email,
        username: follower.username,
        profileImg: follower.profileImg,
    }));
};

/**
 * Gets a list of the followings of the given user
 * @param {*} userId Id of the user
 * @param {*} page Page of the list of followings
 * @param {*} limit Maximum number of followings per page
 * @returns List of the followings of the given user
 */
const getFollowingsOf = async (userId, page = 1, limit = 20) => {
    const skip = (page - 1) * limit;

    // Get the follower objects where the user is the one following
    // and populate the user that is being followed by them
    const followedFollowing = await followerRepository.getFollowerBy(
        { follower: userId },
        skip,
        limit,
        "followed"
    );

    return followedFollowing.map(({ followed }) => ({
        _id: followed._id,
        email: followed.email,
        username: followed.username,
        profileImg: followed.profileImg,
    }));
};

/**
 * Gets the number of followers of the user
 * @param {String} userId Id of the user
 * @returns The number of followers for that user
 */
const getNumberFollowersOf = async (userId) => {
    return await followerRepository.getTotalFollowersBy({ followed: userId });
};

/**
 * Gets the number of followings of the user
 * @param {String} userId Id of the user
 * @returns The number of followings for that user
 */
const getNumberFollowingOf = async (userId) => {
    return await followerRepository.getTotalFollowersBy({ follower: userId });
};

/**
 * Checks if the follower follows the followed
 * @param {*} followerId Id of the user that follows
 * @param {*} followedId Id of the user that is being followed
 * @returns True if the follower follows the followed, false otherwise
 */
const checkFollows = async (followerId, followedId) => {
    const followerObject = await followerRepository.getFollowerBy({
        follower: followerId,
        followed: followedId,
    });

    return followerObject.length > 0;
};

/**
 * Makes the follower start following the followed
 * @param {*} followerId Id of the user that is to be follower
 * @param {*} followedId Id of the user that is to be followed
 * @throws {BadRequestError} If the user already follows the followed
 * @returns The new follower object
 */
const follow = async (followerId, followedId) => {
    const newFollowObject = { follower: followerId, followed: followedId };
    const followerObject = await followerRepository.getFollowerBy({
        follower: followerId,
        followed: followedId,
    });

    if (followerObject.length > 0) {
        throw new BadRequestError(`Follower object already exists`);
    }

    return await followerRepository.createFollower(newFollowObject);
};

/**
 * Makes the follower stop following the followed
 * @param {*} followerId Id of the user that is to be follower
 * @param {*} followedId Id of the user that is to be followed
 * @throws {BadRequestError} If the user does not follow the followed
 * @returns The deleted follower object
 */
const stopFollowing = async (followerId, followedId) => {
    const deletedResult = await followerRepository.deleteFollowerBy({
        follower: followerId,
        followed: followedId,
    });

    if (!deletedResult) {
        throw new NotFoundError(
            `Follower object with: {follower: ${followerId}, followed: ${followedId}} not found`
        );
    }

    return deletedResult;
};

module.exports = {
    getNumberFollowersOf,
    getNumberFollowingOf,
    getFollowersOf,
    getFollowingsOf,
    follow,
    checkFollows,
    stopFollowing,
};
