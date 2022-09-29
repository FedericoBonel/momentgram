const mongoose = require("mongoose");

const passwordSchema = new mongoose.Schema(
    {
        data: {
            type: String,
            required: [true, "Please provide a password"],
        },
    },
    { _id: false, timestamps: { createdAt: false, updatedAt: true } }
);

const profileImgSchema = new mongoose.Schema({
    url: {
        type: String,
        required: [true, "Please provide a profile image url"],
    },
    byteSize: {
        type: Number,
        required: [true, "Please provide an image size in bytes"],
    },
});

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            minlength: 4,
            maxlength: 20,
            required: [true, "Please provide a username"],
            unique: true,
        },
        password: passwordSchema,
        email: {
            type: String,
            required: [true, "Please provide an email"],
            unique: true,
            match: [
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                "Please provide a valid email",
            ],
        },
        firstName: {
            type: String,
            minlength: 2,
            maxlength: 50,
            required: [true, "Please provide a first name"],
        },
        lastName: {
            type: String,
            minlength: 2,
            maxlength: 50,
            required: [true, "Please provide a last name"],
        },
        birthDate: {
            type: Date,
            required: [true, "Please provide a birth date"],
            validate: {
                validator: (v) => v.getFullYear() < new Date().getFullYear(),
                message: (props) => `${props.value} is an invalid birth date`,
            },
        },
        description: {
            type: String,
            minlength: 1,
            maxlength: 150,
        },
        validated: { type: Boolean, default: false },
        verificationCode: { type: String },
        profileImg: profileImgSchema,
    },
    { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
