import nodemailer from "nodemailer";

//load config env
import dotenv from "dotenv";
dotenv.config({ path: "./config/config.env" });

// //load variabes from config.env
// const dbHost = process.env.DB_HOST;
// const dbPort = process.env.DB_PORT;
// const dbUsername = process.env.DB_USERNAME;
const mailerUser = process.env.MAIL_USER;
const mailerPass = process.env.MAIL_PASS;

// //throw error if env not set
// if (!dbHost || !dbPort || !dbUsername || !dbPassword || !dbName) {
//     throw new Error("database environment variables must be set");
// }

const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: mailerUser,
        pass: mailerPass,
    },
});

// async..await is not allowed in global scope, must use a wrapper
async function sendMail(receiver, subject, body) {
    const mailOptions = {
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: receiver, // list of receivers
        subject: subject, //"Hello ✔", // Subject line
        text: body, // plain text body
        // html: "<b>Hello world?</b>", // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email: ", error);
        } else {
            console.log("Email sent: ", info.response);
        }
    });

    // console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    //
    // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
    //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
    //       <https://github.com/forwardemail/preview-email>
    //
}

export default sendMail;
