import { Client, Databases, ID, Query } from 'appwrite';

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://sgp.cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '69ae84bc001ca4edf8c2');

export const databases = new Databases(client);
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '69c2305e000ecd6d04c1';
export const VENUES_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID || 'party-dial';
export const LEADS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_LEADS_COLLECTION_ID || '69cf7b100035f0d02235';
export { client, ID, Query };
