const { StatusCodes } = require("http-status-codes");

const { SuccessPayload } = require("../payloads");
const {
    getAllMoments,
    getMomentsFor,
    createMoment,
    getAMomentById,
    deleteMomentById,
    updateMomentById,
    addImagesTo,
} = require("../services/MomentService");
const {
    getLikesOf,
    addLikeTo,
    deleteLikeFrom,
} = require("../services/MomentLikeService");
const {
    addCommentTo,
    getCommentsFor,
    updateCommentById,
    deleteCommentById,
} = require("../services/MomentCommentService");

const getMoments = async (req, res) => {
    const { _id: userId } = req.user;
    const { page, limit, all } = req.query;

    let momentsForUser;
    if (all) {
        momentsForUser = await getAllMoments(page && page, limit && limit);
    } else {
        momentsForUser = await getMomentsFor(
            userId,
            page && page,
            limit && limit
        );
    }

    res.status(StatusCodes.OK).json(new SuccessPayload(momentsForUser));
};

const getMomentById = async (req, res) => {
    const { id: momentId } = req.params;
    const { _id: userId } = req.user;

    const foundMoment = await getAMomentById(momentId, userId && userId);

    res.status(StatusCodes.OK).json(new SuccessPayload(foundMoment));
};

const createNewMoment = async (req, res) => {
    const { _id: userId } = req.user;
    const newMoment = req.body;

    const createdMoment = await createMoment(userId, newMoment);

    res.status(StatusCodes.CREATED).json(new SuccessPayload(createdMoment));
};

const deleteMoment = async (req, res) => {
    const { _id: userId } = req.user;
    const { id: momentId } = req.params;

    const deletedResult = await deleteMomentById(userId, momentId);

    res.status(StatusCodes.OK).json(new SuccessPayload(deletedResult));
};

const updateMoment = async (req, res) => {
    const { _id: userId } = req.user;
    const { id: momentId } = req.params;
    const updatedMoment = req.body;

    const savedMoment = await updateMomentById(userId, momentId, updatedMoment);

    res.status(StatusCodes.OK).json(new SuccessPayload(savedMoment));
};

const getMomentLikes = async (req, res) => {
    const { id: momentId } = req.params;
    const { page, limit } = req.query;

    const momentLikes = await getLikesOf(
        momentId,
        page && page,
        limit && limit
    );

    res.status(StatusCodes.OK).json(new SuccessPayload(momentLikes));
};

const likeMoment = async (req, res) => {
    const { id: momentId } = req.params;
    const { _id: userId } = req.user;

    const like = await addLikeTo(userId, momentId);

    res.status(StatusCodes.CREATED).json(new SuccessPayload(like));
};

const stopLikingMoment = async (req, res) => {
    const { id: momentId } = req.params;
    const { _id: userId } = req.user;

    const deletedLike = await deleteLikeFrom(userId, momentId);

    res.status(StatusCodes.OK).json(new SuccessPayload(deletedLike));
};

const addComment = async (req, res) => {
    const { id: momentId } = req.params;
    const { _id: userId } = req.user;
    const { comment } = req.body;

    const createdComment = await addCommentTo(userId, momentId, comment);

    res.status(StatusCodes.CREATED).json(new SuccessPayload(createdComment));
};

const getComments = async (req, res) => {
    const { id: momentId } = req.params;
    const { page, limit } = req.query;

    const comments = await getCommentsFor(
        momentId,
        page && page,
        limit && limit
    );

    res.status(StatusCodes.OK).json(new SuccessPayload(comments));
};

const updateComment = async (req, res) => {
    const { id: momentId, commentId } = req.params;
    const { _id: userId } = req.user;
    const { comment } = req.body;

    const updatedComment = await updateCommentById(
        userId,
        momentId,
        commentId,
        comment
    );

    res.status(StatusCodes.OK).json(new SuccessPayload(updatedComment));
};

const deleteComment = async (req, res) => {
    const { id: momentId, commentId } = req.params;
    const { _id: userId } = req.user;

    const deletedComment = await deleteCommentById(userId, momentId, commentId);

    res.status(StatusCodes.OK).json(new SuccessPayload(deletedComment));
};

const uploadImage = async (req, res) => {
    const { _id: userId } = req.user;
    const { id: momentId } = req.params;
    const files = req.files;

    const updatedMoment = await addImagesTo(userId, momentId, files);

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
