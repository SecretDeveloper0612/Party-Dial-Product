const { Client, Databases, Query } = require('node-appwrite');

const client = new Client()
    .setEndpoint('https://sgp.cloud.appwrite.io/v1')
    .setProject('69ae84bc001ca4edf8c2')
    .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);
const DATABASE_ID = '69c2305e000ecd6d04c1';
const LEADS_COLLECTION_ID = '69cf7b100035f0d02235';

async function inspect() {
    try {
        const result = await databases.listDocuments(DATABASE_ID, LEADS_COLLECTION_ID, [
            Query.orderDesc('$createdAt'),
            Query.limit(5)
        ]);
        if (result.documents.length > 0) {
            console.log('--- LATEST 5 LEADS ---');
            result.documents.forEach(doc => {
                console.log(`[${doc.$createdAt}] ID: ${doc.$id}`);
                console.log(`  Name: ${doc.name}`);
                console.log(`  Notes: ${doc.notes}`);
                console.log(`  eventDate (DB field): ${doc.eventDate}`);
                console.log('-------------------------');
            });
        } else {
            console.log('No documents found in leads collection.');
        }
    } catch (error) {
        console.error('Error inspecting leads collection:', error);
    }
}

inspect();
