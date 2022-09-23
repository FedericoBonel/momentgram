const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
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

    return await createUserBody(foundUser, userId);
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
        usersBodies.push(await createUserBody(user, userId));
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

    const savedUser = await createUser(newUser);

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
            (await bcryptjs.compare(password, savedUser.password))
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
    const { email, _id, ...changes } = updatedUser;

    if (changes.password) {
        changes.password = await bcryptjs.hash(changes.password, 12);
    }

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

    return await createUserBody(savedUser, null);
};

const deleteUserById = async (id) => {
    const deleteResult = await deleteUserBy({ _id: id });

    if (!deleteResult) {
        throw new NotFoundError(`User with id ${id} not found`);
    }

    return deleteResult;
};

const generateToken = (user) => {
    return jwt.sign({ _id: user._id, email: user.email }, SECRET, {
        expiresIn: EXPIRATION_TIME,
    });
};

const createUserBody = async (foundUser, userId) => {
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
    };
};

module.exports = {
    getUserById,
    registerUser,
    updateUserById,
    authenticateUser,
    deleteUserById,
    verifyUserAccount,
    getUsersByFilters,
};
