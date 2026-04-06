import { Client, Account, Databases, Storage, ID, Query } from 'appwrite';

export const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://sgp.cloud.appwrite.io/v1';
export const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '69ae84bc001ca4edf8c2';

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '69c2305e000ecd6d04c1';
export const VENUES_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID || 'party-dial';
export const LEADS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_LEADS_COLLECTION_ID || '69cf7b100035f0d02235';
export const REVIEWS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID || '69d0f0eb001cad584e09';
export const STORAGE_BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || 'venues_photos';

export { client, ID, Query };
