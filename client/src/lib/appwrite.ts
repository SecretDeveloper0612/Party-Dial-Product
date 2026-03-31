import { Client, Account, Databases, Storage, ID, Query } from 'appwrite';

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://sgp.cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '69ae84bc001ca4edf8c2');

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '69c2305e000ecd6d04c1';
export const VENUES_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID || 'party-dial';
export const STORAGE_BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || 'venues_photos';
export { client, ID, Query };
