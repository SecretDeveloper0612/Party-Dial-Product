require('dotenv').config({ path: './server/.env' });
const { databases, DATABASE_ID, LEADS_COLLECTION_ID } = require('../server/config/appwrite');
const { Query } = require('node-appwrite');

async function inspect() {
    try {
        const result = await databases.listDocuments(DATABASE_ID, LEADS_COLLECTION_ID, [Query.limit(1)]);
        if (result.documents.length > 0) {
            console.log('Attributes in LEADS_COLLECTION_ID:');
            console.log(Object.keys(result.documents[0]));
            console.log('Full document sample:');
            console.log(JSON.stringify(result.documents[0], null, 2));
        } else {
            console.log('No documents found in leads collection.');
        }
    } catch (error) {
        console.error('Error inspecting leads collection:', error);
    }
}

inspect();
