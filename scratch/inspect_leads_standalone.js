const { Client, Databases, Query } = require('node-appwrite');

const client = new Client()
    .setEndpoint('https://sgp.cloud.appwrite.io/v1')
    .setProject('69ae84bc001ca4edf8c2')
    .setKey('standard_973b10080db74ee3c52558cd36b6b1ba252c836ecebd5a9b98ff52ba4ad64dc27e7bff3ef1805fef559bc36374f693df951a6bb863fa3fd8b69ade1f6cd067be9818e56fb100c9b177bfce10f1dbb1caf0b3fa2fd41c72d59edf03bba72266ca89a8a7ff01fbc0e8daee13c4a0f8a2940ba4802a743415653941eafb91c2caae');

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
