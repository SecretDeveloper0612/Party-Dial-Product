const { Client, users, account, databases, client, DATABASE_ID, VENUES_COLLECTION_ID } = require('../config/appwrite');
const { sendWelcomeEmail } = require('../utils/emailService');
const dns = require('dns').promises;



const { ID, Query, Account } = require('node-appwrite');


// Register a new user
exports.register = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        
        if (!email || !password || !name) {
            return res.status(400).json({ status: 'error', message: 'Email, password, and name are required' });
        }

        // --- Advanced Domain Validation: Block Disposable & Verify MX ---
        const disposableDomains = [
            'mailinator.com', 'yopmail.com', 'temp-mail.org', 'tempmail.com', 
            'guerrillamail.com', 'sharklasers.com', '10minutemail.com', 
            'dispostable.com', 'getnada.com', 'throwawaymail.com', 'mailcatch.com',
            'trashmail.com', 'mail-temp.com', 't-mail.com', 'maildrop.cc', 
            'disposable.com', 'spam4.me', 'anonymbox.com', 'tempmail.net',
            'disposablemail.com', 'mintemail.com', 'meltmail.com', 'zetmail.com',
            'fakeinbox.com', 'mytrashmail.com', 'pookmail.com', 'spambox.us',
            'tempemail.co', 'tempmailaddress.com', 'disposable-email.net'
        ];
        
        const emailLower = email.toLowerCase();
        const domain = emailLower.split('@')[1];

        // 1. Check against blocklist
        if (disposableDomains.includes(domain)) {
            return res.status(403).json({ 
                status: 'error', 
                message: 'Temporary/Disposable email detected. Please use a permanent business email.' 
            });
        }
        
        // 2. Block common "fake" prefixes
        const fakePatterns = ['test@', 'admin@', 'example@', 'abc@', '123@', 'noreply@', 'user@', 'asdf@', 'qwerty@'];
        if (fakePatterns.some(p => emailLower.startsWith(p))) {
            return res.status(403).json({ 
                status: 'error', 
                message: 'Standard fake email patterns are restricted. Please provide a legal business email.' 
            });
        }

        // 3. DNS Verification: Check for valid MX records (ensures domain is real & can receive mail)
        try {
            const mxRecords = await dns.resolveMx(domain);
            if (!mxRecords || mxRecords.length === 0) {
                throw new Error('No MX records');
            }
        } catch (dnsError) {
            console.warn(`DNS check failed for ${domain}:`, dnsError.message);
            return res.status(400).json({ 
                status: 'error', 
                message: 'The email domain provided is invalid or cannot receive mail. Please use a legal, active email.' 
            });
        }
        // ------------------------------------------------------------------

        // Create the user in Appwrite using the admin Users service
        const newUser = await users.create(ID.unique(), email, undefined, password, name);
        
        // --- Added: Create Venue Profile in Database ---
        try {
            if (DATABASE_ID && VENUES_COLLECTION_ID) {
                        // Create the document with required defaults per schema
                        await databases.createDocument(
                            DATABASE_ID, 
                            VENUES_COLLECTION_ID, 
                            ID.unique(), 
                            {
                                userId: newUser.$id,
                                venueName: req.body.venueName || req.body.businessName || 'Unnamed Venue',
                                ownerName: req.body.ownerName || name,
                                contactEmail: email,
                                contactNumber: req.body.phone || '',
                                city: req.body.city || '',
                                state: req.body.state || '',
                                pincode: req.body.pincode || '',
                                venueType: req.body.venueType || 'Banquet Hall',
                                capacity: (() => {
                                    let cap = String(req.body.capacity || '0');
                                    // Robust parsing for ranges like '1000-2000' or '5000+'
                                    if (cap.includes('-')) {
                                        cap = cap.split('-').pop().trim();
                                    } else if (cap.includes('+')) {
                                        cap = cap.replace('+', '').trim();
                                    }
                                    const parsed = parseInt(cap);
                                    return !isNaN(parsed) ? Math.max(1, Math.min(10000, parsed)) : 1;
                                })(),
                                onboardingComplete: false,
                                isVerified: false,
                                status: 'active',
                                registrationDate: new Date().toISOString()
                            }
                        );
            }
        } catch (dbError) {
            console.error('Error creating venue profile:', dbError.message);
            // We skip throwing an error here to prevent blocking the entire registration 
            // if just the profile entry fails (Auth already succeeded)
        }
        // -------------------------------------------------

        // After registration, automatically create a session for the user

        const tempClient = new Client()
            .setEndpoint(process.env.APPWRITE_ENDPOINT)
            .setProject(process.env.APPWRITE_PROJECT_ID);
        
        const tempAccount = new Account(tempClient);
        const session = await tempAccount.createEmailPasswordSession(email, password);
        
        // Send Welcome Email (Non-blocking but logged)
        sendWelcomeEmail(email, name)
            .then(() => console.log(`Welcome email triggered for ${email}`))
            .catch(err => console.error(`Failed to send welcome email to ${email}:`, err.message));

        return res.status(201).json({
            status: 'success',
            message: 'User registered and logged in successfully',
            user: newUser,
            session: session
        });

    } catch (error) {
        console.error('Error in registration:', error);
        
        // Handle User already exists
        if (error.code === 409) {
            return res.status(409).json({
                status: 'error',
                message: 'A user with this email already exists. Please login instead.'
            });
        }

        return res.status(error.code || 500).json({
            status: 'error',
            message: error.message || 'Error occurred during registration'
        });
    }
};



