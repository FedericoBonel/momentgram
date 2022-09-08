const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
    getUserBy,
    createUser,
    updateUserBy,
} = require("../repositories/UserRepository");
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../errors");

const SECRET = process.env.SECRET;
const EXPIRATION_TIME = process.env.EXPIRATION_TIME;

const getUserById = async (id) => {
    const foundUser = await getUserBy({ id: id });

    // TODO Check if user is unvalid, if so delete it and register the new one
    if (!foundUser) {
        throw new NotFoundError(`User with id: ${id} not found`);
    }

    return foundUser;
};

const registerUser = async (newUser) => {
    const userWithEmail = await getUserBy({ email: newUser.email });

    if (userWithEmail) {
        throw new BadRequestError(`User with that email exists already`);
    }

    newUser.password = await bcryptjs.hash(newUser.password, 12);

    const savedUser = await createUser(newUser);

    return {
        _id: savedUser._id,
        email: savedUser.email,
        username: savedUser.username,
    };
};

/**
 * Updates the user with the given id
 * @param {String} id Can be any id, recommended to use the one received in the JWT
 * @param {any} updatedUser updated fields of the user
 */
const updateUserById = async (id, updatedUser) => {
    const savedUser = await updateUserBy({ _id: id }, updatedUser);

    if (!updatedUser) {
        throw new NotFoundError(`User with ${id} not found`);
    }

    return savedUser;
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

const generateToken = (user) => {
    return jwt.sign({ _id: user._id, email: user.email }, SECRET, {
        expiresIn: EXPIRATION_TIME,
    });
};

module.exports = {
    getUserById,
    registerUser,
    updateUserById,
    authenticateUser,
};
