import { WorkerMailer } from 'worker-mailer';

const APP_NAME = 'PartyDial';
const BRAND_COLOR = '#8B5CF6'; // Violet-500
const SECONDARY_COLOR = '#EC4899'; // Pink-500
const BG_COLOR = '#0F172A'; // Slate-900

const getBaseTemplate = (content, previewText) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${APP_NAME}</title>
    <style>
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #000000; background-color: #f8fafc; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); }
        .header { background: linear-gradient(135deg, ${BRAND_COLOR}, ${SECONDARY_COLOR}); padding: 40px 20px; text-align: center; }
        .header h1 { margin: 0; color: white; font-size: 28px; font-weight: 800; letter-spacing: -0.025em; }
        .content { padding: 40px 30px; color: #000000; }
        .footer { padding: 30px 20px; text-align: center; color: #64748b; font-size: 12px; background: #f8fafc; border-top: 1px solid #e2e8f0; }
        .button { display: inline-block; padding: 12px 24px; background: ${BRAND_COLOR}; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="color: white !important;">${APP_NAME}</h1>
        </div>
        <div class="content">
            ${content}
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} PARTYDIAL</p>
        </div>
    </div>
</body>
</html>
`;

export const sendEmail = async (env, to, subject, html, text) => {
    if (!to) return null;

    try {
        const mailer = await WorkerMailer.connect({
            host: env.EMAIL_HOST || 'smtp.hostinger.com',
            port: 587,
            secure: false,
            startTls: true,
            credentials: {
                username: env.EMAIL_USER,
                password: env.EMAIL_PASS,
            }
        });

        const fromEmail = env.EMAIL_FROM || env.EMAIL_USER;

        const info = await mailer.send({
            from: `"${APP_NAME}" <${fromEmail}>`,
            to,
            subject,
            text: text || 'This email contains important information.',
            html,
        });

        await mailer.close();

        console.log('✅ Email sent successfully!');
        return info;
    } catch (error) {
        console.error('❌ Mailer Error:', error.message);
        throw error;
    }
};

export const sendPasswordResetEmail = (env, to, resetLink) => {
    const html = getBaseTemplate(`
        <h2>Reset Your Password</h2>
        <p>We received a request to reset your password for your ${APP_NAME} account.</p>
        <p>Click the button below to choose a new password. This link will expire in 1 hour.</p>
        <a href="${resetLink}" class="button">Reset Password</a>
        <p>If you didn't request this, you can safely ignore this email.</p>
    `, "Use this link to reset your password.");

    return sendEmail(env, to, "Password Reset Request", html, "Reset your password.");
};
