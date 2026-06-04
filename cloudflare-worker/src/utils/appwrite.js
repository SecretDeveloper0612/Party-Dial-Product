import { Client, Databases, Users, Storage } from 'node-appwrite';

/**
 * Initializes and returns the Appwrite client and its services using the Cloudflare Worker environment.
 * @param {Object} env - The Cloudflare Worker environment variables (c.env in Hono)
 */
export const getAppwriteServices = (env) => {
  if (!env.APPWRITE_ENDPOINT || !env.APPWRITE_PROJECT_ID || !env.APPWRITE_API_KEY) {
    throw new Error('Missing required Appwrite environment variables');
  }

  const client = new Client()
    .setEndpoint(env.APPWRITE_ENDPOINT)
    .setProject(env.APPWRITE_PROJECT_ID)
    .setKey(env.APPWRITE_API_KEY);

  const databases = new Databases(client);
  const users = new Users(client);
  const storage = new Storage(client);

  return {
    client,
    databases,
    users,
    storage,
    databaseId: env.APPWRITE_DATABASE_ID,
    collections: {
      venues: env.APPWRITE_VENUES_COLLECTION_ID,
      reviews: env.APPWRITE_REVIEWS_COLLECTION_ID,
      leads: env.APPWRITE_LEADS_COLLECTION_ID,
      // Add more collections here as they become needed
    }
  };
};
