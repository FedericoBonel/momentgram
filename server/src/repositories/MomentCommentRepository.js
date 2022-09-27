const MomentComment = require("../models/MomentComment");

const getCommentBy = async (filters, skip = 0, limit = 20) => {
    return await MomentComment.find(filters)
        .skip(skip)
        .limit(limit)
        .sort("-createdAt")
        .populate("createdBy")
        .populate("moment");
};

const getNumberCommentsBy = async (filters) => {
    return await MomentComment.count(filters);
};

const createComment = async (newComment) => {
    const savedComment = await MomentComment.create(newComment);
    return await savedComment.populate("createdBy");
};

const updateCommentBy = async (filters, comment) => {
    return await MomentComment.findOneAndUpdate(filters, comment, {
        new: true,
    });
};

const deleteCommentBy = async (filters) => {
    return await MomentComment.findOneAndDelete(filters);
};

const deleteManyCommentsBy = async (filters) => {
    return await MomentComment.deleteMany(filters);
};

module.exports = {
    getCommentBy,
    getNumberCommentsBy,
    createComment,
    updateCommentBy,
    deleteCommentBy,
    deleteManyCommentsBy,
};
