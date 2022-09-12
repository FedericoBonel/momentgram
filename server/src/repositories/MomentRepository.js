const Moment = require("../models/Moment");
const { deleteManyCommentsBy } = require("./MomentCommentRepository");
const { deleteManyLikesBy } = require("./MomentLikeRepository");

const getMomentBy = async (
    filters,
    skip = 0,
    limit = 20,
    order = "createdAt"
) => {
    return await Moment.find(filters)
        .skip(skip)
        .limit(limit)
        .populate("createdBy")
        .sort(order);
};

const getNumberMomentsBy = async (filters) => {
    return await Moment.count(filters);
};

const create = async (newMoment) => {
    return await Moment.create(newMoment);
};

const updateMomentBy = async (filters, updatedMoment) => {
    return await Moment.findOneAndUpdate(filters, updatedMoment, {
        new: true,
    }).populate("createdBy");
};

const deleteMomentBy = async (filters) => {
    const deletedMoment = await Moment.findOneAndDelete(filters);

    if (!deletedMoment) return null;

    // Cascade the operation
    const deletedComments = await deleteManyCommentsBy({
        moment: deletedMoment._id,
    });

    const deletedLikes = await deleteManyLikesBy({
        moment: deletedMoment._id,
    });

    return {
        deletedMoment: deletedMoment._id,
        deletedComments: deletedComments.deletedCount,
        deletedLikes: deletedLikes.deletedCount,
    };
};

const deleteManyMomentsBy = async (filters) => {
    // Find all the moments to delete
    const foundMoments = await Moment.find(filters);

    // Iterate through each one of them deleting them and cascading that operation
    for (const moment of foundMoments) {
        await deleteMomentBy({ _id: moment._id });
    }

    // Return the count
    return { deletedCount: foundMoments.length };
};

module.exports = {
    getMomentBy,
    getNumberMomentsBy,
    create,
    updateMomentBy,
    deleteMomentBy,
    deleteManyMomentsBy,
};
