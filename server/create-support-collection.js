require('dotenv').config();
const { Client, Databases } = require('node-appwrite');

const client = new Client()
    .setEndpoint('https://sgp.cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT_ID || '69ae84bc001ca4edf8c2')
    .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);

async function run() {
    try {
        await databases.createCollection('69c2305e000ecd6d04c1', 'support-tickets', 'support-tickets');
        console.log('Collection created');
        await databases.createStringAttribute('69c2305e000ecd6d04c1', 'support-tickets', 'vendorId', 255, false);
        await databases.createStringAttribute('69c2305e000ecd6d04c1', 'support-tickets', 'subject', 255, true);
        await databases.createStringAttribute('69c2305e000ecd6d04c1', 'support-tickets', 'category', 255, true);
        await databases.createStringAttribute('69c2305e000ecd6d04c1', 'support-tickets', 'description', 5000, true);
        await databases.createStringAttribute('69c2305e000ecd6d04c1', 'support-tickets', 'status', 255, false, 'Open'); // Open, In Progress, Resolved
        await databases.createStringAttribute('69c2305e000ecd6d04c1', 'support-tickets', 'date', 255, false); 
        console.log('Attributes created successfully');
    } catch(e) {
        console.error(e);
    }
}
run();