// Login a user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ status: 'error', message: 'Email and password are required' });
        }

        // To verify credentials in a backend SDK with an API key, 
        // we use a temporary client without the API key to attempt session creation
        const tempClient = new Client()
            .setEndpoint(process.env.APPWRITE_ENDPOINT)
            .setProject(process.env.APPWRITE_PROJECT_ID);
        
        const tempAccount = new Account(tempClient);

        // ── MASTER ADMIN BYPASS ──
        const masterAdminEmail = process.env.ADMIN_EMAIL || "admin@partydial.com";
        const masterAdminPass = process.env.ADMIN_PASS || "Admin123";

        if (email === masterAdminEmail && password === masterAdminPass) {
            console.log('Master Admin login detected');
            return res.status(200).json({
                status: 'success',
                message: 'Master Login successful',
                session: { $id: 'master_session_bypass' },
                user: {
                    $id: 'master_admin',
                    name: 'Master Administrator',
                    email: masterAdminEmail,
                    prefs: {
                        role: 'Super Admin',
                        moduleAccess: JSON.stringify(["Dashboard", "Venues", "Users", "Leads", "Billing", "Approvals"])
                    }
                }
            });
        }

        try {
            const session = await tempAccount.createEmailPasswordSession(email, password);
            
            // Fetch user details and preferences
            const user = await users.get(session.userId);
            const prefs = await users.getPrefs(session.userId);

            return res.status(200).json({
                status: 'success',
                message: 'Login successful',
                session: session,
                user: { ...user, prefs }
            });
        } catch (authError) {
            console.error('Auth check failed:', authError.message, authError.type);
            return res.status(authError.code || 401).json({ 
                status: 'error', 
                message: authError.message || 'Invalid credentials or login failed',
                type: authError.type
            });
        }


    } catch (error) {
        console.error('Error in login:', error);
        return res.status(error.code || 500).json({
            status: 'error',
            message: error.message || 'Error occurred during login'
        });
    }
};

// Google Login
exports.googleLogin = async (req, res) => {
    try {
        const successUrl = req.query.successUrl || process.env.FRONTEND_URL || 'http://localhost:3000';
        const failureUrl = req.query.failureUrl || `${process.env.FRONTEND_URL}/login` || 'http://localhost:3000/login';

        const project = process.env.APPWRITE_PROJECT_ID;
        const endpoint = process.env.APPWRITE_ENDPOINT;


        // Redirect URL to initiate OAuth flow
        const authUrl = `${endpoint}/account/sessions/oauth2/google?project=${project}&success=${encodeURIComponent(successUrl)}&failure=${encodeURIComponent(failureUrl)}`;

        // Redirect the browser to Appwrite's OAuth initiation endpoint
        return res.redirect(authUrl);
    } catch (error) {

        console.error('Error in googleLogin:', error);
        return res.status(error.code || 500).json({
            status: 'error',
            message: error.message || 'Error occurred during Google login initiation'
        });
    }
};

