const MomentComment = require("../models/MomentComment");

const getCommentBy = async (filters, skip = 0, limit = 20) => {
    return await MomentComment.find(filters)
        .skip(skip)
        .limit(limit)
        .populate("createdBy");
};

const getNumberCommentsBy = async (filters) => {
    return await MomentComment.count(filters);
};

const createComment = async (newComment) => {
    return await MomentComment.create(newComment);
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
