const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const { nanoid } = require("nanoid");

const {
    getUserBy,
    getUsersBy,
    createUser,
    updateUserBy,
    deleteUserBy,
} = require("../repositories/UserRepository");
const {
    getNumberFollowersOf,
    getNumberFollowingOf,
    checkFollows,
} = require("./FollowerService");
const { getNumberMomentsOf } = require("./MomentService");
const { sendVerificationEmail } = require("./EmailService");
const { deleteFile } = require("./FileService");
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../errors");

const SECRET = process.env.SECRET;
const EXPIRATION_TIME = process.env.EXPIRATION_TIME;

const getUserById = async (id, userId = null) => {
    const foundUser = await getUserBy({ _id: id });

    if (!foundUser) {
        throw new NotFoundError(`User with id: ${id} not found`);
    }

    return await createExposedUser(foundUser, userId);
};

const getUsersByFilters = async (
    filters,
    page = 1,
    limit = 20,
    userId = null
) => {
    const skip = (page - 1) * limit;

    const usersFound = await getUsersBy(filters, skip, limit);

    let usersBodies = [];

    for (const user of usersFound) {
        usersBodies.push(await createExposedUser(user, userId));
    }

    return usersBodies;
};

const registerUser = async (newUser, host) => {
    const userWithEmail = await getUserBy({ email: newUser.email });
    const userWithUsername = await getUserBy({ username: newUser.username });

    if (userWithEmail || userWithUsername) {
        if (userWithEmail?.validated || userWithUsername?.validated) {
            throw new BadRequestError(
                `User with that email or username exists already`
            );
        } else {
            deleteUserBy({ _id: userWithEmail?._id });
            deleteUserBy({ _id: userWithUsername?._id });
        }
    }

    newUser.password = await bcryptjs.hash(newUser.password, 12);
    newUser.verificationCode = nanoid();

    await sendVerificationEmail(newUser, host);

    const userModel = toUserModel(newUser);

    const savedUser = await createUser(userModel);

    return {
        _id: savedUser._id,
        email: savedUser.email,
        username: savedUser.username,
    };
};

const authenticateUser = async (email, password) => {
    const savedUser = await getUserBy({ email: email });

    if (
        !(
            savedUser &&
            savedUser.validated &&
            (await bcryptjs.compare(password, savedUser.password.data))
        )
    ) {
        throw new UnauthorizedError(
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

const verifyUserAccount = async (verificationCode) => {
    const savedUser = await getUserBy({
        verificationCode: verificationCode,
    });

    if (!savedUser || savedUser.validated) {
        throw new NotFoundError(
            `User with verification code ${verificationCode} not found`
        );
    }

    savedUser.validated = true;

    await updateUserBy(
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
        const foundUser = await getUserBy({ username: changes.username });

        if (foundUser && foundUser._id.toString() !== id) {
            throw new BadRequestError(
                `There already exists a user with username: ${changes.username}`
            );
        }
    }

    const savedUser = await updateUserBy({ _id: id }, changes);

    if (!savedUser) {
        throw new NotFoundError(`User with ${id} not found`);
    }

    return await createExposedUser(savedUser, null);
};

/**
 * Deletes the user with the given id from database
 * @param {String} id Id of the user to be deleted
 * @returns The deleted result (i.e. number of posts deleted, likes, etc.)
 */
const deleteUserById = async (id) => {
    const deleteResult = await deleteUserBy({ _id: id });

    if (!deleteResult) {
        throw new NotFoundError(`User with id ${id} not found`);
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
    const userFound = await getUserBy({ _id: id });

    if (!userFound) {
        throw new NotFoundError(`User with id: ${id} not found`);
    }

    if (
        !(
            userFound.validated &&
            (await bcryptjs.compare(oldPassword, userFound.password.data))
        )
    ) {
        throw new UnauthorizedError(`Incorrect password`);
    }

    // Update the user
    const savedUser = await updateUserBy(
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
        },
        token: newToken,
    };
};

const addProfileImage = async (userId, image) => {
    // Get the user and delete existing image
    const foundUser = await getUserBy({ _id: userId });

    if (!foundUser) {
        throw new NotFoundError(`User with id: ${id} not found`);
    }

    if (foundUser.profileImg) {
        const imageName = foundUser.profileImg.url.substring(8);
        const directory = path.join(
            __dirname,
            "..",
            "..",
            "public",
            "images",
            imageName
        );

        await deleteFile(directory);
    }

    // Save the file and store it's registry in db
    const fileKey = Object.keys(image)[0];
    image[fileKey].id = nanoid();
    image[fileKey].extension = path.extname(image[fileKey].name);

    const directory = path.join(
        __dirname,
        "..",
        "..",
        "public",
        "images",
        `${image[fileKey].id}${image[fileKey].extension}`
    );

    try {
        await image[fileKey].mv(directory);
    } catch (error) {
        throw new InternalServerError(
            "An error happened during file upload, please retry again"
        );
    }

    const profileImg = {
        url: `/images/${image[fileKey].id}${image[fileKey].extension}`,
        byteSize: image[fileKey].size,
    };

    const updatedUser = await updateUserBy(
        { _id: userId },
        { profileImg: profileImg }
    );
    return await createExposedUser(updatedUser, userId);
};

const validateJwtPayload = async (userId, jwtIssueDate) => {
    const foundUser = await getUserBy({ _id: userId });

    if (!foundUser) {
        throw new NotFoundError(`User with id: ${id} not found`);
    }

    // Verify that token has been generated after password update
    if (
        jwtIssueDate < Math.floor(foundUser.password.updatedAt.getTime() / 1000)
    ) {
        throw new UnauthorizedError("Invalid Token");
    }
};

const generateToken = (user) => {
    return jwt.sign({ _id: user._id, email: user.email }, SECRET, {
        expiresIn: EXPIRATION_TIME,
    });
};

const createExposedUser = async (foundUser, userId) => {
    const numberFollowers = await getNumberFollowersOf(foundUser._id);
    const numberFollowing = await getNumberFollowingOf(foundUser._id);
    const numberMoments = await getNumberMomentsOf(foundUser._id);
    const isFollowing = userId
        ? await checkFollows(userId, foundUser._id)
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
