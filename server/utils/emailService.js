const nodemailer = require('nodemailer');

// Initialize transporter
// These should be set in .env
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    // Add timeout and retries for robustness
    connectionTimeout: 10000, 
    greetingTimeout: 10000,
});

const APP_NAME = 'PartyDial';
const BRAND_COLOR = '#8B5CF6'; // Violet-500
const SECONDARY_COLOR = '#EC4899'; // Pink-500
const BG_COLOR = '#0F172A'; // Slate-900

/**
 * Base Email Template Wrapper
 */
const getBaseTemplate = (content, previewText) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${APP_NAME}</title>
    <style>
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #E2E8F0; background-color: #020617; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background: #0F172A; border-radius: 16px; overflow: hidden; border: 1px solid #1E293B; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3); }
        .header { background: linear-gradient(135deg, ${BRAND_COLOR}, ${SECONDARY_COLOR}); padding: 40px 20px; text-align: center; }
        .header h1 { margin: 0; color: white; font-size: 28px; font-weight: 800; letter-spacing: -0.025em; }
        .content { padding: 40px 30px; }
        .footer { padding: 20px; text-align: center; color: #94A3B8; font-size: 12px; background: #1E293B; }
        .button { display: inline-block; padding: 12px 24px; background: ${BRAND_COLOR}; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 20px; transition: opacity 0.2s; }
        .highlight { color: ${SECONDARY_COLOR}; font-weight: 700; }
        p { margin-bottom: 20px; color: #CBD5E1; }
        .card { background: #1E293B; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #334155; }
        .status-badge { display: inline-block; padding: 4px 12px; border-radius: 99px; font-size: 12px; font-weight: 700; text-transform: uppercase; }
        .status-success { background: #065F46; color: #34D399; }
        .status-error { background: #7F1D1D; color: #F87171; }
    </style>
</head>
<body>
    <div style="display: none; max-height: 0px; overflow: hidden;">
        ${previewText}
    </div>
    <div class="container">
        <div class="header">
            <h1>${APP_NAME}</h1>
        </div>
        <div class="content">
            ${content}
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Partydial.com. All rights reserved.</p>
            <p>Making every event extraordinary.</p>
        </div>
    </div>
</body>
</html>
`;

/**
 * Send Email Generic Helper
 */
const sendEmail = async (to, subject, html, text) => {
    if (!to) {
        console.error('Email Error: No recipient address provided');
        return null;
    }

    try {
        // Authenticated user (required for Gmail/Outlook/etc)
        const authenticatedUser = process.env.EMAIL_USER;
        // Preferred 'from' address (might be overridden by some SMTP providers)
        const fromEmail = process.env.EMAIL_FROM || authenticatedUser;
        
        console.log(`Attempting to send email to: ${to} (Subject: ${subject})`);

        const info = await transporter.sendMail({
            from: `"${APP_NAME}" <${fromEmail}>`,
            to,
            subject,
            text: text || 'This email contains important information about your PartyDial account.',
            html,
        });

        console.log('✅ Email sent successfully!');
        console.log('Message ID:', info.messageId);
        console.log('Response:', info.response);
        return info;
    } catch (error) {
        console.error('❌ Nodemailer Error:');
        console.error('Message:', error.message);
        console.error('Code:', error.code);
        console.error('Command:', error.command);
        throw error;
    }
};

/**
 * 1. Welcome Email
 */
exports.sendWelcomeEmail = (to, name) => {
    const html = getBaseTemplate(`
        <h2>Welcome to the Party, ${name}! 🎊</h2>
        <p>We're thrilled to have you join <strong>${APP_NAME}</strong>, the ultimate platform for venue discovery and event planning.</p>
        <p>Your account has been created successfully. You can now start building your venue profile and showcase your amazing space to thousands of potential clients.</p>
        <div class="card">
            <p><strong>Next Steps:</strong></p>
            <ul>
                <li>Complete your venue profile</li>
                <li>Upload high-quality photos</li>
                <li>Add your menu and pricing</li>
            </ul>
        </div>
        <a href="https://vendor.partydial.com/dashboard" class="button">Go to Dashboard</a>
    `, "Welcome to PartyDial! Let's get started on showcasing your venue.");

    return sendEmail(to, `Welcome to ${APP_NAME}! 🎊`, html, `Welcome to ${APP_NAME}, ${name}!`);
};

/**
 * 2. Profile Incomplete Reminder
 */
exports.sendProfileReminder = (to, name) => {
    const html = getBaseTemplate(`
        <h2>Almost there, ${name}! 🚀</h2>
        <p>Your profile is looking good, but it's not quite complete yet. Completed profiles get <strong>5x more inquiries</strong> than incomplete ones.</p>
        <div class="card">
            <p>Missing details often include:</p>
            <ul>
                <li>Cover & Gallery Photos</li>
                <li>Clear Pricing Details</li>
                <li>Detailed Description</li>
            </ul>
        </div>
        <p>Jump back in and finish your setup to start receiving leads!</p>
        <a href="https://vendor.partydial.com/dashboard/onboarding" class="button">Complete My Profile</a>
    `, "Your profile is almost complete! Finish it now to get 5x more leads.");

    return sendEmail(to, "Boost Your Reach - Complete Your Profile! 🚀", html, "Complete your profile on PartyDial.");
};

/**
 * 3. Document Submission Received
 */
exports.sendDocVerificationEmail = (to, name) => {
    const html = getBaseTemplate(`
        <h2>Documents Received! 📄</h2>
        <p>Hi ${name}, we've received your business documents for verification.</p>
        <div class="card">
            <p>Our team is currently reviewing them. This process usually takes <strong>24-48 hours</strong>.</p>
            <p>Verification Status: <span class="status-badge" style="background: #1E293B; color: #94A3B8;">Pending Review</span></p>
        </div>
        <p>Once verified, your venue will gain the <span class="highlight">"Verified Vendor"</span> badge, boosting your trust among customers.</p>
    `, "We've received your documents and they are under review.");

    return sendEmail(to, "Verification Documents Received 📄", html, "Your documents are under review.");
};

/**
 * 4. Document Status Update (Approved/Rejected)
 */
exports.sendDocStatusEmail = (to, name, status, reason = '') => {
    const isApproved = status === 'approved' || status === 'verified';
    const statusText = isApproved ? 'Verified' : 'Action Required';
    const badgeClass = isApproved ? 'status-success' : 'status-error';

    const html = getBaseTemplate(`
        <h2>Verification Update: ${statusText}</h2>
        <p>Hi ${name}, we have an update regarding your document verification.</p>
        <div class="card">
            <p>Status: <span class="status-badge ${badgeClass}">${statusText}</span></p>
            ${isApproved ? 
                '<p>Congratulations! Your venue is now verified. Your listing is live and visible to all users.</p>' : 
                `<p>Unfortunately, we couldn't verify your documents at this time.</p><p><strong>Reason:</strong> ${reason}</p>`
            }
        </div>
        ${!isApproved ? '<a href="https://vendor.partydial.com/dashboard/onboarding" class="button">Re-upload Documents</a>' : ''}
    `, `Your verification status has been updated to ${statusText}.`);

    return sendEmail(to, `Verification Update: ${statusText}`, html, `Your verification status: ${statusText}`);
};

/**
 * 5. Forgot Password
 */
exports.sendPasswordResetEmail = (to, resetLink) => {
    const html = getBaseTemplate(`
        <h2>Reset Your Password</h2>
        <p>We received a request to reset your password for your ${APP_NAME} account.</p>
        <p>Click the button below to choose a new password. This link will expire in 1 hour.</p>
        <a href="${resetLink}" class="button">Reset Password</a>
        <p>If you didn't request this, you can safely ignore this email.</p>
    `, "Use this link to reset your PartyDial password.");

    return sendEmail(to, "Password Reset Request", html, "Reset your password.");
};

/**
 * 6. Payment Successful
 */
exports.sendPaymentConfirmationEmail = (to, name, planName, amount) => {
    const html = getBaseTemplate(`
        <h2>Payment Successful! 💰</h2>
        <p>Thank you for your purchase, ${name}!</p>
        <div class="card">
            <p><strong>Order Details:</strong></p>
            <p>Plan: <span class="highlight">${planName}</span></p>
            <p>Amount: <span class="highlight">₹${amount}</span></p>
            <p>Date: ${new Date().toLocaleDateString()}</p>
        </div>
        <p>Your subscription is now active. You can now access all premium features of ${planName}.</p>
        <a href="https://vendor.partydial.com/dashboard" class="button">Go to Dashboard</a>
    `, `Payment of ₹${amount} for ${planName} was successful.`);

    return sendEmail(to, `Payment Confirmation - ${planName} 💰`, html, `Payment successful for ${planName}.`);
};

/**
 * 7 & 8. Admin Profile Approval/Rejection
 */
exports.sendProfileStatusEmail = (to, name, approved, reason = '') => {
    const statusText = approved ? 'Approved' : 'Rejected';
    const badgeClass = approved ? 'status-success' : 'status-error';

    const html = getBaseTemplate(`
        <h2>Profile Listing: ${statusText}</h2>
        <p>Hi ${name},</p>
        <p>The admin team has reviewed your venue listing.</p>
        <div class="card">
            <p>Status: <span class="status-badge ${badgeClass}">${statusText}</span></p>
            ${approved ? 
                '<p>Your venue listing has been approved and is now live on PartyDial!</p>' : 
                `<p>Your venue listing was not approved at this time.</p><p><strong>Reason:</strong> ${reason}</p>`
            }
        </div>
        ${!approved ? '<a href="https://vendor.partydial.com/dashboard/profile" class="button">Update Profile</a>' : ''}
    `, `Your venue profile has been ${statusText}.`);

    return sendEmail(to, `Venue Profile ${statusText}`, html, `Your venue profile status: ${statusText}`);
};
