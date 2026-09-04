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
        console.log("Creating rating attribute...");
        await databases.createFloatAttribute(
            process.env.APPWRITE_DATABASE_ID,
            process.env.APPWRITE_VENUES_COLLECTION_ID,
            'rating',
            false,
            0.0
        );
        console.log("Creating totalReviews attribute...");
        await databases.createIntegerAttribute(
            process.env.APPWRITE_DATABASE_ID,
            process.env.APPWRITE_VENUES_COLLECTION_ID,
            'totalReviews',
            false,
            0
        );
        console.log("Attributes created successfully!");
    } catch (error) {
        console.error(error);
    }
}
run();
