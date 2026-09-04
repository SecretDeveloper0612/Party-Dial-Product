import { Client, Databases, Query } from 'node-appwrite';
import dotenv from 'dotenv';
dotenv.config({ path: '/Users/haldwani/Documents/Working/party_dial/server/.env' });

const client = new Client()
    .setEndpoint('https://sgp.cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

async function run() {
    try {
        const result = await databases.listDocuments(
            process.env.APPWRITE_DATABASE_ID,
            process.env.APPWRITE_VENUES_COLLECTION_ID,
            [
                Query.contains('venueName', 'Royal Green')
            ]
        );
        console.log(JSON.stringify(result.documents[0], null, 2));
    } catch (error) {
        console.error(error);
    }
}
run();
