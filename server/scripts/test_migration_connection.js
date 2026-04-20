const { Client, Users, Databases } = require('node-appwrite');
require('dotenv').config();

const SOURCE_CONFIG = {
    endpoint: process.env.APPWRITE_ENDPOINT,
    project: process.env.APPWRITE_PROJECT_ID,
    key: process.env.APPWRITE_API_KEY,
};

const TARGET_CONFIG = {
    endpoint: process.env.NEW_APPWRITE_ENDPOINT || SOURCE_CONFIG.endpoint,
    project: process.env.NEW_APPWRITE_PROJECT_ID,
    key: process.env.NEW_APPWRITE_API_KEY,
};

async function test() {
    console.log('🔍 Testing Connectivity...');

    const sClient = new Client().setEndpoint(SOURCE_CONFIG.endpoint).setProject(SOURCE_CONFIG.project).setKey(SOURCE_CONFIG.key);
    const tClient = new Client().setEndpoint(TARGET_CONFIG.endpoint).setProject(TARGET_CONFIG.project).setKey(TARGET_CONFIG.key);

    const sUsers = new Users(sClient);
    const tUsers = new Users(tClient);

    console.log('\n--- SOURCE PROJECT ---');
    try {
        const users = await sUsers.list();
        console.log(`✅ Source OK. Total Users: ${users.total}`);
    } catch (e) {
        console.error(`❌ Source failed: ${e.message}`);
    }

    console.log('\n--- TARGET PROJECT ---');
    try {
        const users = await tUsers.list();
        console.log(`✅ Target OK. Total Users: ${users.total}`);
    } catch (e) {
        console.error(`❌ Target failed: ${e.message}`);
    }
}

test();
