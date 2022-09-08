const User = require("../models/User");

const getUserBy = async (filters = {}) => {
    const foundUser = await User.findOne(filters);
    return foundUser;
};

const createUser = async (newUser) => {
    // Make sure that the id is not set
    const { _id, ...user } = newUser;

    return await User.create(user);
};

const updateUserBy = async (filters, updatedUser) => {
    const savedUser = await User.findOneAndUpdate(filters, updatedUser, {
        new: true,
    });

    return savedUser;
};

// TODO Delete user, should access moments repository and delete those that where created by the user to delete
// Same with MomentComments, Followers, and Momentlikes
// Basically a cascade operation

module.exports = { getUserBy, createUser, updateUserBy };
