const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.EMAIL_CLIENT_ID,
        clientSecret: process.env.EMAIL_CLIENT_SECRET,
        refreshToken: process.env.EMAIL_REFRESH_TOKEN,
        // accessToken: process.env.EMAIL_ACCESS_TOKEN
    }
});

exports.sendRegistrationEmail = async (userEmail, eventTitle) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: `Registration Confirmation for ${eventTitle}`,
        text: `You have successfully registered for the event: ${eventTitle}.`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${userEmail}`);
    } catch (error) {
        console.error(`Error sending email to ${userEmail}: ${error}`);
    }
};
