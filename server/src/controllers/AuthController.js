const { StatusCodes } = require("http-status-codes");

const { registerUser, authenticateUser} = require("../services/UserService");
const { SuccessPayload } = require("../payloads");

const verifyEmailPassword = async (req, res) => {
    const { email, password } = req.body;

    const userAndToken = await authenticateUser(email, password);

    res.status(StatusCodes.OK).json(new SuccessPayload(userAndToken));
};

const signUpUser = async (req, res) => {
    const newUser = req.body;

    const savedUser = await registerUser(newUser);

    res.status(StatusCodes.CREATED).json(new SuccessPayload(savedUser));
};

module.exports = { verifyEmailPassword, signUpUser };
