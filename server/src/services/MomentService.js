const path = require("path");
const { nanoid } = require("nanoid");

const momentRepository = require("../repositories/MomentRepository");
const followerRepository = require("./FollowerService");
const momentCommentRepository = require("./MomentCommentService");
const momentLikeService = require("./MomentLikeService");
const fileService = require("./FileService");
const errors = require("../errors");

/**
 * Creates a new moment for a specific user
 * @param {String} userId Id of the user that creates the moment
 * @param {any} newMoment The moment to be created
 * @returns The created new moment
 */
const createMoment = async (userId, newMoment) => {
    const momentToSave = { ...newMoment, createdBy: userId };

    const savedMoment = await momentRepository.create(momentToSave);

    return toMomentDTO(savedMoment);
};

/**
 * Gets one moment by id
 * @param {String} momentId Id of the moment you need
 * @param {String} userId Optional id of the logged user that requests the moment
 * @throws {NotFoundError} If the moment does not exist
 * @returns The moment if it exists
 */
const getAMomentById = async (momentId, userId = null) => {
    const foundMoment = await momentRepository.getMomentBy({ _id: momentId });

    if (foundMoment.length === 0) {
        throw new errors.NotFoundError(`Moment with id: ${momentId} not found`);
    }

    return toMomentDTO(foundMoment[0], userId);
};

/**
 * Gets all moments match the given filter
 * @param {any} filter Fields that you need the result to match
 * @param {Number} page Number of the page of moments (defaults to first page)
 * @param {Number} limit Limit of moments per page (defaults to 20)
 * @param {String} order Field by which you need your results to be sorted
 * @returns All moments that match the given filter
 */
const getAllMoments = async (
    filter = {},
    page = 1,
    limit = 20,
    order = "-createdAt"
) => {
    const skip = (page - 1) * limit;

    const storedMoments = await momentRepository.getMomentBy(
        filter,
        skip,
        limit,
        order
    );

    return await toListOfMomentsDTOs(storedMoments);
};

/**
 * Gets the moments of the users that are followed by userId's user
 * @param {String} userId Id of the user for which these moments are
 * @param {Number} page Number of the page of moments (defaults to first page)
 * @param {Number} limit Limit of moments per page (defaults to 20)
 * @returns the moments from the users that the userId user follows order by decreasing date
 */
const getMomentsFor = async (userId, page = 1, limit = 20) => {
    const skip = (page - 1) * limit;

    // Get all the id's of the users that this user follows
    const userFollowings = await followerRepository.getFollowingsOf(
        userId,
        0,
        0
    );

    // Select the moments that were created by any of those ids
    const momentsForUser = await momentRepository.getMomentBy(
        {
            $or: [
                { createdBy: { $in: userFollowings.map((u) => u._id) } },
                { createdBy: userId },
            ],
        },
        skip,
        limit,
        "-createdAt"
    );

    return await toListOfMomentsDTOs(momentsForUser, userId);
};

/**
 * Gets all the moments of a specific user
 * @param {String} userId Id of the user you wish to get the moments from
 * @param {Number} page Number of the page of moments (defaults to first page)
 * @param {Number} limit Limit of moments per page (defaults to 20)
 * @returns All the moments of that user
 */
const getMomentsOf = async (userId, page = 1, limit = 20) => {
    const skip = (page - 1) * limit;

    const storedMoments = await momentRepository.getMomentBy(
        { createdBy: userId },
        skip,
        limit
    );

    // Get the number of likes and comments
    return await toListOfMomentsDTOs(storedMoments, userId);
};

/**
 * Gets a moment by the authors id and moment id
 * @param {String} userId Authors id
 * @param {String} momentId Moment id
 * @throws {NotFoundError} if no such moment was found
 * @returns The found user
 */
const getMomentByUser = async (userId, momentId) => {
    const savedMoment = await momentRepository.getMomentBy({
        createdBy: userId,
        _id: momentId,
    });

    if (savedMoment.length === 0) {
        throw new errors.NotFoundError(`Moment with id ${momentId} not found`);
    }

    return savedMoment[0];
};

/**
 * Gets the number of moments of a specific user
 * @param {String} userId Id of the user
 * @returns The number of moments of that specific user
 */
const getNumberMomentsOf = async (userId) => {
    return await momentRepository.getNumberMomentsBy({ createdBy: userId });
};

/**
 * Deletes a moment that the userId user created
 * @param {String} userId Id of the creator
 * @param {String} momentId Id of the moment to delete
 * @returns The deleted moment and the number of likes and comments associated with it that have been deleted
 */
