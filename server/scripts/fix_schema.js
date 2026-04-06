const { Client, Databases } = require('node-appwrite');
require('dotenv').config();

const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

async function fixSchema() {
    console.log('🚀 Starting schema fix for Appwrite...');
    const databaseId = process.env.APPWRITE_DATABASE_ID;
    const collectionId = process.env.APPWRITE_VENUES_COLLECTION_ID;

    try {
        console.log(`Checking for "eventTypes" attribute in collection ${collectionId}...`);
        await databases.createStringAttribute(
            databaseId,
            collectionId,
            'eventTypes',
            1000,
            false // not required
        );
        console.log('✅ Success: "eventTypes" attribute created.');
    } catch (err) {
        if (err.code === 409) {
            console.log('ℹ️  "eventTypes" attribute already exists.');
        } else {
            console.error('❌ Failed to create "eventTypes":', err.message);
        }
    }

    try {
        console.log(`Checking for "amenities" attribute in collection ${collectionId}...`);
        await databases.createStringAttribute(
            databaseId,
            collectionId,
            'amenities',
            2000,
            false // not required
        );
        console.log('✅ Success: "amenities" attribute created.');
    } catch (err) {
        if (err.code === 409) {
            console.log('ℹ️  "amenities" attribute already exists.');
        } else {
            console.error('❌ Failed to create "amenities":', err.message);
        }
    }

    console.log('🏁 Schema check complete.');
}

fixSchema();
