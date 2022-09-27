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
    return createCommentBody(
        await createComment({
            createdBy: userId,
            moment: momentId,
            comment: comment,
        })
    );
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
        moment: comment.moment._id,
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
    // Check if the user made the comment
    const ownCommentDeleted = await deleteCommentBy({
        createdBy: userId,
        moment: momentId,
        _id: commentId,
    });

    if (ownCommentDeleted) {
        return ownCommentDeleted;
    }

    // Otherwise check if the user is the owner of the moment
    const foundComment = await getCommentBy({
        moment: momentId,
        _id: commentId,
    });

    if (!foundComment.length || foundComment[0].moment.createdBy.toString() !== userId) {
        throw new NotFoundError(
            `Comment with id ${commentId} and momentId: ${momentId} not found!`
        );
    }

    const ownMomentCommentDeleted = await deleteCommentBy({
        moment: momentId,
        _id: commentId,
    });

    return ownMomentCommentDeleted;
};

module.exports = {
    getNumberCommentsOf,
    addCommentTo,
    getCommentsFor,
    updateCommentById,
    deleteCommentById,
};