const deleteMomentById = async (userId, momentId) => {
    // Find the moment
    const foundMoment = await getMomentByUser(userId, momentId);

    // Delete its images from hard drive
    let pathsToDelete = [];
    for (const image of foundMoment.img) {
        const imageName = image.url.substring(8);
        const dir = fileService.getDirToImagesFor(imageName);
        pathsToDelete.push(dir);
    }
    await fileService.deleteFiles(pathsToDelete);

    // Delete Moment
    const deleteResult = await momentRepository.deleteMomentBy({
        createdBy: userId,
        _id: momentId,
    });

    return deleteResult;
};

/**
 * Updates the moment that userId user created
 * @param {String} userId User id of the creator
 * @param {String} momentId Moment id of the user
 * @param {*} updatedMoment Changes to be applied to the moment
 * @returns The updated moment
 */
const updateMomentById = async (userId, momentId, updatedMoment) => {
    const { _id, img, ...changes } = updatedMoment;

    const savedMoment = await momentRepository.updateMomentBy(
        { createdBy: userId, _id: momentId },
        changes
    );

    if (!savedMoment) {
        throw new errors.NotFoundError(`Moment with id ${momentId} not found`);
    }

    return await toMomentDTO(savedMoment);
};

/**
 * Transforms the given moments to a list of moment DTOs
 * @param {[*]} moments Moments to be transformed
 * @param {String} userId Id of the logged user (optional, if given checks if the user liked the moments)
 * @returns A list of the moments DTOs
 */
const toListOfMomentsDTOs = async (moments, userId = null) => {
    // Get the number of likes and comments
    let momentsToReturn = [];
    for (const momentDoc of moments) {
        momentsToReturn.push(await toMomentDTO(momentDoc, userId));
    }
    return momentsToReturn;
};

/**
 * Transforms a moment to a moment DTO
 * @param {*} momentDoc Document of the moment to be transformed
 * @param {*} userId Id of the logged user (Optional, if given checks if the moment was liked by the user)
 * @returns Moment DTO
 */
const toMomentDTO = async (momentDoc, userId = null) => {
    const numberComments = await momentCommentRepository.getNumberCommentsOf(
        momentDoc._id
    );
    const numberLikes = await momentLikeService.getNumberLikesOf(momentDoc._id);
    const isLiked = userId
        ? (await momentLikeService.getLikeByUserAndMoment(
              userId,
              momentDoc._id
          )) !== undefined
        : undefined;

    return {
        ...momentDoc.toObject(),
        numberComments,
        numberLikes,
        createdBy: {
            _id: momentDoc.createdBy._id,
            username: momentDoc.createdBy.username,
            email: momentDoc.createdBy.email,
            profileImg: momentDoc.createdBy.profileImg,
        },
        isLiked,
    };
};

/**
 * Adds the given images to the userId user's moment
 * @param {String} userId Id of the author
 * @param {String} momentId Id of the moment
 * @param {[UploadedFile]} images Array of images to be added
 * @returns Updated moment
 */
const addImagesTo = async (userId, momentId, images) => {
    // verify the moment does not have images
    const savedMoment = await getMomentByUser(userId, momentId);

    if (savedMoment.img?.length) {
        throw new errors.BadRequestError(
            `Moment with id ${momentId} already has images`
        );
    }

    // Save the images in the file system
    const fileNames = Object.keys(images);
    let newImages = [];
    for (let file of fileNames) {
        const extension = path.extname(images[file].name);
        images[file].id = nanoid();

        await fileService.saveImage(
            images[file],
            `${images[file].id}${extension}`
        );

        const savedImageObject = {
            url: `/images/${images[file].id}${extension}`,
            byteSize: images[file].size,
        };

        newImages.push(savedImageObject);
    }

    // Save the images in database
    return await addImagesToMoment(userId, momentId, newImages);
};

/**
 * Adds the given images objects to the authors moment
 * @param {String} userId Id of the author
 * @param {String} momentId Id of the moment
 * @param {[*]} images Array of images objects to be added
 * @returns The updated moment
 */
const addImagesToMoment = async (userId, momentId, images) => {
    const updatedMoment = await momentRepository.updateMomentBy(
        { createdBy: userId, _id: momentId },
        { $push: { img: images } }
    );

    if (!updatedMoment) {
        throw new errors.NotFoundError(`Moment with id ${momentId} not found`);
    }

    return updatedMoment;
};

module.exports = {
    getNumberMomentsOf,
    getMomentsOf,
    getMomentsFor,
    getAllMoments,
    getAMomentById,
    createMoment,
    deleteMomentById,
    updateMomentById,
    addImagesTo,
    getMomentByUser,
};
