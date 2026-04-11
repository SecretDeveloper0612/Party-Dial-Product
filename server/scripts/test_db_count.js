const { Client, Databases } = require('node-appwrite');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

async function checkCounts() {
    try {
        const venues = await databases.listDocuments(
            process.env.APPWRITE_DATABASE_ID,
            process.env.APPWRITE_VENUES_COLLECTION_ID
        );
        console.log('--- DB Check ---');
        console.log('Total Venues:', venues.total);
        venues.documents.slice(0, 5).forEach(doc => {
            console.log(`- ${doc.venueName || doc.businessName}: Verified=${doc.isVerified}, OnboardingComplete=${doc.onboardingComplete}, Status=${doc.status}`);
        });
    } catch (error) {
        console.error('Error:', error.message);
    }
}

checkCounts();
