const nodemailer = require('nodemailer');
const config = require('config');

const sendPasswordResetEmail = async (email, resetLink, code) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.get('emailUsername'),
            pass: config.get('emailPassword'),
        },
    });

    const mailOptions = {
        from: 'SIMEDS', 
        to: email,
        subject: 'Password Reset',
        html: `
            <p>Hello,</p>
            <p>You've requested a password reset. Click the link below to reset your password:</p>
            <a href="${resetLink}">Reset Password</a>
            <p>Please fill the code ${code} in the form and create a new password</p>
            <p>If you didn't request this, please ignore this email.</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Password reset email sent successfully.');
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw new Error('Error sending password reset email.');
    }
};

module.exports = { sendPasswordResetEmail };
