require('dotenv').config();
const { Client, Users, Databases, Query, ID } = require('node-appwrite');

const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const users = new Users(client);
const databases = new Databases(client);

async function check() {
    const email = 'cedarahotelsandretreats@gmail.com';
    const userList = await users.list([Query.equal('email', email)]);
    if (userList.total > 0) {
        const user = userList.users[0];
        console.log(`Auth User ID: ${user.$id}, Name: ${user.name}`);
        
        // Create venue profile manually
        await databases.createDocument(
            process.env.APPWRITE_DATABASE_ID,
            process.env.APPWRITE_VENUES_COLLECTION_ID,
            ID.unique(),
            {
                userId: user.$id,
                venueName: 'Cedara Hotels and Retreats', // We guess the name from email or use user's name
                ownerName: user.name || 'Owner',
                contactEmail: email,
                contactNumber: user.phone || '',
                city: '',
                state: '',
                pincode: '',
                venueType: 'Hotel/Resort',
                capacity: 1,
                onboardingComplete: false,
                isVerified: false,
                status: 'active',
                subscriptionPlan: 'None'
            }
        );
        console.log(`Successfully created venue profile for ${email}`);
    } else {
        console.log("User not found!");
    }
}

check().catch(console.error);
