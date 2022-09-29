const { NotFoundError, BadRequestError } = require("../errors");
const {
    getTotalFollowersBy,
    getFollowerBy,
    createFollower,
    deleteFollowerBy,
} = require("../repositories/FollowerRepository");

const getFollowersOf = async (userId, page = 1, limit = 20) => {
    const skip = (page - 1) * limit;

    // Get the follower objects where the user is the one followed
    // and populate the user that follows them
    const followedFollowing = await getFollowerBy(
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
        profileImg: follower.profileImg
    }));
};

const getFollowingsOf = async (userId, page = 1, limit = 20) => {
    
    const skip = (page - 1) * limit;

    // Get the follower objects where the user is the one following
    // and populate the user that is being followed by them
    const followedFollowing = await getFollowerBy(
        { follower: userId },
        skip,
        limit,
        "followed"
    );

    return followedFollowing.map(({ followed }) => ({
        _id: followed._id,
        email: followed.email,
        username: followed.username,
        profileImg: followed.profileImg
    }));
};

const getNumberFollowersOf = async (userId) => {
    return await getTotalFollowersBy({ followed: userId });
};

const getNumberFollowingOf = async (userId) => {
    return await getTotalFollowersBy({ follower: userId });
};

const checkFollows = async (followerId, followedId) => {
    const followerObject = await getFollowerBy({
        follower: followerId,
        followed: followedId,
    });

    return followerObject.length > 0;
};

const follow = async (followerId, followedId) => {
    const newFollowObject = { follower: followerId, followed: followedId };
    const followerObject = await getFollowerBy({
        follower: followerId,
        followed: followedId,
    });

    if (followerObject.length > 0) {
        throw new BadRequestError(`Follower object already exists`)
    }

    return await createFollower(newFollowObject);
};

const stopFollowing = async (followerId, followedId) => {
    const deletedResult = await deleteFollowerBy({
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
