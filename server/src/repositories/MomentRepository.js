const Moment = require("../models/Moment");
const { deleteManyCommentsBy } = require("./MomentCommentRepository");
const { deleteManyLikesBy } = require("./MomentLikeRepository");

const getMomentBy = async (filters) => {
    return await Moment.find(filters);
};

const createMoment = async (newMoment) => {
    return await Moment.create(newMoment);
};

const updateMomentBy = async (filters, updatedMoment) => {
    return await Moment.findOneAndUpdate(filters, updatedMoment, { new: true });
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
    createMoment,
    updateMomentBy,
    deleteMomentBy,
    deleteManyMomentsBy,
};
