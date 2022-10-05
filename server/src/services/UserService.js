const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const { nanoid } = require("nanoid");

const userRepository = require("../repositories/UserRepository");
const followerService = require("./FollowerService");
const momentService = require("./MomentService");
const emailService = require("./EmailService");
const fileService = require("./FileService");
const errors = require("../errors");

const SECRET = process.env.SECRET;
const EXPIRATION_TIME = process.env.EXPIRATION_TIME;

/**
 * Gets a user by id
 * @param {String} id Id of the user to be obtained
 * @param {String} userId Id of the logged user (optional, provide to know if the user is followed by logged user)
 * @throws {NotFoundError} If the user was not found
 * @returns The found user
 */
const getUserById = async (id, userId = null) => {
    const foundUser = await userRepository.getUserBy({ _id: id });

    if (!foundUser) {
        throw new errors.NotFoundError(`User with id: ${id} not found`);
    }

    return await toUserDTO(foundUser, userId);
};

/**
 * Gets a list of user by the given filters
 * @param {*} filters Fields of that must match in the found users, if not given returns all users
 * @param {Number} page Page number of the list
 * @param {Number} limit Max number of users per page
 * @param {String} userId Id of the logged user (optional, provide to know if the user is followed by logged user)
 * @returns An array with all the found users
 */
const getUsersByFilters = async (
    filters,
    page = 1,
    limit = 20,
    userId = null
) => {
    const skip = (page - 1) * limit;

    const usersFound = await userRepository.getUsersBy(filters, skip, limit);

    let usersBodies = [];

    for (const user of usersFound) {
        usersBodies.push(await toUserDTO(user, userId));
    }

    return usersBodies;
};

/**
 * Registers a new user and sends a verification email to it's email
 * @param {*} newUser User to be registered
 * @param {*} host domain where the user will be sent to to verify email (i.g. "localhost:3000")
 * @throws {BadRequestError} If the email or username is already registered under another user
 * @returns Id, username, and email of the registered user
 */
const registerUser = async (newUser, host) => {
    const userWithEmail = await userRepository.getUserBy({
        email: newUser.email,
    });
    const userWithUsername = await userRepository.getUserBy({
        username: newUser.username,
    });

    if (userWithEmail || userWithUsername) {
        if (userWithEmail?.validated || userWithUsername?.validated) {
            throw new errors.BadRequestError(
                `User with that email or username exists already`
            );
        } else {
            userRepository.deleteUserBy({ _id: userWithEmail?._id });
            userRepository.deleteUserBy({ _id: userWithUsername?._id });
        }
    }

    newUser.password = await bcryptjs.hash(newUser.password, 12);
    newUser.verificationCode = nanoid();

    await emailService.sendVerificationEmail(newUser, host);

    const userModel = toUserModel(newUser);

    const savedUser = await userRepository.createUser(userModel);

    return {
        _id: savedUser._id,
        email: savedUser.email,
        username: savedUser.username,
    };
};

/**
 * Authenticates the user by email and password
 * @param {String} email Email of the user to be authenticated
 * @param {String} password Password of the user to be authenticated
 * @throws {UnauthorizedError} if email and/or password is incorrect or if the user has not been verified yet
 * @returns email, username, id, and profile photo of the user with a unique JWT
 */
const authenticateUser = async (email, password) => {
    const savedUser = await userRepository.getUserBy({ email: email });

    if (
        !(
            savedUser &&
            savedUser.validated &&
            (await bcryptjs.compare(password, savedUser.password.data))
        )
    ) {
        throw new errors.UnauthorizedError(
            `User not validated yet or with incorrect email or password`
        );
    }

    const newToken = generateToken(savedUser);

    return {
        user: {
            id: savedUser._id,
            email: savedUser.email,
            username: savedUser.username,
            profileImg: savedUser.profileImg,
        },
        token: newToken,
    };
};

/**
 * Validates the user account that has this verification code assigned
 * @param {String} verificationCode Verification code of the registered user
 * @throws {NotFoundError} if the verification code is not assigned to any user
 * @returns Username and first name of the registered user
 */
const verifyUserAccount = async (verificationCode) => {
    const savedUser = await userRepository.getUserBy({
        verificationCode: verificationCode,
    });

    if (!savedUser || savedUser.validated) {
        throw new errors.NotFoundError(
            `User with verification code ${verificationCode} not found`
        );
    }

    savedUser.validated = true;

    await userRepository.updateUserBy(
        {
            _id: savedUser._id,
            verificationCode: savedUser.verificationCode,
        },
        savedUser
    );

    return { username: savedUser.username, firstName: savedUser.firstName };
};

/**
 * Updates the user with the given id
 * @param {String} id Can be any user id, recommended to use the one received in the JWT
 * @param {any} updatedUser updated fields of the user
 */
const updateUserById = async (id, updatedUser) => {
    const { password, email, _id, ...changes } = updatedUser;

    if (changes.username) {
        const foundUser = await userRepository.getUserBy({
            username: changes.username,
        });

        if (foundUser && foundUser._id.toString() !== id) {
            throw new errors.BadRequestError(
                `There already exists a user with username: ${changes.username}`
            );
        }
    }

    const savedUser = await userRepository.updateUserBy({ _id: id }, changes);

    if (!savedUser) {
        throw new errors.NotFoundError(`User with ${id} not found`);
    }

    return await toUserDTO(savedUser, null);
};

