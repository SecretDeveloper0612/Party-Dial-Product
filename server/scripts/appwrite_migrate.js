const { Client, Users, Databases, Storage, Query, ID } = require('node-appwrite');
require('dotenv').config();

// SOURCE (from .env)
const SOURCE_CONFIG = {
    endpoint: process.env.APPWRITE_ENDPOINT,
    project: process.env.APPWRITE_PROJECT_ID,
    key: process.env.APPWRITE_API_KEY,
    databaseId: process.env.APPWRITE_DATABASE_ID
};

// TARGET (Provide these in .env or hardcode here)
// RECOMMENDATION: Create a .env.new file and load it manually or set these variables
const TARGET_CONFIG = {
    endpoint: process.env.NEW_APPWRITE_ENDPOINT || SOURCE_CONFIG.endpoint, // Usually same cloud endpoint
    project: process.env.NEW_APPWRITE_PROJECT_ID,
    key: process.env.NEW_APPWRITE_API_KEY,
    databaseId: process.env.NEW_APPWRITE_DATABASE_ID || SOURCE_CONFIG.databaseId
};

if (!TARGET_CONFIG.project || !TARGET_CONFIG.key) {
    console.error('❌ ERROR: Missing target Appwrite configuration (NEW_APPWRITE_PROJECT_ID, NEW_APPWRITE_API_KEY).');
    console.log('Please set NEW_APPWRITE_PROJECT_ID and NEW_APPWRITE_API_KEY in your .env file.');
    process.exit(1);
}

const sourceClient = new Client()
    .setEndpoint(SOURCE_CONFIG.endpoint)
    .setProject(SOURCE_CONFIG.project)
    .setKey(SOURCE_CONFIG.key);

const targetClient = new Client()
    .setEndpoint(TARGET_CONFIG.endpoint)
    .setProject(TARGET_CONFIG.project)
    .setKey(TARGET_CONFIG.key);

const sourceUsers = new Users(sourceClient);
const targetUsers = new Users(targetClient);

const sourceDatabases = new Databases(sourceClient);
const targetDatabases = new Databases(targetClient);

const sourceStorage = new Storage(sourceClient);
const targetStorage = new Storage(targetClient);

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function migrateUsers() {
    console.log('👥 Starting User Migration...');
    let total = 0;
    let offset = 0;
    const limit = 100;

    try {
        console.log('Fetching users from source...');
        while (true) {
            const result = await sourceUsers.list([Query.limit(limit), Query.offset(offset)]);
            if (result.users.length === 0) break;

            for (const user of result.users) {
                try {
                    // Note: We cannot get the password. We create them with a random password 
                    // or they'll need to use "Forgot Password".
                    // If you want to migrate with hashes, you need the hashes from a backup.
                    // Here we just create the account so the ID and Email match.
                    await targetUsers.create(
                        user.$id,
                        user.email,
                        user.phone || undefined,
                        'TemporaryPass123!', // They will need to reset this
                        user.name
                    );

                    // Update preferences if any
                    if (Object.keys(user.prefs).length > 0) {
                        await targetUsers.updatePrefs(user.$id, user.prefs);
                    }
                    
                    // Update verification status
                    if (user.emailVerification) {
                        await targetUsers.updateEmailVerification(user.$id, true);
                    }

                    console.log(`✅ Migrated User: ${user.email}`);
                    total++;
                } catch (e) {
                    if (e.code === 409) {
                        console.log(`ℹ️ User ${user.email} already exists in target.`);
                    } else {
                        console.error(`❌ Failed to migrate user ${user.email}:`, e.message);
                    }
                }
            }
            offset += limit;
        }
        console.log(`✨ User migration complete. Total: ${total}`);
    } catch (error) {
        console.error('❌ User migration failed:', error.message);
    }
}

