const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || '',
        pass: process.env.EMAIL_PASS || ''
    },
    tls: {
        rejectUnauthorized: false
    }
});

const sendBookingEmail = async (userEmail, userName, eventTitle) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.log(`ℹ️ [Email Not Sent] EMAIL_USER/EMAIL_PASS not set in server/.env for ${userEmail}`);
            return;
        }
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: `Booking Confirmed: ${eventTitle}`,
            html: `
        <h2>Hi ${userName}!</h2>
        <p>Your booking for the event <strong>${eventTitle}</strong> is successfully confirmed.</p>
        <p>Thank you for choosing Eventify.</p>
      `
        };
        await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully to', userEmail);
    } catch (error) {
        console.error('⚠️ Error sending email:', error.message);
    }
};

const sendOTPEmail = async (userEmail, otp, type) => {
    // ALWAYS print the OTP code to terminal for instant testing
    console.log(`\n=================================================`);
    console.log(`🔑 DEV OTP CODE FOR [${userEmail}]: >>> ${otp} <<<`);
    console.log(`=================================================\n`);

    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.log(`ℹ️ Real email delivery skipped: EMAIL_USER/EMAIL_PASS not configured in server/.env.`);
            console.log(`👉 Please use the Dev OTP code printed above: ${otp}`);
            return;
        }

        const title = type === 'account_verification' ? 'Verify your Eventify Account' : 'Eventify Booking Verification';
        const msg = type === 'account_verification'
            ? 'Please use the following OTP to verify your new Eventify account.'
            : 'Please use the following OTP to verify and confirm your event booking.';

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: title,
            html: `
                <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                    <h2 style="color: #111;">${title}</h2>
                    <p style="color: #555; font-size: 16px;">${msg}</p>
                    <div style="margin: 20px auto; padding: 15px; font-size: 24px; font-weight: bold; background: #f4f4f4; width: max-content; letter-spacing: 5px;">
                        ${otp}
                    </div>
                    <p style="color: #999; font-size: 12px;">This code expires in 5 minutes. If you didn't request this, please ignore this email.</p>
                </div>
            `
        };
        await transporter.sendMail(mailOptions);
        console.log(`✅ OTP email sent to ${userEmail} for ${type}`);
    } catch (error) {
        console.error('⚠️ Error sending OTP email:', error.message);
        console.log(`👉 You can still use the Dev OTP code printed above: ${otp}`);
    }
};

module.exports = { sendBookingEmail, sendOTPEmail };
