// BackEnd/config/sendEmail.js
const nodemailer = require('nodemailer');

// Strip surrounding quotes if dotenv didn't (defensive)
const clean = (v) => (typeof v === 'string' ? v.replace(/^["']|["']$/g, '') : v);

const transporter = nodemailer.createTransport({
    host: clean(process.env.SMTP_HOST) || 'smtp.hostinger.com',
    port: Number(clean(process.env.SMTP_PORT)) || 465,
    secure: clean(process.env.SMTP_SECURE) === 'true',
    auth: {
        user: clean(process.env.SMTP_USER),
        pass: clean(process.env.SMTP_PASS),
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
});

transporter.verify((err) => {
    if (err) console.error('❌ SMTP connection failed:', err.message);
    else console.log('✅ SMTP ready:', clean(process.env.SMTP_USER));
});

const sendEmail = async ({ to, subject, html }) => {
    try {
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.warn('⚠️  SMTP not configured. Email skipped.');
            return { success: false, error: 'SMTP not configured' };
        }

        const info = await transporter.sendMail({
            from: clean(process.env.EMAIL_FROM) || clean(process.env.SMTP_USER),
            to,
            subject,
            html,
        });

        return { success: true, messageId: info.messageId };
    } catch (err) {
        console.error('❌ Email failed:', err.message);
        return { success: false, error: err.message };
    }
};

module.exports = sendEmail;