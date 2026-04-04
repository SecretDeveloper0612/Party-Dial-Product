const { Client, Databases, Storage } = require('node-appwrite');
require('dotenv').config();

const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const storage = new Storage(client);

const DB_ID = process.env.APPWRITE_DATABASE_ID || '69c2305e000ecd6d04c1';
const COLL_ID = process.env.APPWRITE_VENUES_COLLECTION_ID || 'party-dial';
const BUCKET_ID = process.env.APPWRITE_STORAGE_BUCKET_ID || 'venues_photos';

async function updatePermissions() {
    try {
        console.log('--- Updating Permissions for venues_profile ---');
        await databases.updateCollection(
            DB_ID,
            COLL_ID,
            'Venues Profile',
            [
                'read("any")',       // Public Read
                'create("users")',   // Logged in users can create
                'update("users")',   // Logged in users can update
                'delete("users")'    // Logged in users can delete
            ],
            true
        );
        console.log('✅ Collection permissions updated!');

        console.log('--- Updating Permissions for venues_photos Bucket ---');
        try {
            await storage.updateBucket(
                BUCKET_ID,
                'Venues Photos',
                [
                    'read("any")',      // Public Read
                    'create("users")',  // Logged in can upload
                    'update("users")',  // Logged in can update
                    'delete("users")'   // Logged in can delete
                ],
                true,                   // fileSecurity (Enable per-file permissions)
                true                    // enabled
            );
            console.log('✅ Bucket permissions updated!');
        } catch (bucketErr) {
            if (bucketErr.code === 404) {
                console.log('⚠️ Bucket "venues_photos" not found. Skipping.');
            } else {
                throw bucketErr;
            }
        }

    } catch (err) {
        console.error('❌ Error updating permissions:', err.message);
    }
}

updatePermissions();
