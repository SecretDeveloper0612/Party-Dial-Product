const sdk = require('node-appwrite');
const client = new sdk.Client();
require('dotenv').config();

client
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const users = new sdk.Users(client);

async function check() {
    try {
        const userList = await users.list([sdk.Query.equal('email', 'aranyawoodresortpithoragarh@gmail.com')]);
        if (userList.users.length > 0) {
            console.log("User labels:", userList.users[0].labels);
            console.log("User ID:", userList.users[0].$id);
        } else {
            console.log("User not found");
        }
    } catch (e) {
        console.error(e);
    }
}
check();
