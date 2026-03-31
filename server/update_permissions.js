const { Client, Databases } = require('node-appwrite');
require('dotenv').config();

const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

const DB_ID = '69c2305e000ecd6d04c1';
const COLL_ID = 'party-dial';

async function updatePermissions() {
    try {
        console.log('--- Updating Permissions for venues_profile ---');
        await databases.updateCollection(
            DB_ID,
            COLL_ID,
            'Venues Profile', // name
            ['read("any")'], // Enable Public Read
            true // enabled
        );
        console.log('✅ Collection permissions updated! Guests can now read venues.');
    } catch (err) {
        console.error('❌ Error updating permissions:', err.message);
    }
}

updatePermissions();
