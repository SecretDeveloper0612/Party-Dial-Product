import { ID, Query } from 'node-appwrite';
import { getAppwriteServices } from '../utils/appwrite';

export const getAllUsers = async (c) => {
  try {
    const { users } = getAppwriteServices(c.env);
    const result = await users.list();
    
    const usersWithPrefs = await Promise.all(result.users.map(async (user) => {
      try {
        const prefs = await users.getPrefs(user.$id);
        return { ...user, prefs };
      } catch (err) {
        return { ...user, prefs: {} };
      }
    }));

    return c.json({ status: 'success', data: usersWithPrefs, total: result.total }, 200);
  } catch (error) {
    return c.json({ status: 'error', message: error.message }, 500);
  }
};

export const getUserById = async (c) => {
  try {
    const id = c.req.param('id');

    if (id === 'master admin' || id === 'master_admin') {
      return c.json({
        status: 'success',
        data: {
          $id: 'master admin',
          name: 'Master Administrator',
          email: c.env.ADMIN_EMAIL || 'admin@partydial.com',
          prefs: {
            role: 'Super Admin',
            moduleAccess: '["Dashboard", "Users", "Venues", "Leads", "Payments", "Settings"]'
          }
        }
      }, 200);
    }

    const { users } = getAppwriteServices(c.env);
    const user = await users.get(id);
    const prefs = await users.getPrefs(id);
    return c.json({ status: 'success', data: { ...user, prefs } }, 200);
  } catch (error) {
    return c.json({ status: 'error', message: error.message }, 500);
  }
};

export const createUser = async (c) => {
  try {
    const body = await c.req.json().catch(() => ({}));
    const { name, email, password, role, region, state, city, pincode, reportingTo, moduleAccess, assignedVenues } = body;
    if (!name || !email || !password) return c.json({ status: 'error', message: 'Name, email, and password are required.' }, 400);

    const { users } = getAppwriteServices(c.env);
    const newUser = await users.create(ID.unique(), email, undefined, password, name);

    await users.updatePrefs(newUser.$id, {
      role: role || 'BDE', region: region || '', state: state || '', city: city || '', pincode: pincode || '',
      reportingTo: reportingTo || '', moduleAccess: JSON.stringify(moduleAccess || ['Dashboard']),
      assignedVenues: JSON.stringify(assignedVenues || []), status: 'Active',
    });

    return c.json({ status: 'success', message: 'User created successfully', data: newUser }, 201);
  } catch (error) {
    return c.json({ status: 'error', message: error.message }, 500);
  }
};

export const updateUser = async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json().catch(() => ({}));
    const { name, role, region, state, city, pincode, reportingTo, moduleAccess, status, assignedVenues } = body;
    const { users } = getAppwriteServices(c.env);

    if (name) await users.updateName(id, name);

    await users.updatePrefs(id, {
      role: role || 'BDE', region: region || '', state: state || '', city: city || '', pincode: pincode || '',
      reportingTo: reportingTo || '', moduleAccess: JSON.stringify(moduleAccess || ['Dashboard']),
      assignedVenues: JSON.stringify(assignedVenues || []), status: status || 'Active',
    });

    const updated = await users.get(id);
    const prefs = await users.getPrefs(id);
    return c.json({ status: 'success', message: 'User updated successfully', data: { ...updated, prefs } }, 200);
  } catch (error) {
    return c.json({ status: 'error', message: error.message }, 500);
  }
};

export const toggleUserStatus = async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json().catch(() => ({}));
    const { blocked } = body;
    const { users } = getAppwriteServices(c.env);

    await users.updateStatus(id, !blocked);
    const prefs = await users.getPrefs(id);
    await users.updatePrefs(id, { ...prefs, status: blocked ? 'Inactive' : 'Active' });

    return c.json({ status: 'success', message: blocked ? 'User blocked' : 'User activated' }, 200);
  } catch (error) {
    return c.json({ status: 'error', message: error.message }, 500);
  }
};

export const deleteUser = async (c) => {
  try {
    const id = c.req.param('id');
    const { users } = getAppwriteServices(c.env);
    await users.delete(id);
    return c.json({ status: 'success', message: 'User deleted' }, 200);
  } catch (error) {
    return c.json({ status: 'error', message: error.message }, 500);
  }
};

export const sendProfileReminders = async (c) => {
  return c.json({ status: 'success', message: 'Profile reminders endpoint hit (Stubbed on Edge)' }, 200);
};
