import { Query, ID, Account } from 'node-appwrite';
import { getAppwriteServices } from '../utils/appwrite';
import crypto from 'node:crypto'; // Supported in nodejs_compat

export const checkPhone = async (c) => {
    try {
        const body = await c.req.json();
        const { phone } = body;
        if (!phone) return c.json({ status: 'error', message: 'Phone number is required' }, 400);

        let cleanPhone = phone.replace(/\D/g, '');
        if (cleanPhone.length === 10) {
            cleanPhone = '+91' + cleanPhone;
        } else if (!phone.startsWith('+')) {
            cleanPhone = '+' + cleanPhone;
        } else {
            cleanPhone = phone;
        }

        const { users } = getAppwriteServices(c.env);
        const userList = await users.list([Query.equal('phone', cleanPhone)]);
        
        if (userList.total > 0) {
            return c.json({ status: 'error', message: 'This number is already in use, use a different one' }, 400);
        }

        return c.json({ status: 'success', message: 'Phone number is available' }, 200);
    } catch (error) {
        return c.json({ status: 'error', message: error.message }, 500);
    }
};

export const register = async (c) => {
    try {
        const body = await c.req.json();
        const { email, password, name } = body;
        
        if (!email || !password || !name) {
            return c.json({ status: 'error', message: 'Email, password, and name are required' }, 400);
        }

        // --- Domain Validation ---
        const disposableDomains = ['mailinator.com', 'yopmail.com', 'temp-mail.org']; // Truncated for brevity
        const emailLower = email.toLowerCase();
        const domain = emailLower.split('@')[1];

        if (disposableDomains.includes(domain)) {
            return c.json({ status: 'error', message: 'Temporary/Disposable email detected.' }, 403);
        }

        // DNS verification via Cloudflare DoH (since dns.resolveMx might fail in workers)
        try {
            const dnsRes = await fetch(`https://cloudflare-dns.com/dns-query?name=${domain}&type=MX`, {
                headers: { 'accept': 'application/dns-json' }
            });
            const dnsData = await dnsRes.json();
            if (!dnsData.Answer || dnsData.Answer.length === 0) {
                return c.json({ status: 'error', message: 'The email domain provided is invalid or cannot receive mail.' }, 400);
            }
        } catch (e) {
            console.warn('DNS check failed', e);
        }

        const { users, databases, databaseId, collections, client } = getAppwriteServices(c.env);
        
        const newUser = await users.create(ID.unique(), email, undefined, password, name);
        
        try {
            await users.updateLabels(newUser.$id, ['vendor']);
        } catch (e) {
            console.warn('Failed to apply vendor label');
        }
        
        if (databaseId && collections.venues) {
            try {
                await databases.createDocument(
                    databaseId, 
                    collections.venues, 
                    ID.unique(), 
                    {
                        userId: newUser.$id,
                        venueName: body.venueName || body.businessName || 'Unnamed Venue',
                        ownerName: body.ownerName || name,
                        contactEmail: email,
                        contactNumber: body.phone || '',
                        status: 'active',
                        subscriptionPlan: body.subscriptionPlan || 'None',
                        registrationDate: new Date().toISOString()
                    }
                );
            } catch (e) {
                console.warn('Venue profile creation failed:', e.message);
            }
        }

        const tempAccount = new Account(client);
        const session = await tempAccount.createEmailPasswordSession(email, password);

        // NOTE: Email sending logic should be imported here and called.

        return c.json({
            status: 'success',
            message: 'User registered and logged in successfully',
            user: newUser,
            session: session
        }, 201);
    } catch (error) {
        if (error.code === 409) {
            return c.json({ status: 'error', message: 'A user with this email already exists.' }, 409);
        }
        return c.json({ status: 'error', message: error.message }, error.code || 500);
    }
};

export const login = async (c) => {
    try {
        const { email, password } = await c.req.json();
        
        if (!email || !password) {
            return c.json({ status: 'error', message: 'Email and password are required' }, 400);
        }

        const { client, users } = getAppwriteServices(c.env);
        const tempAccount = new Account(client);

        if (email === c.env.ADMIN_EMAIL && password === c.env.ADMIN_PASS) {
            return c.json({
                status: 'success',
                message: 'Master Login successful',
                session: { $id: 'master_session_bypass' },
                user: {
                    $id: 'master_admin',
                    name: 'Master Administrator',
                    email,
                    prefs: { role: 'Super Admin' }
                }
            }, 200);
        }

        try {
            const session = await tempAccount.createEmailPasswordSession(email, password);
            const user = await users.get(session.userId);
            const prefs = await users.getPrefs(session.userId);

            return c.json({
                status: 'success',
                message: 'Login successful',
                session: session,
                user: { ...user, prefs, labels: user.labels || [] }
            }, 200);
        } catch (authError) {
            return c.json({ status: 'error', message: authError.message, type: authError.type }, authError.code || 401);
        }
    } catch (error) {
        return c.json({ status: 'error', message: error.message }, 500);
    }
};

