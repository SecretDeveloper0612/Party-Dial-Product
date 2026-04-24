const { databases, DATABASE_ID, VENUES_COLLECTION_ID, LEADS_COLLECTION_ID } = require('../config/appwrite');

async function fixAppwriteSchema() {
    console.log('────────────── APPWRITE SCHEMA INITIALIZATION ──────────────');
    
    // ── VENUES COLLECTION ──
    console.log(`Checking collection: ${VENUES_COLLECTION_ID}`);
    const venueAttributes = [
        { key: 'subscriptionExpiry', type: 'string', size: 100 },
        { key: 'subscriptionPlan', type: 'string', size: 100 },
        { key: 'billingDetails', type: 'string', size: 5000 },
        { key: 'onboardingComplete', type: 'boolean' }
    ];

    for (const attr of venueAttributes) {
        await ensureAttribute(VENUES_COLLECTION_ID, attr);
    }

    // ── LEADS COLLECTION ──
    console.log(`Checking collection: ${LEADS_COLLECTION_ID}`);
    const leadAttributes = [
        { key: 'pincode', type: 'string', size: 20 },
        { key: 'eventDate', type: 'string', size: 100 }
    ];

    for (const attr of leadAttributes) {
        await ensureAttribute(LEADS_COLLECTION_ID, attr);
    }

    console.log('────────────────────────────────────────────────────────────');
}

async function ensureAttribute(collectionId, attr) {
    try {
        console.log(`- Verifying ${collectionId} attribute: ${attr.key}`);
        if (attr.type === 'string') {
            await databases.createStringAttribute(
                DATABASE_ID,
                collectionId,
                attr.key,
                attr.size,
                false
            );
        } else if (attr.type === 'boolean') {
            await databases.createBooleanAttribute(
                DATABASE_ID,
                collectionId,
                attr.key,
                false
            );
        }
        console.log(`  ✅ Created missing attribute: ${attr.key}`);
    } catch (e) {
        if (!e.message.includes('already exists')) {
            console.error(`  ❌ Failed to create attribute ${attr.key}:`, e.message);
        }
    }
}

module.exports = { fixAppwriteSchema };
