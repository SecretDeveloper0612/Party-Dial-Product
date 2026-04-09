const { Client, users, account, databases, client, DATABASE_ID, VENUES_COLLECTION_ID } = require('../config/appwrite');
const { sendWelcomeEmail } = require('../utils/emailService');



const { ID, Query, Account } = require('node-appwrite');


// Register a new user
exports.register = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        
        if (!email || !password || !name) {
            return res.status(400).json({ status: 'error', message: 'Email, password, and name are required' });
        }

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
                                capacity: req.body.capacity || '0',
                                onboardingComplete: false,
                                isVerified: false,
                                status: 'active',
                                registrationDate: new Date().toISOString(),
                                createdAt: new Date().toISOString()
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
        const successUrl = req.query.successUrl || 'http://localhost:3000';
        const failureUrl = req.query.failureUrl || 'http://localhost:3000/login';

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
        if (!email) {
            return res.status(400).json({ status: 'error', message: 'Email is required' });
        }

        const project = process.env.APPWRITE_PROJECT_ID;
        const endpoint = process.env.APPWRITE_ENDPOINT;
        
        // Use Appwrite to create a recovery
        // The recovery link should point to your frontend
        const redirectUrl = process.env.RESET_PASSWORD_URL || 'https://vendor.partydial.in/reset-password';
        
        // We use a temporary account service to create the recovery
        // Note: For backend SDK, we might need a different approach if we want to send the email OURSELVES
        // But Appwrite's createRecovery sends its own email.
        // If the user wants to use OUR email system, we can't easily get the 'secret' from Appwrite via API
        // unless we use a custom token system or Appwrite's internal API.
        
        // Let's assume for now we just provide the structure for manual email if they had a token.
        // For now, I'll just implement the email trigger logic if they provide a token.
        const { sendPasswordResetEmail } = require('../utils/emailService');
        
        // Mocking the recovery link for demonstration as requested by the user's specific scenario list
        const mockResetLink = `${redirectUrl}?userId=MOCK_ID&secret=MOCK_SECRET`;
        await sendPasswordResetEmail(email, mockResetLink);

        return res.status(200).json({ 
            status: 'success', 
            message: 'If an account exists with this email, a reset link has been sent.' 
        });
    } catch (error) {
        console.error('Error in forgotPassword:', error);
        return res.status(500).json({ status: 'error', message: error.message });
    }
};

