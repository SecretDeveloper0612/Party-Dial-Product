const { Client, Databases } = require('node-appwrite');
require('dotenv').config({ path: './server/.env' });

const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const VENUES_COLLECTION_ID = process.env.APPWRITE_VENUES_COLLECTION_ID;

async function fixCapacity() {
    try {
        console.log('Using Database:', DATABASE_ID);
        console.log('Using Collection:', VENUES_COLLECTION_ID);

        // Update Ranveer Garden
        await databases.updateDocument(
            DATABASE_ID,
            VENUES_COLLECTION_ID,
            '69cf6cca001940a1bb31',
            { capacity: '2000-5000' }
        );
        console.log('✅ Updated Ranveer Garden capacity');

        // Update Time venue too
        await databases.updateDocument(
            DATABASE_ID,
            VENUES_COLLECTION_ID,
            '69cb58ab0001efed8bf9',
            { capacity: '1000-2000' }
        );
        console.log('✅ Updated Time capacity');
    } catch (err) {
        console.error('❌ Error updating capacity:', err.message);
    }
}

fixCapacity();
