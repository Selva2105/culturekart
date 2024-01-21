const nodemailer = require('nodemailer');
require('dotenv').config();

/**
 * Sends an email using Nodemailer.
 * @param {Object} mailOptions - Options for the email (e.g., to, subject, text/html content).
 */
const sendMail = async (mailOptions) => {

    // Create a Nodemailer transporter with Gmail as the email service provider
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use SSL
        auth: {
            user: process.env.ADMIN_MAILID, // Sender's email address
            pass: process.env.ADMIN_MAIL_PASSWORD, // Sender's email password or app-specific passkey
        },
    });

    try {
        // Attempt to send the email using the configured transporter
        await transporter.sendMail(mailOptions);
    } catch (error) {
        // Log any errors that occur during the email sending process
        console.error("Error sending email:", error);
    }
}

module.exports = sendMail;
