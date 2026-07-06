const APP_NAME = 'PartyDial';
const BRAND_COLOR = '#8B5CF6'; // Violet-500
const SECONDARY_COLOR = '#EC4899'; // Pink-500

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

export const sendEmail = async (env, to, subject, html, text, attachments = []) => {
    if (!to) return null;

    try {
        const fromEmail = env.EMAIL_FROM || "noreply@partydial.com";
        const resendApiKey = env.RESEND_API_KEY;
        
        if (!resendApiKey) {
            throw new Error("RESEND_API_KEY is missing! Hostinger SMTP blocks Cloudflare Workers, so you must use Resend to send emails. Please add your Resend API Key to Cloudflare secrets.");
        }

        const payload = {
            from: `PartyDial <${fromEmail}>`,
            to: [to],
            subject: subject,
            html: html,
            text: text || subject,
        };

        if (attachments && attachments.length > 0) {
            payload.attachments = attachments.map(att => ({
                filename: att.filename,
                content: att.content // Resend accepts Base64 natively
            }));
        }

        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${resendApiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Resend Error: ${response.status} ${JSON.stringify(errorData)}`);
        }

        console.log('✅ Email sent successfully via Resend!');
        return { status: 'success' };
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

export const sendQuotationEmail = (env, to, venueName, planName, amount, checkoutLink, attachments = []) => {
    const html = getBaseTemplate(`
        <div style="text-align: center; margin-bottom: 30px;">
           <h2 style="margin: 0; color: #1e293b;">Executive Membership Proposal 📈</h2>
           <p style="color: #64748b; font-size: 14px; margin-top: 5px;">Prepared for ${venueName}</p>
        </div>

        <p>Hi ${venueName},</p>
        <p>We are excited to share our specialized growth proposal for your venue. Based on our latest analysis, the <strong>${planName}</strong> is perfectly suited to maximize your lead generation on PartyDial.</p>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 25px; margin: 25px 0;">
           <p style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #94a3b8; margin-bottom: 10px;">Investment Summary</p>
           <table width="100%">
              <tr>
                 <td style="font-size: 15px; font-weight: 700; color: #1e293b;">${planName}</td>
                 <td align="right" style="font-size: 18px; font-weight: 800; color: ${BRAND_COLOR};">₹${Number(amount).toLocaleString()}</td>
              </tr>
           </table>
           <p style="font-size: 11px; color: #64748b; margin-top: 10px; line-height: 1.4;">This proposal includes full visibility in your city, direct WhatsApp leads, and a priority placement badge for 1 year.</p>
        </div>

        <div style="text-align: center; margin-top: 35px;">
           <a href="${checkoutLink}" class="button" style="padding: 18px 35px !important; border-radius: 14px !important; font-size: 13px !important; letter-spacing: 0.5px !important; color: white !important;">
              Activate Membership Now
           </a>
           <p style="font-size: 10px; color: #94a3b8; margin-top: 15px;">Secure checkout processed via Razorpay</p>
        </div>

        <div style="border-top: 1px solid #f1f5f9; margin-top: 40px; padding-top: 30px; text-align: center;">
           <p style="font-size: 12px; color: #64748b;">Let's grow your business together!</p>
        </div>
    `, `Specialized Growth Proposal for ${venueName}.`);

    return sendEmail(env, to, `Exclusive Growth Proposal: ${venueName} x PartyDial 🎊`, html, `Proposal for ${planName} membership.`, attachments);
};
