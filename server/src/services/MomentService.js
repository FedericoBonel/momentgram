const path = require("path");
const { nanoid } = require("nanoid");

const {
    getNumberMomentsBy,
    getMomentBy,
    create,
    deleteMomentBy,
    updateMomentBy,
} = require("../repositories/MomentRepository");
const { getFollowingsOf } = require("./FollowerService");
const { getNumberCommentsOf } = require("./MomentCommentService");
const {
    getNumberLikesOf,
    getLikeByUserAndMoment,
} = require("./MomentLikeService");
const { NotFoundError, BadRequestError } = require("../errors");

/**
 * Creates a new moment for a specific user
 * @param {String} userId Id of the user that creates the moment
 * @param {any} newMoment The moment to be created
 * @returns The created new moment
 */
const createMoment = async (userId, newMoment) => {
    const momentToSave = { ...newMoment, createdBy: userId };

    const savedMoment = await create(momentToSave);

    return createSingleMomentBody(savedMoment);
};

/**
 * Gets one moment by id
 * @param {String} momentId Id of the moment you need
 * @param {String} userId Optional id of the logged user that requests the moment
 * @throws {NotFoundError} If the moment does not exist
 * @returns The moment if it exists
 */
const getAMomentById = async (momentId, userId = null) => {
    const foundMoment = await getMomentBy({ _id: momentId });

    if (foundMoment.length === 0) {
        throw new NotFoundError(`Moment with id: ${momentId} not found`);
    }

    return createSingleMomentBody(foundMoment[0], userId);
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

    const storedMoments = await getMomentBy(filter, skip, limit, order);

    return await createListOfMomentBodies(storedMoments);
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

    // Get all the id's of the users that this user follows and it's own
    const userFollowings = await getFollowingsOf(userId, 0, 0);

    // Select the moments that were created by any of those ids in date order
    const momentsForUser = await getMomentBy(
        { createdBy: { $in: userFollowings.map((u) => u._id) } },
        skip,
        limit,
        "-createdAt"
    );

    return await createListOfMomentBodies(momentsForUser, userId);
};

/**
 * Gets all the moments of a specific user
 * @param {*} userId Id of the user you wish to get the moments from
 * @param {Number} page Number of the page of moments (defaults to first page)
 * @param {Number} limit Limit of moments per page (defaults to 20)
 * @returns All the moments of that user
 */
const getMomentsOf = async (userId, page = 1, limit = 20) => {
    const skip = (page - 1) * limit;

    const storedMoments = await getMomentBy({ createdBy: userId }, skip, limit);

    // Get the number of likes and comments
    return await createListOfMomentBodies(storedMoments, userId);
};

const getMomentByUser = async (userId, momentId) => {
    const savedMoment = await getMomentBy({ createdBy: userId, _id: momentId });

    if (savedMoment.length === 0) {
        throw new NotFoundError(`Moment with id ${momentId} not found`);
    }

    return savedMoment;
};

const getNumberMomentsOf = async (userId) => {
    return await getNumberMomentsBy({ createdBy: userId });
};

/**
 * Deletes a moment that the userId user created
 * @param {*} userId Id of the creator
 * @param {*} momentId Id of the moment to delete
 * @returns The deleted moment and the number of likes and comments associated with it that have been deleted
 */
const deleteMomentById = async (userId, momentId) => {
    const deleteResult = await deleteMomentBy({
        createdBy: userId,
        _id: momentId,
    });

    if (!deleteResult) {
        throw new NotFoundError(`Moment with id ${momentId} not found`);
    }

    return deleteResult;
};

const updateMomentById = async (userId, momentId, updatedMoment) => {
    const { _id, img, ...changes } = updatedMoment;

    const savedMoment = await updateMomentBy(
        { createdBy: userId, _id: momentId },
        changes
    );

    if (!savedMoment) {
        throw new NotFoundError(`Moment with id ${momentId} not found`);
    }

    return await createSingleMomentBody(savedMoment);
};

const createListOfMomentBodies = async (moments, userId = null) => {
    // Get the number of likes and comments
    let momentsToReturn = [];
    for (const momentDoc of moments) {
        momentsToReturn.push(await createSingleMomentBody(momentDoc, userId));
    }
    return momentsToReturn;
};

const createSingleMomentBody = async (momentDoc, userId = null) => {
    const numberComments = await getNumberCommentsOf(momentDoc._id);
    const numberLikes = await getNumberLikesOf(momentDoc._id);
    const isLiked = userId
        ? (await getLikeByUserAndMoment(userId, momentDoc._id)) !== undefined
        : undefined;

    return {
        ...momentDoc.toObject(),
        numberComments,
        numberLikes,
        createdBy: {
            _id: momentDoc.createdBy._id,
            username: momentDoc.createdBy.username,
            email: momentDoc.createdBy.email,
        },
        isLiked,
    };
};

const addImagesTo = async (userId, momentId, images) => {
    const fileNames = Object.keys(images);

    let newImages = [];
    for (let file of fileNames) {
        const extension = path.extname(images[file].name);
        images[file].id = nanoid();
        const dir = path.join(
            __dirname,
            "..",
            "..",
            "public",
            "images",
            `${images[file].id}${extension}`
        );

        try {
            await images[file].mv(dir);
        } catch (error) {
            throw new InternalServerError(
                "An error happened during file upload, please retry again"
            );
        }

        const savedImage = {
            url: `/images/${images[file].id}${extension}`,
            byteSize: images[file].size,
        };

        newImages.push(savedImage);
    }
    return await saveImagesToDB(userId, momentId, newImages);
};

const saveImagesToDB = async (userId, momentId, images) => {
    // verify the moment does not have images
    const savedMoment = await getAMomentById(momentId);

    if (savedMoment.img?.length) {
        throw new BadRequestError(
            `Moment with id ${momentId} already has images`
        );
    }

    const updatedMoment = await updateMomentBy(
        { createdBy: userId, _id: momentId },
        { $push: { img: images } }
    );

    if (!updatedMoment) {
        throw new NotFoundError(`Moment with id ${momentId} not found`);
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
