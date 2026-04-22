const { databases, DATABASE_ID, VENUES_COLLECTION_ID } = require('../config/appwrite');

async function fixAppwriteSchema() {
    console.log('────────────── APPWRITE SCHEMA INITIALIZATION ──────────────');
    console.log(`Checking collection: ${VENUES_COLLECTION_ID} in database: ${DATABASE_ID}`);

    const attributes = [
        { key: 'subscriptionExpiry', type: 'string', size: 100 },
        { key: 'subscriptionPlan', type: 'string', size: 100 },
        // { key: 'billingDetails', type: 'string', size: 5000 },
        { key: 'onboardingComplete', type: 'boolean' }
    ];

    for (const attr of attributes) {
        try {
            console.log(`- Verifying attribute: ${attr.key}`);
            if (attr.type === 'string') {
                await databases.createStringAttribute(
                    DATABASE_ID,
                    VENUES_COLLECTION_ID,
                    attr.key,
                    attr.size,
                    false
                );
            } else if (attr.type === 'boolean') {
                await databases.createBooleanAttribute(
                    DATABASE_ID,
                    VENUES_COLLECTION_ID,
                    attr.key,
                    false
                );
            }
            console.log(`  ✅ Created missing attribute: ${attr.key}`);
        } catch (e) {
            if (e.message.includes('already exists')) {
                // console.log(`  ℹ️ Attribute ${attr.key} already exists.`);
            } else {
                console.error(`  ❌ Failed to create attribute ${attr.key}:`, e.message);
            }
        }
    }
    console.log('────────────────────────────────────────────────────────────');
}

module.exports = { fixAppwriteSchema };
