const { Client, Account, Databases, Users, Storage, ID } = require('node-appwrite');

const endpoint = process.env.APPWRITE_ENDPOINT;
const project = process.env.APPWRITE_PROJECT_ID;
const key = process.env.APPWRITE_API_KEY;
const databaseId = process.env.APPWRITE_DATABASE_ID;
const venuesCollectionId = process.env.APPWRITE_VENUES_COLLECTION_ID;
const storageBucketId = process.env.APPWRITE_STORAGE_BUCKET_ID;

if (!endpoint || !project || !key || !databaseId || !venuesCollectionId) {
    console.error('❌ Appwrite configuration is incomplete! Check your .env file.');
    console.error('Endpoint:', endpoint ? '✅' : '❌');
    console.error('Project ID:', project ? '✅' : '❌');
    console.error('API Key:', key ? '✅' : '❌');
    console.error('Database ID:', databaseId ? '✅' : '❌');
    console.error('Collection ID:', venuesCollectionId ? '✅' : '❌');
    console.error('Bucket ID:', storageBucketId ? '✅' : '❌');
}

const client = new Client()
    .setEndpoint(endpoint)
    .setProject(project)
    .setKey(key);

const account = new Account(client);
const databases = new Databases(client);
const users = new Users(client);
const storage = new Storage(client);

module.exports = { 
    Client, 
    client, 
    account, 
    databases, 
    users, 
    storage,
    ID,
    DATABASE_ID: databaseId, 
    VENUES_COLLECTION_ID: venuesCollectionId,
    LEADS_COLLECTION_ID: process.env.APPWRITE_LEADS_COLLECTION_ID || '69cf7b100035f0d02235',
    REVIEWS_COLLECTION_ID: process.env.APPWRITE_REVIEWS_COLLECTION_ID || '69d0f0eb001cad584e09',
    STORAGE_BUCKET_ID: storageBucketId
};
