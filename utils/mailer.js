const nodemailer = require('nodemailer');
require('dotenv').config();

const sendMail = async (mailOptions) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.ADMIN_MAIL,
            pass: process.env.ADMIN_MAIL_PASSKEY,
        },
    });

    try {
        await transporter.sendMail(mailOptions)
    } catch (error) {
        console.log(error)
    }
}

module.exports = sendMail