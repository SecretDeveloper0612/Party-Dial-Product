const { databases, DATABASE_ID, VENUES_COLLECTION_ID } = require('./config/appwrite');
const { Query } = require('node-appwrite');

async function inspectVenues() {
    try {
        const result = await databases.listDocuments(DATABASE_ID, VENUES_COLLECTION_ID, [Query.limit(2)]);
        if (result.documents.length > 0) {
            console.log('Sample Venue Attributes:');
            console.log(JSON.stringify(result.documents[0], null, 2));
        } else {
            console.log('No venues found.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

inspectVenues();