export const googleLogin = async (c) => {
    const successUrl = c.req.query('successUrl') || c.env.FRONTEND_URL || 'http://localhost:3000';
    const failureUrl = c.req.query('failureUrl') || `${c.env.FRONTEND_URL}/login` || 'http://localhost:3000/login';
    const authUrl = `${c.env.APPWRITE_ENDPOINT}/account/sessions/oauth2/google?project=${c.env.APPWRITE_PROJECT_ID}&success=${encodeURIComponent(successUrl)}&failure=${encodeURIComponent(failureUrl)}`;
    return c.redirect(authUrl);
};

export const logout = async (c) => {
    return c.json({ status: 'success', message: 'Logged out successfully' }, 200);
};

export const updatePushToken = async (c) => {
    try {
        const { userId, token } = await c.req.json();
        if (!userId || !token) return c.json({ status: 'error', message: 'User ID and Token required' }, 400);

        const { databases, databaseId, collections } = getAppwriteServices(c.env);
        const venueResult = await databases.listDocuments(databaseId, collections.venues, [Query.equal('userId', userId)]);

        if (venueResult.documents.length === 0) {
            return c.json({ status: 'error', message: 'Venue not found' }, 404);
        }

        await databases.updateDocument(databaseId, collections.venues, venueResult.documents[0].$id, { expoPushToken: token });
        return c.json({ status: 'success', message: 'Push token updated' }, 200);
    } catch (error) {
        return c.json({ status: 'error', message: error.message }, 500);
    }
};

export const forgotPassword = async (c) => {
    try {
        const { email } = await c.req.json();
        if (!email) return c.json({ status: 'error', message: 'Email required' }, 400);

        const { users } = getAppwriteServices(c.env);
        const userList = await users.list([Query.equal('email', email)]);
        
        if (userList.total === 0) {
            return c.json({ status: 'success', message: 'Check your email for the reset link.' }, 200);
        }

        const userId = userList.users[0].$id;
        const token = crypto.randomBytes(32).toString('hex');
        
        const currentPrefs = await users.getPrefs(userId);
        await users.updatePrefs(userId, { ...currentPrefs, resetToken: token, resetExpires: Date.now() + 3600000 });

        // Email logic would be here

        return c.json({ status: 'success', message: 'Password reset link sent.' }, 200);
    } catch (error) {
        return c.json({ status: 'error', message: error.message }, 500);
    }
};

export const resetPassword = async (c) => {
    try {
        const { userId, token, password } = await c.req.json();
        if (!userId || !token || !password) return c.json({ status: 'error', message: 'All fields required' }, 400);

        const { users } = getAppwriteServices(c.env);
        const prefs = await users.getPrefs(userId);

        if (!prefs.resetToken || prefs.resetToken !== token || Date.now() > prefs.resetExpires) {
            return c.json({ status: 'error', message: 'Invalid or expired link.' }, 400);
        }

        await users.updatePassword(userId, password);
        const { resetToken, resetExpires, ...remainingPrefs } = prefs;
        await users.updatePrefs(userId, remainingPrefs);

        return c.json({ status: 'success', message: 'Password reset successfully.' }, 200);
    } catch (error) {
        return c.json({ status: 'error', message: error.message }, 500);
    }
};

export const completeRegistration = async (c) => {
    try {
        const { userId, email, password, name } = await c.req.json();
        if (!userId || !email || !password || !name) return c.json({ status: 'error', message: 'All fields required' }, 400);

        const { users } = getAppwriteServices(c.env);
        await users.updateEmail(userId, email);
        await users.updatePassword(userId, password);
        await users.updateName(userId, name);
        try { await users.updateLabels(userId, ['client']); } catch(e){}

        return c.json({ status: 'success', message: 'Registration completed' }, 200);
    } catch (error) {
        return c.json({ status: 'error', message: error.message }, 500);
    }
};