async function migrateDatabase() {
    console.log(`\n🗄️ Starting Database Migration: ${SOURCE_CONFIG.databaseId} -> ${TARGET_CONFIG.databaseId}`);
    
    try {
        // Ensure target database exists (unnecessary if it's already created)
        try {
            console.log(`Checking if target database ${TARGET_CONFIG.databaseId} exists...`);
            await targetDatabases.get(TARGET_CONFIG.databaseId);
        } catch (e) {
            console.log(`ℹ️ Target database ${TARGET_CONFIG.databaseId} not found, attempting to create...`);
            try {
                await targetDatabases.create(TARGET_CONFIG.databaseId, 'Migrated Database');
            } catch (createErr) {
                console.error(`❌ FAILED to create database on target: ${createErr.message}`);
                throw createErr;
            }
        }

        console.log('Fetching collections from source...');
        const collections = await sourceDatabases.listCollections(SOURCE_CONFIG.databaseId);
        
        for (const col of collections.collections) {
            console.log(`\n--- Migrating Collection: ${col.name} (${col.$id}) ---`);
            
            // 1. Create Collection
            try {
                await targetDatabases.createCollection(
                    TARGET_CONFIG.databaseId,
                    col.$id,
                    col.name,
                    col.$permissions,
                    col.documentSecurity
                );
                console.log(`✅ Collection ${col.name} created.`);
            } catch (e) {
                if (e.code === 409) {
                    console.log(`ℹ️ Collection ${col.name} already exists.`);
                } else {
                    console.error(`❌ Failed to create collection ${col.name}:`, e.message);
                    continue;
                }
            }

            // 2. Sync Attributes
            const attributes = await sourceDatabases.listAttributes(SOURCE_CONFIG.databaseId, col.$id);
            for (const attr of attributes.attributes) {
                try {
                    // Map attribute types to create methods
                    if (attr.type === 'string') {
                        if (attr.format === 'email') await targetDatabases.createEmailAttribute(TARGET_CONFIG.databaseId, col.$id, attr.key, attr.required, attr.default);
                        else if (attr.format === 'url') await targetDatabases.createUrlAttribute(TARGET_CONFIG.databaseId, col.$id, attr.key, attr.required, attr.default);
                        else if (attr.format === 'ip') await targetDatabases.createIpAttribute(TARGET_CONFIG.databaseId, col.$id, attr.key, attr.required, attr.default);
                        else await targetDatabases.createStringAttribute(TARGET_CONFIG.databaseId, col.$id, attr.key, attr.size, attr.required, attr.default);
                    } else if (attr.type === 'integer') {
                        await targetDatabases.createIntegerAttribute(TARGET_CONFIG.databaseId, col.$id, attr.key, attr.required, attr.min, attr.max, attr.default);
                    } else if (attr.type === 'double') {
                        await targetDatabases.createFloatAttribute(TARGET_CONFIG.databaseId, col.$id, attr.key, attr.required, attr.min, attr.max, attr.default);
                    } else if (attr.type === 'boolean') {
                        await targetDatabases.createBooleanAttribute(TARGET_CONFIG.databaseId, col.$id, attr.key, attr.required, attr.default);
                    } else if (attr.type === 'datetime') {
                        await targetDatabases.createDatetimeAttribute(TARGET_CONFIG.databaseId, col.$id, attr.key, attr.required, attr.default);
                    } else if (attr.type === 'relationship') {
                        // Relationships are tricky to migrate via script, usually requires specific order
                        console.warn(`⚠️ Relationship attribute '${attr.key}' skipping. Re-create manually.`);
                    }
                    console.log(`✅ Attribute '${attr.key}' synced.`);
                } catch (e) {
                    if (e.code === 409) continue;
                    console.error(`❌ Failed to sync attribute '${attr.key}':`, e.message);
                }
            }

            // 3. Sync Indexes
            const indexes = await sourceDatabases.listIndexes(SOURCE_CONFIG.databaseId, col.$id);
            for (const idx of indexes.indexes) {
                try {
                    await targetDatabases.createIndex(
                        TARGET_CONFIG.databaseId,
                        col.$id,
                        idx.key,
                        idx.type,
                        idx.attributes,
                        idx.orders
                    );
                    console.log(`✅ Index '${idx.key}' synced.`);
                } catch (e) {
                    if (e.code === 409) continue;
                    console.error(`❌ Failed to sync index '${idx.key}':`, e.message);
                }
            }

            // WAIT for attributes to be ready (Appwrite processing time)
            console.log('⏳ Waiting for attributes to index...');
            await sleep(5000);

            // 4. Migrate Documents
            let docOffset = 0;
            const docLimit = 100;
            let docTotal = 0;

            while (true) {
                const docsResult = await sourceDatabases.listDocuments(
                    SOURCE_CONFIG.databaseId,
                    col.$id,
                    [Query.limit(docLimit), Query.offset(docOffset)]
                );
                
                if (docsResult.documents.length === 0) break;

                for (const doc of docsResult.documents) {
                    const { $id, $permissions, $collectionId, $databaseId, $createdAt, $updatedAt, ...data } = doc;
                    try {
                        await targetDatabases.createDocument(
                            TARGET_CONFIG.databaseId,
                            col.$id,
                            $id,
                            data,
                            $permissions
                        );
                        docTotal++;
                    } catch (e) {
                        if (e.code === 409) {
                            // Optionally update if already exists
                            await targetDatabases.updateDocument(TARGET_CONFIG.databaseId, col.$id, $id, data, $permissions);
                        } else {
                            console.error(`❌ Failed to migrate document ${$id}:`, e.message);
                        }
                    }
                }
                docOffset += docLimit;
            }
            console.log(`✨ Collection ${col.name} migrated. Total documents: ${docTotal}`);
        }
    } catch (error) {
        console.error('❌ Database migration failed:', error.message);
    }
}

