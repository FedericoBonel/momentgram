const { StatusCodes } = require("http-status-codes");

const { SuccessPayload } = require("../payloads");
const momentService = require("../services/MomentService");
const momentLikeService = require("../services/MomentLikeService");
const momentCommentService = require("../services/MomentCommentService");

/** Gets a list of moments for the logged user */
const getMoments = async (req, res) => {
    const { _id: userId } = req.user;
    const { page, limit, all } = req.query;

    let momentsForUser;
    if (all) {
        momentsForUser = await momentService.getAllMoments(
            page && page,
            limit && limit
        );
    } else {
        momentsForUser = await momentService.getMomentsFor(
            userId,
            page && page,
            limit && limit
        );
    }

    res.status(StatusCodes.OK).json(new SuccessPayload(momentsForUser));
};

/** Gets a moment by param id */
const getMomentById = async (req, res) => {
    const { id: momentId } = req.params;
    const { _id: userId } = req.user;

    const foundMoment = await momentService.getAMomentById(
        momentId,
        userId && userId
    );

    res.status(StatusCodes.OK).json(new SuccessPayload(foundMoment));
};

/** Creates a new moment for logged user */
const createNewMoment = async (req, res) => {
    const { _id: userId } = req.user;
    const newMoment = req.body;

    const createdMoment = await momentService.createMoment(userId, newMoment);

    res.status(StatusCodes.CREATED).json(new SuccessPayload(createdMoment));
};

/** Deletes a moment from the logged user by param id */
const deleteMoment = async (req, res) => {
    const { _id: userId } = req.user;
    const { id: momentId } = req.params;

    const deletedResult = await momentService.deleteMomentById(
        userId,
        momentId
    );

    res.status(StatusCodes.OK).json(new SuccessPayload(deletedResult));
};

/** Updates a moment from the logged user by param id */
const updateMoment = async (req, res) => {
    const { _id: userId } = req.user;
    const { id: momentId } = req.params;
    const updatedMoment = req.body;

    const savedMoment = await momentService.updateMomentById(
        userId,
        momentId,
        updatedMoment
    );

    res.status(StatusCodes.OK).json(new SuccessPayload(savedMoment));
};

/** Gets the moment likes */
const getMomentLikes = async (req, res) => {
    const { id: momentId } = req.params;
    const { page, limit } = req.query;

    const momentLikes = await momentLikeService.getLikesOf(
        momentId,
        page && page,
        limit && limit
    );

    res.status(StatusCodes.OK).json(new SuccessPayload(momentLikes));
};

/** Adds a like to the moment from logged user */
const likeMoment = async (req, res) => {
    const { id: momentId } = req.params;
    const { _id: userId } = req.user;

    const like = await momentLikeService.addLikeTo(userId, momentId);

    res.status(StatusCodes.CREATED).json(new SuccessPayload(like));
};

/** Removes the logged users like from the moment */
const stopLikingMoment = async (req, res) => {
    const { id: momentId } = req.params;
    const { _id: userId } = req.user;

    const deletedLike = await momentLikeService.deleteLikeFrom(
        userId,
        momentId
    );

    res.status(StatusCodes.OK).json(new SuccessPayload(deletedLike));
};

/** Adds a comment from the logged user to the moment */
const addComment = async (req, res) => {
    const { id: momentId } = req.params;
    const { _id: userId } = req.user;
    const { comment } = req.body;

    const createdComment = await momentCommentService.addCommentTo(
        userId,
        momentId,
        comment
    );

    res.status(StatusCodes.CREATED).json(new SuccessPayload(createdComment));
};

/** Gets all the comments for the moment */
const getComments = async (req, res) => {
    const { id: momentId } = req.params;
    const { page, limit } = req.query;

    const comments = await momentCommentService.getCommentsFor(
        momentId,
        page && page,
        limit && limit
    );

    res.status(StatusCodes.OK).json(new SuccessPayload(comments));
};

/** Updates the logged users comment from the moment */
const updateComment = async (req, res) => {
    const { id: momentId, commentId } = req.params;
    const { _id: userId } = req.user;
    const { comment } = req.body;

    const updatedComment = await momentCommentService.updateCommentById(
        userId,
        momentId,
        commentId,
        comment
    );

    res.status(StatusCodes.OK).json(new SuccessPayload(updatedComment));
};

/** Deletes the logged users comment from the moment */
const deleteComment = async (req, res) => {
    const { id: momentId, commentId } = req.params;
    const { _id: userId } = req.user;

    const deletedComment = await momentCommentService.deleteCommentById(
        userId,
        momentId,
        commentId
    );

    res.status(StatusCodes.OK).json(new SuccessPayload(deletedComment));
};

/** Uploads a set of images to the logged users moment */
const uploadImage = async (req, res) => {
    const { _id: userId } = req.user;
    const { id: momentId } = req.params;
    const files = req.files;

    const updatedMoment = await momentService.addImagesTo(
        userId,
        momentId,
        files
    );

    res.status(StatusCodes.CREATED).json(new SuccessPayload(updatedMoment));
};

module.exports = {
    getMoments,
    getMomentById,
    createNewMoment,
    deleteMoment,
    updateMoment,
    getMomentLikes,
    likeMoment,
    stopLikingMoment,
    addComment,
    getComments,
    updateComment,
    deleteComment,
    uploadImage,
};
