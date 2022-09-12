const MomentLike = require("../models/MomentLike");

const getLikeBy = async (filters, skip = 0, limit = 20) => {
    return await MomentLike.find(filters)
        .skip(skip)
        .limit(limit)
        .populate("createdBy moment")
        .sort("-createdAt");
};

const getNumberLikesBy = async (filters) => {
    return await MomentLike.count(filters);
};

const createLike = async (newLike) => {
    return await MomentLike.create(newLike);
};

const updateLikeBy = async (filters, newComment) => {
    return await MomentLike.findOneAndUpdate(filters, newComment, {
        new: true,
    });
};

const deleteLikeBy = async (filters) => {
    return await MomentLike.findOneAndDelete(filters);
};

const deleteManyLikesBy = async (filters) => {
    return await MomentLike.deleteMany(filters);
};

module.exports = {
    getLikeBy,
    getNumberLikesBy,
    createLike,
    updateLikeBy,
    deleteLikeBy,
    deleteManyLikesBy,
};