async function migrateStorage() {
    console.log('\n📦 Starting Storage Migration...');
    try {
        const buckets = await sourceStorage.listBuckets();
        for (const bucket of buckets.buckets) {
            console.log(`\n--- Migrating Bucket: ${bucket.name} (${bucket.$id}) ---`);
            
            // 1. Create Bucket
            try {
                await targetStorage.createBucket(
                    bucket.$id,
                    bucket.name,
                    bucket.$permissions,
                    bucket.fileSecurity,
                    bucket.enabled,
                    bucket.maximumFileSize,
                    bucket.allowedFileExtensions,
                    bucket.compression,
                    bucket.encryption,
                    bucket.antivirus
                );
                console.log(`✅ Bucket ${bucket.name} created.`);
            } catch (e) {
                if (e.code === 409) {
                    console.log(`ℹ️ Bucket ${bucket.name} already exists.`);
                } else {
                    console.error(`❌ Failed to create bucket ${bucket.name}:`, e.message);
                    continue;
                }
            }

            // 2. Migrate Files
            let fileOffset = 0;
            const fileLimit = 100;
            let fileTotal = 0;

            while (true) {
                const filesResult = await sourceStorage.listFiles(
                    bucket.$id,
                    [Query.limit(fileLimit), Query.offset(fileOffset)]
                );
                
                if (filesResult.files.length === 0) break;

                for (const file of filesResult.files) {
                    try {
                        const fileData = await sourceStorage.getFileDownload(bucket.$id, file.$id);
                        // Appwrite SDK returns a Buffer or Stream depending on environment
                        // In Node, it's usually a Buffer or we can handle it.
                        
                        await targetStorage.createFile(
                            bucket.$id,
                            file.$id,
                            fileData,
                            file.$permissions
                        );
                        fileTotal++;
                        console.log(`✅ Migrated File: ${file.name || file.$id}`);
                    } catch (e) {
                        if (e.code === 409) {
                            console.log(`ℹ️ File ${file.$id} already exists.`);
                        } else {
                            console.error(`❌ Failed to migrate file ${file.$id}:`, e.message);
                        }
                    }
                }
                fileOffset += fileLimit;
            }
            console.log(`✨ Bucket ${bucket.name} migrated. Total files: ${fileTotal}`);
        }
    } catch (error) {
        console.error('❌ Storage migration failed:', error.message);
    }
}

async function run() {
    console.log('🚀 INITIALIZING FULL APPWRITE MIGRATION');
    console.log('----------------------------------------');
    console.log(`Source Project: ${SOURCE_CONFIG.project}`);
    console.log(`Target Project: ${TARGET_CONFIG.project}`);
    console.log('----------------------------------------');
    
    await migrateUsers();
    await migrateDatabase();
    await migrateStorage();
    
    console.log('\n🏁 ALL MIGRATION TASKS COMPLETED!');
    console.log('Please review the logs for any manual tasks required.');
}

run();
