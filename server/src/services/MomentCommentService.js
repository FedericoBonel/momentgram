const { NotFoundError } = require("../errors");
const momentCommentRepository = require("../repositories/MomentCommentRepository");

/**
 * Gets number of comments of the moment
 * @param {String} momentId Moment id
 * @returns Number of comments
 */
const getNumberCommentsOf = async (momentId) => {
    return await momentCommentRepository.getNumberCommentsBy({
        moment: momentId,
    });
};

/**
 * Adds a comment from the user to the moment
 * @param {String} userId Id of the user to add comment
 * @param {String} momentId Moment id
 * @param {String} comment Comment to add
 * @returns Created comment
 */
const addCommentTo = async (userId, momentId, comment) => {
    return toCommentDTO(
        await momentCommentRepository.createComment({
            createdBy: userId,
            moment: momentId,
            comment: comment,
        })
    );
};

/**
 * Gets a list of comments for a given moment
 * @param {String} momentId Moment id
 * @param {Number} page page of the list to get
 * @param {Number} limit maximum number of comments per page
 * @returns List of comments
 */
const getCommentsFor = async (momentId, page = 1, limit = 20) => {
    const skip = (page - 1) * limit;
    const savedComments = await momentCommentRepository.getCommentBy(
        { moment: momentId },
        skip,
        limit
    );

    return savedComments.map((comment) => toCommentDTO(comment));
};

/**
 * Extracts public information from the given comment
 * @param {*} commentDoc Comment from which to extract information
 * @returns Public information of the comment
 */
const toCommentDTO = (commentDoc) => {
    const comment = commentDoc.toObject();
    return {
        ...comment,
        createdBy: {
            _id: comment.createdBy._id,
            username: comment.createdBy.username,
            email: comment.createdBy.email,
            profileImg: comment.createdBy.profileImg,
        },
        moment: comment.moment._id,
    };
};

/**
 * Updates the comment of the user by id
 * @param {String} userId Id of the author
 * @param {String} momentId Id of the moment where the comment was made
 * @param {String} commentId Id of the comment to be updated
 * @param {String} updatedComment New comment content
 * @throws {NotFoundError} if such comment was not found
 * @returns Updated comment
 */
const updateCommentById = async (
    userId,
    momentId,
    commentId,
    updatedComment
) => {
    const savedComment = await momentCommentRepository.updateCommentBy(
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

/**
 * Deletes a comment by id
 * @param {*} userId Id of the user that wishes to delete the comment
 * @param {*} momentId Id of the moment to where the comment was made
 * @param {*} commentId Id of the comment to delete
 * @returns The deleted comment
 */
const deleteCommentById = async (userId, momentId, commentId) => {
    // Check if the user made the comment
    const ownCommentDeleted = await momentCommentRepository.deleteCommentBy({
        createdBy: userId,
        moment: momentId,
        _id: commentId,
    });

    if (ownCommentDeleted) {
        return ownCommentDeleted;
    }

    // Otherwise check if the user is the owner of the moment
    const foundComment = await momentCommentRepository.getCommentBy({
        moment: momentId,
        _id: commentId,
    });

    if (
        !foundComment.length ||
        foundComment[0].moment.createdBy.toString() !== userId
    ) {
        throw new NotFoundError(
            `Comment with id ${commentId} and momentId: ${momentId} not found!`
        );
    }

    const ownMomentCommentDeleted =
        await momentCommentRepository.deleteCommentBy({
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
