const User = require("../models/User");
const { deleteManyMomentsBy } = require("./MomentRepository");
const { deleteManyCommentsBy } = require("./MomentCommentRepository");
const { deleteManyLikesBy } = require("./MomentLikeRepository");
const { deleteManyFollowersBy } = require("./FollowerRepository");

const getUserBy = async (filters = {}) => {
    return await User.findOne(filters);
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

const deleteUserBy = async (filters) => {
    const deletedUser = await User.findOneAndDelete(filters);

    if (!deletedUser) return null;

    // Cascade the operation to all the rest of collections

    const deletedMoments = await deleteManyMomentsBy({
        createdBy: deletedUser._id,
    });

    const deletedLikes = await deleteManyLikesBy({
        createdBy: deletedUser._id,
    });

    const deletedComments = await deleteManyCommentsBy({
        createdBy: deletedUser._id,
    });

    const deletedFollowing = await deleteManyFollowersBy({
        follower: deletedUser._id,
    });

    const deletedFollowers = await deleteManyFollowersBy({
        followed: deletedUser._id,
    });

    return {
        deletedUser: deletedUser._id,
        deletedMoments: deletedMoments.deletedCount,
        deletedLikes: deletedLikes.deletedCount,
        deletedComments: deletedComments.deletedCount,
        deletedFollowing: deletedFollowing.deletedCount,
        deletedFollowers: deletedFollowers.deletedCount,
    };
};

module.exports = { getUserBy, createUser, updateUserBy, deleteUserBy };
