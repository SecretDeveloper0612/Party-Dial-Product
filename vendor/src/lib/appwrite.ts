import { Client, Account, Databases, Storage, ID, Query } from 'appwrite';

const client = new Client()
    .setEndpoint('https://sgp.cloud.appwrite.io/v1')
    .setProject('69ae84bc001ca4edf8c2');

// Initial setup from server config (if possible)
if (typeof window !== 'undefined') {
  fetch('http://127.0.0.1:5000/api/config')
    .then(res => res.json())
    .then(config => {
       if (config.projectId && config.endpoint) {
          client.setEndpoint(config.endpoint).setProject(config.projectId);
       }
    })
    .catch(err => console.debug('Proceeding with default Appwrite config'));
}

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const DATABASE_ID = '69c2305e000ecd6d04c1';
export const VENUES_COLLECTION_ID = 'party-dial';
export const STORAGE_BUCKET_ID = 'venues_photos';
export { client, ID, Query };
