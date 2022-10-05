const nodemailer = require("nodemailer");

const { InternalServerError } = require("../errors");

const transporter = nodemailer.createTransport({
    port: 465,
    host: process.env.EMAIL_HOST,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    secure: true,
});

/**
 * Sends a verification email to the given user with a link to the given host under /users/verify/:verificationCode
 * @param {*} user User to be sent the verification code
 * @param {*} host Host to which the user is to be linked
 */
const sendVerificationEmail = async (user, host) => {
    const emailContent = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "MomentGram Account Verification",
        html: `
        <h1>Welcome to MomentGram</h1>
        <br>Hello ${user.firstName},
        <br>\uD83E\uDD73 Thank you for signing up to MomentGram \uD83E\uDD73
        <br>"Please click the link below to complete your registration and begin sharing your best moments:
        <br>
        <h3>
        <a href="http://${host}/users/verify/${user.verificationCode}" target="_self">
        VERIFY
        </a>
        </h3>
        <br>We can't wait to see your story,<br><br>
        User support, MomentGram
        `,
    };

    transporter.sendMail(emailContent, (err, info) => {
        if (err) {
            throw new InternalServerError(
                "There was an error while sending verification email, please try again"
            );
        }
    });
};

module.exports = { sendVerificationEmail };
