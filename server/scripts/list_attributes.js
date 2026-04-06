const { Client, Databases } = require('node-appwrite');
require('dotenv').config();

const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

async function listAttributes() {
    console.log('🚀 Listing attributes for collection...');
    const databaseId = process.env.APPWRITE_DATABASE_ID;
    const collectionId = process.env.APPWRITE_VENUES_COLLECTION_ID;

    try {
        const result = await databases.listAttributes(databaseId, collectionId);
        console.log('--- Current Attributes ---');
        result.attributes.forEach(attr => {
            console.log(`- ${attr.key} (${attr.type}, size: ${attr.size || 'N/A'})`);
        });
    } catch (err) {
        console.error('❌ Failed to list attributes:', err.message);
    }
}

listAttributes();
