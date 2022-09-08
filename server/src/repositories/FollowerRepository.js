const Follower = require("../models/Follower");

const getFollowerBy = async (filters) => {
    return await Follower.find(filters);
};

const createFollower = async (newComment) => {
    return await Follower.create(newComment);
};

const updateFollowerBy = async (filters, newComment) => {
    return await Follower.findOneAndUpdate(filters, newComment, {
        new: true,
    });
};

const deleteFollowerBy = async (filters) => {
    return await Follower.findOneAndDelete(filters);
};

const deleteManyFollowersBy = async (filters) => {
    return await Follower.deleteMany(filters);
}

module.exports = {
    getFollowerBy,
    createFollower,
    updateFollowerBy,
    deleteFollowerBy,
    deleteManyFollowersBy
};
