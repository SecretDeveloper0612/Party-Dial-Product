const { users } = require('../config/appwrite');
const { ID } = require('node-appwrite');

// GET all system users (Appwrite accounts)
exports.getAllUsers = async (req, res) => {
  try {
    const result = await users.list();
    return res.status(200).json({ status: 'success', data: result.users, total: result.total });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

// GET single user
exports.getUserById = async (req, res) => {
  try {
    const user = await users.get(req.params.id);
    const prefs = await users.getPrefs(req.params.id);
    return res.status(200).json({ status: 'success', data: { ...user, prefs } });
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

// POST create a new admin/team user
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, region, state, city, pincode, reportingTo, moduleAccess } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ status: 'error', message: 'Name, email, and password are required.' });
    }

    const newUser = await users.create(ID.unique(), email, undefined, password, name);

    // Store extra metadata in Appwrite user prefs
    await users.updatePrefs(newUser.$id, {
      role: role || 'BDE',
      region: region || '',
      state: state || '',
      city: city || '',
      pincode: pincode || '',
      reportingTo: reportingTo || '',
      moduleAccess: JSON.stringify(moduleAccess || ['Dashboard']),
      status: 'Active',
    });

    return res.status(201).json({
      status: 'success',
      message: 'User created successfully',
      data: newUser,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

// PATCH update user profile/prefs
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, region, state, city, pincode, reportingTo, moduleAccess, status } = req.body;

    if (name) await users.updateName(id, name);

    await users.updatePrefs(id, {
      role: role || 'BDE',
      region: region || '',
      state: state || '',
      city: city || '',
      pincode: pincode || '',
      reportingTo: reportingTo || '',
      moduleAccess: JSON.stringify(moduleAccess || ['Dashboard']),
      status: status || 'Active',
    });

    const updated = await users.get(id);
    const prefs = await users.getPrefs(id);

    return res.status(200).json({
      status: 'success',
      message: 'User updated successfully',
      data: { ...updated, prefs },
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

// PATCH toggle user status (active/blocked)
exports.toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { blocked } = req.body; // true = block, false = unblock
    await users.updateStatus(id, !blocked);

    // Also update prefs status label
    const prefs = await users.getPrefs(id);
    await users.updatePrefs(id, { ...prefs, status: blocked ? 'Inactive' : 'Active' });

    return res.status(200).json({
      status: 'success',
      message: blocked ? 'User blocked' : 'User activated',
    });
  } catch (error) {
    console.error('Error toggling user status:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

// DELETE user
exports.deleteUser = async (req, res) => {
  try {
    await users.delete(req.params.id);
    return res.status(200).json({ status: 'success', message: 'User deleted' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

// POST send profile completion reminders to all incomplete profiles
exports.sendProfileReminders = async (req, res) => {
  try {
    const { databases, DATABASE_ID, VENUES_COLLECTION_ID } = require('../config/appwrite');
    const { Query } = require('node-appwrite');
    const { sendProfileReminder } = require('../utils/emailService');

    // Find all venues where onboardingComplete is false
    const result = await databases.listDocuments(
      DATABASE_ID,
      VENUES_COLLECTION_ID,
      [Query.equal('onboardingComplete', false)]
    );

    const remindersSent = [];
    for (const venue of result.documents) {
      if (venue.contactEmail) {
        try {
          await sendProfileReminder(venue.contactEmail, venue.ownerName || venue.venueName);
          remindersSent.push(venue.contactEmail);
        } catch (mailErr) {
          console.error(`Failed to send reminder to ${venue.contactEmail}:`, mailErr.message);
        }
      }
    }

    return res.status(200).json({
      status: 'success',
      message: `Profile completion reminders processed for ${result.documents.length} users`,
      data: remindersSent
    });
  } catch (error) {
    console.error('Error sending profile reminders:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
};