/**
 * Deletes the user with the given id from database
 * @param {String} id Id of the user to be deleted
 * @returns The deleted result (i.e. number of posts deleted, likes, etc.)
 */
const deleteUserById = async (id) => {
    const deleteResult = await userRepository.deleteUserBy({ _id: id });

    if (!deleteResult) {
        throw new errors.NotFoundError(`User with id ${id} not found`);
    }

    return deleteResult;
};

/**
 * Updates a user password
 * @param {*} id Id of the user to be updated
 * @param {*} oldPassword Old user password
 * @param {*} newPassword New user password
 */
const updateUserPasswordById = async (id, oldPassword, newPassword) => {
    // Verify user password
    const userFound = await userRepository.getUserBy({ _id: id });

    if (!userFound) {
        throw new errors.NotFoundError(`User with id: ${id} not found`);
    }

    if (
        !(
            userFound.validated &&
            (await bcryptjs.compare(oldPassword, userFound.password.data))
        )
    ) {
        throw new errors.UnauthorizedError(`Incorrect password`);
    }

    // Update the user
    const savedUser = await userRepository.updateUserBy(
        { _id: id },
        { password: { data: await bcryptjs.hash(newPassword, 12) } }
    );

    // Generate new token and return it
    const newToken = generateToken(savedUser);

    return {
        user: {
            id: savedUser._id,
            email: savedUser.email,
            username: savedUser.username,
            profileImg: savedUser.profileImg,
        },
        token: newToken,
    };
};

/**
 * Sets the image as the profile image of the user
 * @param {String} userId Id of the registered user
 * @param {UploadedFile} image File to be assigned as profile photo
 * @throws {NotFoundError} If the user was not found
 * @returns Updated user
 */
const addProfileImage = async (userId, image) => {
    // Get the user and delete existing image
    const foundUser = await userRepository.getUserBy({ _id: userId });

    if (!foundUser) {
        throw new errors.NotFoundError(`User with id: ${id} not found`);
    }

    if (foundUser.profileImg) {
        const imageName = foundUser.profileImg.url.substring(8);
        const dirOldImg = fileService.getDirToImagesFor(imageName);

        await fileService.deleteFile(dirOldImg);
    }

    // Save the file and store it's registry in db
    const fileKey = Object.keys(image)[0];
    image[fileKey].id = nanoid();
    image[fileKey].extension = path.extname(image[fileKey].name);

    const newImageName = `${image[fileKey].id}${image[fileKey].extension}`;

    await fileService.saveImage(image[fileKey], newImageName);

    const profileImg = {
        url: `/images/${newImageName}`,
        byteSize: image[fileKey].size,
    };

    const updatedUser = await userRepository.updateUserBy(
        { _id: userId },
        { profileImg: profileImg }
    );
    return await toUserDTO(updatedUser, userId);
};

/**
 * Validates that the JWT belongs ot an existing user and that it was generated after the last password update
 * @param {String} userId User id of the JWT
 * @param {Number} jwtIssueDate JWT's iat (in seconds)
 * @throws {NotFoundError} if the user was not existing
 * @throws {UnauthorizedError} if the JWT's iat was before last password update
 */
const validateJwtPayload = async (userId, jwtIssueDate) => {
    const foundUser = await userRepository.getUserBy({ _id: userId });

    if (!foundUser) {
        throw new errors.NotFoundError(`User with id: ${id} not found`);
    }

    // Verify that token has been generated after password update
    if (
        jwtIssueDate < Math.floor(foundUser.password.updatedAt.getTime() / 1000)
    ) {
        throw new errors.UnauthorizedError("Invalid Token");
    }
};

/**
 * Generates a new token for the given user
 * @param {*} user User to whom the new JWT should belong to
 * @returns New signed JSON Web Token
 */
const generateToken = (user) => {
    return jwt.sign({ _id: user._id, email: user.email }, SECRET, {
        expiresIn: EXPIRATION_TIME,
    });
};

/**
 * Extracts public information of the found user and returns it
 * @param {*} foundUser User from which to extract information
 * @param {String} userId Id of the logged user (optional, if given checks wether or not logged user follows the found user)
 * @returns Public information of the found user
 */
const toUserDTO = async (foundUser, userId) => {
    const numberFollowers = await followerService.getNumberFollowersOf(
        foundUser._id
    );
    const numberFollowing = await followerService.getNumberFollowingOf(
        foundUser._id
    );
    const numberMoments = await momentService.getNumberMomentsOf(foundUser._id);
    const isFollowing = userId
        ? await followerService.checkFollows(userId, foundUser._id)
        : undefined;

    return {
        _id: foundUser._id,
        username: foundUser.username,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        email: foundUser.email,
        description: foundUser.description,
        numberFollowers,
        numberFollowing,
        numberMoments,
        isFollowing,
        profileImg: foundUser.profileImg,
    };
};

/**
 * Transforms the public information of the user to the model schema
 * @param {*} user User to be transformed
 * @returns The user's data as the user schema
 */
const toUserModel = (user) => {
    return {
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        description: user.description,
        password: {
            data: user.password,
        },
        birthDate: user.birthDate,
        verificationCode: user.verificationCode,
    };
};

module.exports = {
    getUserById,
    registerUser,
    updateUserById,
    authenticateUser,
    deleteUserById,
    updateUserPasswordById,
    verifyUserAccount,
    getUsersByFilters,
    validateJwtPayload,
    addProfileImage,
};
