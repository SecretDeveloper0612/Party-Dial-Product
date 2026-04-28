const sdk = require('node-appwrite');
const client = new sdk.Client();
require('dotenv').config();

client
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const users = new sdk.Users(client);
const databases = new sdk.Databases(client);

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const VENUES_COL_ID = process.env.APPWRITE_VENUES_COLLECTION_ID;

async function fixLabels() {
    try {
        console.log("Fetching venues...");
        let hasMore = true;
        let lastId = null;
        let updatedCount = 0;
        
        while (hasMore) {
            const queries = [sdk.Query.limit(100)];
            if (lastId) queries.push(sdk.Query.cursorAfter(lastId));
            
            const response = await databases.listDocuments(DATABASE_ID, VENUES_COL_ID, queries);
            
            for (const venue of response.documents) {
                if (venue.userId) {
                    try {
                        const user = await users.get(venue.userId);
                        const labels = user.labels || [];
                        if (!labels.includes('vendor')) {
                            await users.updateLabels(venue.userId, [...labels, 'vendor']);
                            console.log(`Added vendor label to ${user.email} (userId: ${venue.userId})`);
                            updatedCount++;
                        }
                    } catch (e) {
                        console.error(`Failed to update ${venue.userId}: ${e.message}`);
                    }
                }
            }
            
            if (response.documents.length < 100) {
                hasMore = false;
            } else {
                lastId = response.documents[response.documents.length - 1].$id;
            }
        }
        
        console.log(`Finished! Updated ${updatedCount} users.`);
    } catch (e) {
        console.error("Script failed:", e);
    }
}

fixLabels();
