require('dotenv').config();
const { Client, Databases, Query } = require('node-appwrite');

const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

async function check() {
    const email = 'cedarahotelsandretreats@gmail.com';
    const venueList = await databases.listDocuments(
        process.env.APPWRITE_DATABASE_ID,
        process.env.APPWRITE_VENUES_COLLECTION_ID,
        [Query.equal('contactEmail', email)]
    );
    console.log(`Venues found: ${venueList.total}`);
    venueList.documents.forEach(v => {
        console.log(`ID: ${v.$id}, Name: ${v.venueName}, Email: ${v.contactEmail}, isVerified: ${v.isVerified}, onboardingComplete: ${v.onboardingComplete}`);
    });
}

check().catch(console.error);
