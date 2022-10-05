const { StatusCodes } = require("http-status-codes");

const { registerUser, authenticateUser } = require("../services/UserService");
const { SuccessPayload } = require("../payloads");

/** Authenticates a user by password and email */
const verifyEmailPassword = async (req, res) => {
    const { email, password } = req.body;

    const userAndToken = await authenticateUser(email, password);

    res.status(StatusCodes.OK).json(new SuccessPayload(userAndToken));
};

/** Registers a new user */
const signUpUser = async (req, res) => {
    const newUser = req.body;

    const host = req.query.host
        ? req.query.host
        : `${req.headers["x-forwarded-host"] || req.headers["host"]}${
              process.env.API_BASE_URL
          }`;

    const savedUser = await registerUser(newUser, host);

    res.status(StatusCodes.CREATED).json(new SuccessPayload(savedUser));
};

module.exports = { verifyEmailPassword, signUpUser };
