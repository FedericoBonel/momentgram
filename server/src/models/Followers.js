const mongoose = require("mongoose");

const followerSchema = new mongoose.Schema(
    {
        follower: {
            type: mongoose.Types.ObjectId,
            ref: "User",
        },
        followed: {
            type: mongoose.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

const followerModel = mongoose.model("Follower", followerSchema);

module.exports = followerModel;
