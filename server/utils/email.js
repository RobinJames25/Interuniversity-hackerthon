import 'dotenv/config'
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function sendResetEmail(to, link) {
    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject: 'Reset your Echoes of Ancestors password',
        html: `
        <p>You (or someone else) requested a password reset.</p>
        <p>Click <a href="${link}">here</a> to choose a new password.
        This link expires in 15 minutes.</p>
        <p>If you didn't ask for this, just ignore this email.</p>
        `,
    });
}
