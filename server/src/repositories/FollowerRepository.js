const Follower = require("../models/Follower");

/**
 * Gets all the follower objects that match the filters with the selected fields
 * @param {any} filters Fields that need to match in the followers object
 * @param {Number} skip Number of elements to skip from the beggining
 * @param {Number} limit Number of elements to return
 * @param {"follower"|"followed"} select Field to select and populate from the result
 * @returns All the follower objects that match the filters populated and filtered accordingly
 */
const getFollowerBy = async (filters, skip = 0, limit = 20, select) => {
    return await Follower.find(filters)
        .skip(skip)
        .limit(limit)
        .populate(select)
        .select(select);
};

const getTotalFollowersBy = async (filters) => {
    return await Follower.count(filters);
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
};

module.exports = {
    getFollowerBy,
    createFollower,
    updateFollowerBy,
    deleteFollowerBy,
    deleteManyFollowersBy,
    getTotalFollowersBy,
};
