require('dotenv').config();
const { Client, Storage } = require('node-appwrite');

async function testImage() {
    const endpoint = process.env.APPWRITE_ENDPOINT;
    const project = process.env.APPWRITE_PROJECT_ID;
    const key = process.env.APPWRITE_API_KEY;
    const bucketId = process.env.APPWRITE_STORAGE_BUCKET_ID || 'venues_photos';
    
    console.log('Testing Appwrite Image Fetch...');
    console.log('Endpoint:', endpoint);
    console.log('Project:', project);
    console.log('Bucket:', bucketId);

    const client = new Client()
        .setEndpoint(endpoint)
        .setProject(project)
        .setKey(key);

    const storage = new Storage(client);

    try {
        const files = await storage.listFiles(bucketId, [], 1);
        if (files.total > 0) {
            const fileId = files.files[0].$id;
            console.log('✅ Connected to Storage! Found file:', fileId);
            const view = await storage.getFileView(bucketId, fileId);
            console.log('✅ getFileView worked. Result size:', view.byteLength);
        } else {
            console.log('❌ No files found in bucket.');
        }
    } catch (e) {
        console.error('❌ Appwrite Storage Error:', e.message);
    }
}

testImage();
