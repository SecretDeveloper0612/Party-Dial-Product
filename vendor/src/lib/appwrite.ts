import { Client, Account, Databases, Storage, ID, Query } from 'appwrite';

export const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
export const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '67d8487c001878d65a25';

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '67d853e50020a597e793';
export const VENUES_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID || '67d853f00030225d3090';
export const LEADS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_LEADS_COLLECTION_ID || '67d9342c002bd33e4b7a';
export const STORAGE_BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || 'venues_photos';

export { client, ID, Query };
