const { Client, Databases } = require('node-appwrite');

const client = new Client()
    .setEndpoint('https://sgp.cloud.appwrite.io/v1')
    .setProject('69ae84bc001ca4edf8c2')
    .setKey('standard_973b10080db74ee3c52558cd36b6b1ba252c836ecebd5a9b98ff52ba4ad64dc27e7bff3ef1805fef559bc36374f693df951a6bb863fa3fd8b69ade1f6cd067be9818e56fb100c9b177bfce10f1dbb1caf0b3fa2fd41c72d59edf03bba72266ca89a8a7ff01fbc0e8daee13c4a0f8a2940ba4802a743415653941eafb91c2caae');

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
