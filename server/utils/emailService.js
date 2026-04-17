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
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #000000; background-color: #f8fafc; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); }
        .header { background: linear-gradient(135deg, ${BRAND_COLOR}, ${SECONDARY_COLOR}); padding: 40px 20px; text-align: center; }
        .header h1 { margin: 0; color: white; font-size: 28px; font-weight: 800; letter-spacing: -0.025em; }
        .content { padding: 40px 30px; color: #000000; }
        .footer { padding: 20px; text-align: center; color: #64748b; font-size: 12px; background: #f8fafc; border-top: 1px solid #e2e8f0; }
        .button { display: inline-block; padding: 12px 24px; background: ${BRAND_COLOR}; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 20px; }
        .highlight { color: ${BRAND_COLOR}; font-weight: 700; }
        p { margin-bottom: 20px; color: #334155; }
        .card { background: #f8fafc; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #e2e8f0; color: #000000; }
        .status-badge { display: inline-block; padding: 4px 12px; border-radius: 99px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
        .status-success { background: #dcfce7; color: #166534; }
        .status-error { background: #fee2e2; color: #991b1b; }
        ul { color: #334155; }
        li { margin-bottom: 8px; }
    </style>
</head>
<body>
    <div style="display: none; max-height: 0px; overflow: hidden;">
        ${previewText}
    </div>
    <div class="container">
        <div class="header">
            <h1 style="color: white !important;">${APP_NAME}</h1>
        </div>
        <div class="content">
            ${content}
        </div>
        <div class="footer">
            <p style="margin-bottom: 10px; color: #64748b;">&copy; ${new Date().getFullYear()} PARTYDIAL</p>
            <p style="margin-bottom: 5px; color: #64748b;">A Platform by Preet Tech</p>
            <p style="font-size: 10px; opacity: 0.8; color: #94a3b8;">All billing and operations managed exclusively by Preet Tech</p>
        </div>
    </div>
</body>
</html>
`;

/**
 * Send Email Generic Helper
 */
const sendEmail = async (to, subject, html, text, attachments = []) => {
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
            attachments,
        });

        console.log('✅ Email sent successfully!');
        return info;
    } catch (error) {
        console.error('❌ Nodemailer Error:', error.message);
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
        <a href="https://partner.partydial.com/dashboard" class="button">Go to Dashboard</a>
    `, "Welcome to PartyDial! Let's get started on showcasing your venue.");

    return sendEmail(to, `Welcome to ${APP_NAME}! 🎊`, html, `Welcome to ${APP_NAME}, ${name}!`);
};

/**
 * 2. Profile Incomplete Reminder
 */
exports.sendProfileReminder = (to, name) => {
    const html = getBaseTemplate(`
        <h2>Almost there, ${name}! 🚀</h2>
        <p>Your registration is successful, but your venue profile is not yet visible to potential customers.</p>
        <div class="card" style="border-left: 4px solid #f59e0b; background-color: #fffbeb;">
            <p><strong>⚠️ Visibility Alert:</strong> Incomplete profiles will not be visible on PartyDial until all required information is completed.</p>
        </div>
        <p>Completed profiles get <strong>5x more inquiries</strong> than incomplete ones. Make sure to complete your profile to start receiving leads!</p>
        <div class="card">
            <p><strong>Missing details often include:</strong></p>
            <ul>
                <li>High-quality Gallery Photos</li>
                <li>Clear Pricing & Package Details</li>
                <li>Detailed Venue Description</li>
            </ul>
        </div>
        <p>Jump back in and finish your setup now!</p>
        <a href="https://partner.partydial.com/dashboard/onboarding" class="button">Complete My Profile</a>
    `, "Incomplete profiles will not be visible on PartyDial until completed.");

    return sendEmail(to, "Action Required: Complete your profile to go live 🚀", html, "Your profile is incomplete and not yet visible on PartyDial.");
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
            <p>Verification Status: <span class="status-badge" style="background: #e0e7ff; color: #4338ca;">Pending Review</span></p>
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
        ${!isApproved ? '<a href="https://partner.partydial.com/dashboard/onboarding" class="button">Re-upload Documents</a>' : ''}
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
 * 6. Payment Successful + Detailed Invoice
 */
exports.sendPaymentConfirmationEmail = (to, name, planName, amount, invoiceInfo = null) => {
    const isDetailed = !!invoiceInfo;
    const inv = invoiceInfo || {};
    const billing = inv.billingDetails || {};
    
    const html = getBaseTemplate(`
        <div style="text-align: center; margin-bottom: 30px;">
           <h2 style="margin: 0;">Payment Successful! 🎉</h2>
           <p style="color: #64748b; font-size: 14px;">Thank you for your purchase, ${name}</p>
        </div>

        ${isDetailed ? `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
           <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                 <td width="50%" align="left">
                    <p style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #94a3b8; margin-bottom: 5px;">Billed To</p>
                    <p style="font-size: 13px; font-weight: 700; color: #1e293b; margin: 0;">${billing.name || name}</p>
                    <p style="font-size: 11px; color: #64748b; margin: 2px 0;">${billing.address || '—'}</p>
                    <p style="font-size: 11px; color: #64748b; margin: 2px 0;">${billing.city || ''}, ${billing.state || ''} - ${billing.pincode || ''}</p>
                    ${billing.gstNumber ? `<p style="font-size: 11px; font-weight: 700; color: #1e293b; margin-top: 5px;">GST: ${billing.gstNumber}</p>` : ''}
                 </td>
                 <td width="50%" align="right" valign="top">
                    <p style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #94a3b8; margin-bottom: 5px;">Invoice Details</p>
                    <p style="font-size: 13px; font-weight: 700; color: #1e293b; margin: 0;">#${inv.invoiceNumber}</p>
                    <p style="font-size: 11px; color: #64748b; margin: 2px 0;">${inv.date}</p>
                    <p style="font-size: 11px; color: #166534; font-weight: 700; margin-top: 5px;">Status: Paid</p>
                 </td>
              </tr>
           </table>
        </div>

        <div style="margin-bottom: 20px;">
           <table width="100%" cellpadding="10" cellspacing="0" style="border-collapse: collapse;">
              <thead>
                 <tr style="border-bottom: 2px solid #e2e8f0;">
                    <th align="left" style="font-size: 11px; text-transform: uppercase; color: #94a3b8;">Description</th>
                    <th align="right" style="font-size: 11px; text-transform: uppercase; color: #94a3b8;">Amount</th>
                 </tr>
              </thead>
              <tbody>
                 <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td align="left" style="font-size: 13px; font-weight: 700; color: #1e293b;">${planName}</td>
                    <td align="right" style="font-size: 13px; font-weight: 700; color: #1e293b;">₹${amount}</td>
                 </tr>
              </tbody>
           </table>
        </div>

        <div style="background: #ffffff; border-top: 2px solid ${BRAND_COLOR}; padding-top: 15px;">
           <table width="100%">
              <tr>
                 <td align="right" style="font-size: 13px; color: #64748b;">Subtotal:</td>
                 <td width="100" align="right" style="font-size: 13px; font-weight: 700; color: #1e293b;">₹${amount}</td>
              </tr>
              <tr>
                 <td align="right" style="font-size: 16px; font-weight: 800; color: #1e293b; padding-top: 10px;">Total Paid:</td>
                 <td width="100" align="right" style="font-size: 18px; font-weight: 800; color: ${BRAND_COLOR}; padding-top: 10px;">₹${amount}</td>
              </tr>
           </table>
        </div>
        ` : `
        <div class="card">
            <p><strong>Order Details:</strong></p>
            <p>Plan: <span class="highlight">${planName}</span></p>
            <p>Amount: <span class="highlight">₹${amount}</span></p>
            <p>Date: ${new Date().toLocaleDateString()}</p>
        </div>
        <p>Your subscription is now active. You can now access all premium features of ${planName}.</p>
        `}
        <div style="text-align: center; margin-top: 30px;">
           <p style="color: #64748b; font-size: 12px; margin-bottom: 20px;">This is a system-generated invoice for your subscription to PartyDial.</p>
           <a href="https://partner.partydial.com/dashboard" class="button" style="color: white !important;">Open Partner Dashboard</a>
        </div>
    `, `Invoice for ₹${amount} - ${planName} generated successfully.`);

    return sendEmail(to, `Tax Invoice: #${inv.invoiceNumber || 'Payment'} - ${planName} 🧾`, html, `Your payment for ${planName} was successful. Invoice attached in HTML content.`);
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
        ${!approved ? '<a href="https://partner.partydial.com/dashboard/profile" class="button">Update Profile</a>' : ''}
    `, `Your venue profile has been ${statusText}.`);

    return sendEmail(to, `Venue Profile ${statusText}`, html, `Your venue profile status: ${statusText}`);
};

/**
 * 9. Payment Reminder (Automated)
 */
exports.sendPaymentReminderEmail = (to, name) => {
    const html = getBaseTemplate(`
        <h2>Don't Miss Out on Your Next Booking! 📈</h2>
        <p>Hi ${name},</p>
        <p>Your venue profile is ready, but you're currently missing out on business. To start receiving direct leads and appearing in customer searches, you need to active your subscription.</p>
        <div class="card">
            <p><strong>Standard Benefits:</strong></p>
            <ul>
                <li>Direct leads on WhatsApp/Phone</li>
                <li>Visibility to 1000+ monthly visitors</li>
                <li>"Verified Partner" badge upon approval</li>
                <li>Full control over pricing & packages</li>
            </ul>
        </div>
        <p>Upgrade now and start growing your venue business today.</p>
        <a href="https://partner.partydial.com/dashboard/pricing" class="button">Activate My Plan</a>
    `, "Active your subscription to start receiving leads and growing your business.");

    return sendEmail(to, "Action Required: Active Your Venue Subscription 📈", html, "Active your subscription on PartyDial to start receiving leads.");
};

/**
 * 10. New Lead Notification (Central Admin/Leads Email)
 */
exports.sendLeadNotificationEmail = (to, leadData) => {
    const html = getBaseTemplate(`
        <h2>New Lead Received! 🎊</h2>
        <p>A new inquiry has been submitted on PartyDial. Here are the details:</p>
        <div class="card">
            <p><strong>Customer Details:</strong></p>
            <ul>
                <li><strong>Name:</strong> ${leadData.name}</li>
                <li><strong>Phone:</strong> ${leadData.phone || leadData.number}</li>
                <li><strong>Email:</strong> ${leadData.email || 'N/A'}</li>
            </ul>
        </div>
        <div class="card" style="border-left: 4px solid ${BRAND_COLOR}">
            <p><strong>Event Requirements:</strong></p>
            <ul>
                <li><strong>Event Type:</strong> ${leadData.eventType}</li>
                <li><strong>Guests:</strong> ${leadData.guests || leadData.pax || leadData.guestCapacity}</li>
                <li><strong>Date:</strong> ${leadData.eventDate || leadData.date || 'N/A'}</li>
                <li><strong>Pincode:</strong> ${leadData.pincode || 'N/A'}</li>
            </ul>
        </div>
        ${leadData.notes || leadData.eventDetails ? `
        <div class="card">
            <p><strong>Additional Notes:</strong></p>
            <p>${leadData.notes || leadData.eventDetails}</p>
        </div>` : ''}
        <p>This lead has been recorded in the database and is ready for matching.</p>
        <a href="https://admin.partydial.com/leads" class="button">View All Leads</a>
    `, `New ${leadData.eventType} inquiry from ${leadData.name} (${leadData.guests} guests).`);

    return sendEmail(to, `New Lead Alert: ${leadData.eventType} in ${leadData.pincode || 'Location'} 🎊`, html, `New lead from ${leadData.name}`);
};

/**
 * 11. Membership Quotation/Proposal
 */
exports.sendQuotationEmail = (to, venueName, planName, amount, checkoutLink, attachments = []) => {
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
           <p style="font-size: 12px; color: #64748b;">A detailed breakdown has also been generated in your official PDF dossier.</p>
           <p style="font-size: 12px; color: #64748b; font-weight: 700; margin-top: 5px;">Let's grow your business together!</p>
        </div>
    `, `Specialized Growth Proposal for ${venueName}.`);

    return sendEmail(to, `Exclusive Growth Proposal: ${venueName} x PartyDial 🎊`, html, `Proposal for ${planName} membership.`, attachments);
};
