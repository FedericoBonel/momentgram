const MomentLike = require("../models/MomentLike");

const getLikeBy = async (filters) => {
    return await MomentLike.find(filters);
};

const getNumberLikesBy = async (filters) => {
    return await MomentLike.count(filters)
}

const createLike = async (newComment) => {
    return await MomentLike.create(newComment);
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
}

module.exports = {
    getLikeBy,
    getNumberLikesBy,
    createLike,
    updateLikeBy,
    deleteLikeBy,
    deleteManyLikesBy
};
