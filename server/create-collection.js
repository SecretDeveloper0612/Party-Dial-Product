const { Client, Databases } = require('node-appwrite');

const client = new Client()
    .setEndpoint('https://sgp.cloud.appwrite.io/v1')
    .setProject('69ae84bc001ca4edf8c2')
    .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);

async function run() {
    try {
        await databases.createCollection('69c2305e000ecd6d04c1', 'subscription-inquiries', 'subscription-inquiries');
        console.log('Collection created');
        await databases.createStringAttribute('69c2305e000ecd6d04c1', 'subscription-inquiries', 'venueId', 255, false);
        await databases.createStringAttribute('69c2305e000ecd6d04c1', 'subscription-inquiries', 'venueName', 255, false);
        await databases.createStringAttribute('69c2305e000ecd6d04c1', 'subscription-inquiries', 'vendorEmail', 255, false);
        await databases.createStringAttribute('69c2305e000ecd6d04c1', 'subscription-inquiries', 'requestedPax', 255, false);
        await databases.createStringAttribute('69c2305e000ecd6d04c1', 'subscription-inquiries', 'status', 255, false, 'Pending'); // Pending, Quoted, Paid
        console.log('Attributes created successfully');
    } catch(e) {
        console.error(e);
    }
}
run();
