const MomentComment = require("../models/MomentComment");

const getCommentBy = async (filters) => {
    return await MomentComment.find(filters);
};

const getNumberCommentsBy = async (filters) => {
    return await MomentComment.count(filters);
}

const createComment = async (newComment) => {
    return await MomentComment.create(newComment);
};

const updateCommentBy = async (filters, newComment) => {
    return await MomentComment.findOneAndUpdate(filters, newComment, {
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
