require('dotenv').config();
console.log('--- Appwrite Environment Check ---');
console.log('Endpoint:', process.env.APPWRITE_ENDPOINT ? 'LOADED' : 'MISSING');
console.log('Project ID:', process.env.APPWRITE_PROJECT_ID ? 'LOADED' : 'MISSING');
console.log('API Key:', process.env.APPWRITE_API_KEY ? 'LOADED' : 'MISSING');
console.log('Database ID:', process.env.APPWRITE_DATABASE_ID ? 'LOADED' : 'MISSING');
console.log('Collection ID:', process.env.APPWRITE_VENUES_COLLECTION_ID ? 'LOADED' : 'MISSING');
console.log('Bucket ID:', process.env.APPWRITE_STORAGE_BUCKET_ID ? 'LOADED' : 'MISSING');
