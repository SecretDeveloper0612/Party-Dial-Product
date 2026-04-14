require('dotenv').config();
const { Client, Databases } = require('node-appwrite');

async function setup() {
    const client = new Client()
        .setEndpoint(process.env.APPWRITE_ENDPOINT)
        .setProject(process.env.APPWRITE_PROJECT_ID)
        .setKey(process.env.APPWRITE_API_KEY);

    const databases = new Databases(client);
    const databaseId = process.env.APPWRITE_DATABASE_ID;
    const collectionId = 'plans';
    const collectionName = 'Subscription Plans';

    console.log(`🚀 Starting setup for collection: ${collectionName} (${collectionId})...`);

    try {
        // 1. Create Collection
        try {
            // Using explicit permission strings for maximum compatibility
            const permissions = [
                'read("any")',
                'create("any")',
                'update("any")',
                'delete("any")'
            ];
            await databases.createCollection(databaseId, collectionId, collectionName, permissions, false);
            console.log('✅ Collection created successfully.');
        } catch (e) {
            if (e.code === 409) {
                console.log('ℹ️ Collection already exists, proceeding to attributes...');
            } else {
                throw e;
            }
        }

        // 2. Add Attributes
        const attributes = [
            { key: 'name', type: 'string', size: 255, required: true },
            { key: 'price', type: 'integer', required: true },
            { key: 'duration', type: 'integer', required: true },
            { key: 'leadLimit', type: 'integer', required: true },
            { key: 'features', type: 'string', size: 5000, required: true }, // Large string for JSON
            { key: 'status', type: 'string', size: 20, required: true }
        ];

        for (const attr of attributes) {
            try {
                if (attr.type === 'string') {
                    await databases.createStringAttribute(databaseId, collectionId, attr.key, attr.size, attr.required);
                } else if (attr.type === 'integer') {
                    await databases.createIntegerAttribute(databaseId, collectionId, attr.key, attr.required);
                }
                console.log(`✅ Attribute '${attr.key}' created.`);
            } catch (e) {
                if (e.code === 409) {
                    console.log(`ℹ️ Attribute '${attr.key}' already exists.`);
                } else {
                    console.error(`❌ Failed to create attribute '${attr.key}':`, e.message);
                }
            }
        }

        // 3. Create initial ₹11 Plan Document
        try {
            const initialPlan = {
                name: "₹11 Starter Plan",
                price: 11,
                duration: 30,
                leadLimit: 5,
                features: JSON.stringify(["Dashboard Access", "Realtime WhatsApp Alerts", "Priority Support"]),
                status: "active"
            };
            await databases.createDocument(databaseId, collectionId, 'trial_30', initialPlan);
            console.log('✅ Initial ₹11 Plan created.');
        } catch (e) {
            if (e.code === 409) {
                console.log('ℹ️ Initial plan already exists.');
            } else {
                console.warn('⚠️ Could not create initial plan (might be attribute indexing delay). Please try adding it manually from Admin Panel later.');
            }
        }

        console.log('\n✨ Setup Complete! You can now manage plans from the Admin Panel.');
        console.log('Note: Attributes might take a minute to become "available" in Appwrite.');

    } catch (error) {
        console.error('\n❌ Setup Failed:', error.message);
        console.log('\nPlease ensure your .env file has valid APPWRITE_API_KEY and APPWRITE_PROJECT_ID.');
    }
}

setup();
