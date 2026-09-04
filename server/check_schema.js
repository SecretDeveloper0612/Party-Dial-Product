import { Client, Databases } from 'node-appwrite';
import dotenv from 'dotenv';
dotenv.config({ path: '/Users/haldwani/Documents/Working/party_dial/server/.env' });

const client = new Client()
    .setEndpoint('https://sgp.cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

async function run() {
    try {
        const result = await databases.listAttributes(
            process.env.APPWRITE_DATABASE_ID,
            process.env.APPWRITE_VENUES_COLLECTION_ID
        );
        const hasRating = result.attributes.find(a => a.key === 'rating');
        const hasTotalReviews = result.attributes.find(a => a.key === 'totalReviews');
        console.log("Rating attribute:", hasRating);
        console.log("Total Reviews attribute:", hasTotalReviews);
    } catch (error) {
        console.error(error);
    }
}
run();