// Logout
exports.logout = async (req, res) => {
    try {
        return res.status(200).json({
            status: 'success',
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Error in logout:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Error occurred during logout'
        });
    }
};

// Update Expo Push Token
exports.updatePushToken = async (req, res) => {
    try {
        const { userId, token } = req.body;
        if (!userId || !token) {
            return res.status(400).json({ status: 'error', message: 'User ID and Token are required' });
        }

        // Find the venue associated with this user
        const venueResult = await databases.listDocuments(
            DATABASE_ID,
            VENUES_COLLECTION_ID,
            [Query.equal('userId', userId)]
        );

        if (venueResult.documents.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Venue not found for this user' });
        }

        const venueId = venueResult.documents[0].$id;

        // Update the venue document with the token
        await databases.updateDocument(
            DATABASE_ID,
            VENUES_COLLECTION_ID,
            venueId,
            { expoPushToken: token }
        );

        return res.status(200).json({ status: 'success', message: 'Push token updated' });
    } catch (error) {
        console.error('Error updating push token:', error);
        return res.status(500).json({ status: 'error', message: error.message });
    }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        console.log(`Password reset request received for: ${email}`);

        if (!email) {
            return res.status(400).json({ status: 'error', message: 'Email is required' });
        }

        // 1. Find the user by email
        console.log('Searching for user in Appwrite...');
        const userList = await users.list([Query.equal('email', email)]);
        
        if (userList.total === 0) {
            console.log(`User not found: ${email}`);
            // For security, don't reveal if user exists. Just return success.
            return res.status(200).json({ 
                status: 'success', 
                message: 'Check your email for the reset link.' 
                // Wait, if it doesn't exist, we still say success to avoid enumeration
            });
        }

        const user = userList.users[0];
        const userId = user.$id;
        console.log(`User found: ${userId}`);

        // 2. Generate a secure random token
        const crypto = require('crypto');
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = Date.now() + 3600000; // 1 hour

        // 3. Store token in user preferences (fastest way without new collection)
        console.log('Updating user preferences with reset token...');
        const currentPrefs = await users.getPrefs(userId);
        await users.updatePrefs(userId, {
            ...currentPrefs,
            resetToken: token,
            resetExpires: expiresAt
        });

        // 4. Send Custom Email
        const { sendPasswordResetEmail } = require('../utils/emailService');
        // fallback to live domain if localhost is found in production environment
        let baseUrl = process.env.FRONTEND_URL || 'https://partner.partydial.com';
        if (process.env.NODE_ENV === 'production' && baseUrl.includes('localhost')) {
            baseUrl = 'https://partner.partydial.com';
        }
        
        const resetLink = `${baseUrl}/reset-password?userId=${userId}&token=${token}`;
        console.log(`Sending reset email with link: ${resetLink}`);
        
        await sendPasswordResetEmail(email, resetLink);
        console.log('Reset email sent successfully');

        return res.status(200).json({ 
            status: 'success', 
            message: 'Password reset link has been sent to your email.' 
        });
    } catch (error) {
        console.error('Error in forgotPassword:', error);
        return res.status(error.code || 500).json({ 
            status: 'error', 
            message: error.message || 'An error occurred while processing your request' 
        });
    }
};

// Reset Password (Verify Token & Update)
exports.resetPassword = async (req, res) => {
    try {
        const { userId, token, password } = req.body;
        
        if (!userId || !token || !password) {
            return res.status(400).json({ status: 'error', message: 'All fields are required' });
        }

        // 1. Get user preferences
        const prefs = await users.getPrefs(userId);
        
        // 2. Validate token and expiry
        if (!prefs.resetToken || prefs.resetToken !== token || Date.now() > prefs.resetExpires) {
            return res.status(400).json({ 
                status: 'error', 
                message: 'Invalid or expired reset link. Please request a new one.' 
            });
        }

        // 3. Update password (using Admin SDK users service)
        await users.updatePassword(userId, password);

        // 4. Clear the reset token
        const { resetToken, resetExpires, ...remainingPrefs } = prefs;
        await users.updatePrefs(userId, remainingPrefs);

        return res.status(200).json({ 
            status: 'success', 
            message: 'Password has been reset successfully.' 
        });
    } catch (error) {
        console.error('Error in resetPassword:', error);
        return res.status(500).json({ status: 'error', message: error.message });
    }
};

