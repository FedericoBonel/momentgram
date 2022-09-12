const { NotFoundError } = require("../errors");
const {
    getNumberCommentsBy,
    createComment,
    getCommentBy,
    updateCommentBy,
    deleteCommentBy,
} = require("../repositories/MomentCommentRepository");

const getNumberCommentsOf = async (momentId) => {
    return await getNumberCommentsBy({ moment: momentId });
};

const addCommentTo = async (userId, momentId, comment) => {
    return await createComment({
        createdBy: userId,
        moment: momentId,
        comment: comment,
    });
};

const getCommentsFor = async (momentId, page = 1, limit = 20) => {
    const skip = (page - 1) * limit;
    const savedComments = await getCommentBy({ moment: momentId }, skip, limit);

    return createCommentBodiesList(savedComments);
};

const createCommentBodiesList = (comments) => {
    return comments.map((comment) => createCommentBody(comment));
};

const createCommentBody = (commentDoc) => {
    const comment = commentDoc.toObject();
    return {
        ...comment,
        createdBy: {
            _id: comment.createdBy._id,
            username: comment.createdBy.username,
            email: comment.createdBy.email,
        },
    };
};

const updateCommentById = async (
    userId,
    momentId,
    commentId,
    updatedComment
) => {
    const savedComment = await updateCommentBy(
        { createdBy: userId, moment: momentId, _id: commentId },
        { comment: updatedComment }
    );

    if (!savedComment) {
        throw new NotFoundError(
            `Comment with id ${commentId} and moment id: ${momentId} not found!`
        );
    }

    return savedComment;
};

const deleteCommentById = async (userId, momentId, commentId) => {
    const deletedComment = await deleteCommentBy({
        createdBy: userId,
        moment: momentId,
        _id: commentId,
    });

    if (!deletedComment) {
        throw new NotFoundError(`Comment with id ${commentId} and momentId: ${momentId} not found!`)
    }

    return deletedComment;
};

module.exports = {
    getNumberCommentsOf,
    addCommentTo,
    getCommentsFor,
    updateCommentById,
    deleteCommentById,
};
