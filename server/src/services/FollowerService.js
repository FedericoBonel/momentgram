const {
    getTotalFollowersBy,
    getFollowerBy,
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
    }));
};

const getNumberFollowersOf = async (userId) => {
    return await getTotalFollowersBy({ followed: userId });
};

const getNumberFollowingOf = async (userId) => {
    return await getTotalFollowersBy({ following: userId });
};

module.exports = {
    getNumberFollowersOf,
    getNumberFollowingOf,
    getFollowersOf,
    getFollowingsOf,
};
