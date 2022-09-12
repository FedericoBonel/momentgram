const jwt = require("jsonwebtoken");

const { UnauthorizedError } = require("../errors");
const { getUserById } = require("../services/UserService");

const authenticateToken = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!(authorization && authorization.startsWith("Bearer "))) {
        throw new UnauthorizedError(
            "Token should be in header authorization in 'Bearer ' format"
        );
    }

    const token = authorization.substring(7);

    try {
        const user = jwt.verify(token, process.env.SECRET);

        await getUserById(user._id);

        req.user = user;
    } catch (error) {
        throw new UnauthorizedError("Invalid token");
    }

    next();
};

module.exports = authenticateToken;
