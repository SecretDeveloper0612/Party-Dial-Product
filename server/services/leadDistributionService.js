const { databases, DATABASE_ID, VENUES_COLLECTION_ID, LEADS_COLLECTION_ID, ID } = require('../config/appwrite');
const { Query } = require('node-appwrite');
const { isVenueEligible, getBucketLabel } = require('../utils/paxMatcher');
const { sendPushNotification } = require('../utils/notifications');
const { sendLeadNotificationEmail } = require('../utils/emailService');

const LEAD_DISTRIBUTIONS_COLLECTION_ID = process.env.APPWRITE_LEAD_DISTRIBUTIONS_COLLECTION_ID || 'lead_distributions';

/**
 * Normalizes event type string for comparison (strips punctuation, trims, lowercases)
 */
function normalizeEventType(str) {
    if (!str || typeof str !== 'string') return '';
    return str
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .trim();
}

/**
 * Checks if a venue supports the requested event type.
 *
 * Venues store supported event types in `eventTypes` attribute, usually as:
 * - A JSON stringified array: '["Birthday Party","Wedding Events",...]'
 * - An Array of strings
 * - A comma-separated string
 *
 * If eventTypes is empty/null/missing, the venue does NOT match any specific event inquiry.
 */
function checkEventTypeMatch(venue, requestedEventType) {
    if (!requestedEventType) {
        return { isMatch: false, reason: 'No event type requested' };
    }

    const normRequested = normalizeEventType(requestedEventType);
    let supported = [];

    if (Array.isArray(venue.eventTypes)) {
        supported = venue.eventTypes;
    } else if (typeof venue.eventTypes === 'string' && venue.eventTypes.trim()) {
        try {
            const parsed = JSON.parse(venue.eventTypes);
            if (Array.isArray(parsed)) {
                supported = parsed;
            } else if (typeof parsed === 'string') {
                supported = [parsed];
            }
        } catch {
            // Comma-separated fallback
            supported = venue.eventTypes.split(',').map(s => s.trim()).filter(Boolean);
        }
    }

    if (supported.length === 0) {
        return {
            isMatch: false,
            reason: `Venue has no configured event types (unsupported)`
        };
    }

    const normalizedSupported = supported.map(normalizeEventType);

    // Direct match
    if (normalizedSupported.includes(normRequested)) {
        return { isMatch: true, reason: null };
    }

    // Partial match (e.g. "wedding" matches "weddingevents", "corporate" matches "corporateevents")
    const partialMatch = normalizedSupported.some(s => 
        (s.length >= 4 && normRequested.includes(s)) || 
        (normRequested.length >= 4 && s.includes(normRequested))
    );

    if (partialMatch) {
        return { isMatch: true, reason: null };
    }

    return {
        isMatch: false,
        reason: `Venue does not accommodate "${requestedEventType}" (supports: ${supported.slice(0, 4).join(', ')})`
    };
}

/**
 * Checks if a venue's location/service coverage matches the user's location/pincode.
 *
 * Criteria:
 * 1. Pincode match: exact 6-digit match between inquiry and venue.pincode.
 * 2. City / Locality match: case-insensitive containment match between inquiry location
 *    and venue's city, landmark, address, or state.
 */
function checkLocationMatch(venue, leadPincode, locationText) {
    const venuePincode = (venue.pincode || '').toString().trim();
    const vCity = (venue.city || '').toString().trim().toLowerCase();
    const vLandmark = (venue.landmark || '').toString().trim().toLowerCase();
    const vAddress = (venue.address || '').toString().trim().toLowerCase();
    const vState = (venue.state || '').toString().trim().toLowerCase();

    // 1. Direct Pincode Match
    if (leadPincode && venuePincode) {
        if (leadPincode === venuePincode) {
            return { isMatch: true, reason: null, matchType: 'PINCODE_EXACT' };
        }
    }

    // 2. Location text matching
    if (locationText) {
        const locLower = locationText.toLowerCase();

        // Check if venue city matches inquiry location text
        if (vCity && (locLower.includes(vCity) || vCity.includes(locLower))) {
            return { isMatch: true, reason: null, matchType: 'CITY_MATCH' };
        }

        // Check if landmark or address matches
        if (vLandmark && locLower.includes(vLandmark)) {
            return { isMatch: true, reason: null, matchType: 'LANDMARK_MATCH' };
        }
        if (vAddress && locLower.includes(vAddress)) {
            return { isMatch: true, reason: null, matchType: 'ADDRESS_MATCH' };
        }
    }

    return {
        isMatch: false,
        reason: `Venue location (${venue.city || 'N/A'}, Pincode: ${venue.pincode || 'N/A'}) outside requested area "${locationText || leadPincode}"`
    };
}

/**
 * Checks if a venue has sufficient guest capacity for the requested guests.
 *
 * Capacity rule:
 * - A venue is eligible ONLY if its capacity bucket or configured capacity >= requested guests.
 * - Example: If user requests 300 guests, a venue with max 200 guests is INELIGIBLE.
 */
function checkCapacityMatch(venue, requestedGuests) {
    const venueCapacity = parseInt(venue.capacity) || 0;

    if (venueCapacity <= 0) {
        return {
            isMatch: false,
            reason: 'Venue has no configured guest capacity'
        };
    }

    if (requestedGuests <= 0) {
        return { isMatch: true, reason: null };
    }

    // If venue capacity is explicitly smaller than requested guests
    // Note: if venue has explicit numeric capacity e.g. 200 and requested is 300, it cannot host.
    if (venueCapacity < requestedGuests) {
        return {
            isMatch: false,
            reason: `Venue capacity (${venueCapacity} guests) is less than requested ${requestedGuests} guests`
        };
    }

    // Verify using PAX bucket matcher
    const eligible = isVenueEligible(venueCapacity, requestedGuests);
    if (!eligible) {
        return {
            isMatch: false,
            reason: `Venue capacity ${venueCapacity} (${getBucketLabel(venueCapacity)}) too small for ${requestedGuests} guests`
        };
    }

    return { isMatch: true, reason: null };
}

/**
 * Authoritative Subscription Eligibility Verification.
 *
 * Verifies that the venue partner has an active, valid, paid PartyDial subscription
 * with lead-generation entitlement.
 *
 * Ineligible:
 * - Free-listed venues (null, undefined, 'free', 'None', '')
 * - Inactive or suspended accounts (status !== 'active')
 * - Expired subscriptions (subscriptionExpiry in the past)
 * - Subscriptions explicitly marked 'cancelled', 'inactive', 'suspended', 'expired'
 * - Venues without lead-generation access entitlement
 */
function checkSubscriptionEligibility(venue, now = new Date()) {
    const plan = (venue.subscriptionPlan || '').toString().trim();
    const status = (venue.status || '').toString().trim().toLowerCase();
    const subStatus = (venue.subscriptionStatus || '').toString().trim().toLowerCase();

    // 1. Account status check
    if (status && status !== 'active') {
        return {
            isEligible: false,
            reason: `Partner account is ${status} (must be active)`
        };
    }

    // 2. Free Listing Exclusion
    const freePlanNames = ['free', 'free listing', 'none', 'null', ''];
    if (!plan || freePlanNames.includes(plan.toLowerCase())) {
        return {
            isEligible: false,
            reason: 'Venue is on a Free listing without an eligible paid subscription'
        };
    }

    // 3. Explicit Subscription Status Checks
    if (subStatus) {
        const ineligibleStatuses = ['cancelled', 'expired', 'inactive', 'suspended', 'pending', 'payment_pending'];
        if (ineligibleStatuses.includes(subStatus)) {
            return {
                isEligible: false,
                reason: `Subscription status is explicitly "${subStatus}"`
            };
        }
    }

    // 4. Trial Plan Checks
    // "trial_30" or "30 Day Trial" without valid unexpired date
    const isTrial = /trial/i.test(plan);
    const expiryStr = venue.subscriptionExpiry || venue.subscriptionExpiryDate;

    // 5. Validity Period / Expiry Date Check
    if (expiryStr) {
        const expiryDate = new Date(expiryStr);
        if (!isNaN(expiryDate.getTime()) && now > expiryDate) {
            return {
                isEligible: false,
                reason: `Subscription plan "${plan}" expired on ${expiryDate.toISOString().slice(0, 10)}`
            };
        }
    } else if (isTrial) {
        // A trial without an explicit expiry date cannot be verified as active
        return {
            isEligible: false,
            reason: `Trial plan has no recorded expiry date or validity period`
        };
    }

    // 6. Lead Generation Feature Entitlement
    // If featuresAccess is defined as a JSON or array, ensure it does not explicitly exclude leads
    if (venue.featuresAccess) {
        try {
            const features = typeof venue.featuresAccess === 'string' ? JSON.parse(venue.featuresAccess) : venue.featuresAccess;
            if (Array.isArray(features) && features.length > 0) {
                const hasLeadAccess = features.some(f => /lead|inquir|pro/i.test(String(f)));
                if (!hasLeadAccess) {
                    return {
                        isEligible: false,
                        reason: `Subscription plan "${plan}" does not include lead-generation access`
                    };
                }
            }
        } catch {
            // Keep going if featuresAccess is non-JSON string
        }
    }

    return {
        isEligible: true,
        reason: null,
        planName: plan
    };
}

/**
 * Evaluates a single venue against ALL 4 matching criteria.
 * A venue must satisfy EVERY condition to receive a lead.
 */
function evaluateVenueEligibility(venue, criteria, now = new Date()) {
    const { eventType, location, pincode, guests } = criteria;

    // A. Event Type
    const eventTypeEval = checkEventTypeMatch(venue, eventType);
    if (!eventTypeEval.isMatch) {
        return {
            isEligible: false,
            stage: 'EVENT_TYPE_MISMATCH',
            rejectionReason: eventTypeEval.reason,
            venue
        };
    }

    // B. Location / Pincode
    const locationEval = checkLocationMatch(venue, pincode, location);
    if (!locationEval.isMatch) {
        return {
            isEligible: false,
            stage: 'LOCATION_MISMATCH',
            rejectionReason: locationEval.reason,
            venue
        };
    }

    // C. Guest Capacity
    const capacityEval = checkCapacityMatch(venue, guests);
    if (!capacityEval.isMatch) {
        return {
            isEligible: false,
            stage: 'CAPACITY_MISMATCH',
            rejectionReason: capacityEval.reason,
            venue
        };
    }

    // D. Active Paid Subscription
    const subscriptionEval = checkSubscriptionEligibility(venue, now);
    if (!subscriptionEval.isEligible) {
        return {
            isEligible: false,
            stage: 'SUBSCRIPTION_INELIGIBLE',
            rejectionReason: subscriptionEval.reason,
            venue
        };
    }

    return {
        isEligible: true,
        stage: 'FULLY_ELIGIBLE',
        rejectionReason: null,
        venue,
        subscriptionPlan: subscriptionEval.planName
    };
}

/**
 * Main Smart Lead Distribution Engine
 *
 * Workflow:
 * Step 1: Validate lead details
 * Step 2: Fetch and evaluate candidate venues against Event Type, Location, Capacity & Active Subscription
 * Step 3: Record audit evaluations (all eligible & excluded venues with reasons)
 * Step 4: If matches found, distribute lead to EVERY eligible venue (preventing duplicates)
 * Step 5: If no matches, mark inquiry as UNMATCHED / PENDING DISTRIBUTION and save for Admin review
 * Step 6: Return detailed distribution report
 */
async function distributeEventInquiry(inquiryData) {
    const {
        inquiryId = ID.unique(),
        name,
        phone,
        email = '',
        eventType,
        guests = 0,
        eventDate = '',
        location = '',
        pincode = '',
        notes = '',
        leadSource = 'Website Inquiry',
        campaignData = ''
    } = inquiryData;

    console.log(`\n======================================================`);
    console.log(`🚀 [SMART LEAD ENGINE] Processing Inquiry: ${inquiryId}`);
    console.log(`   Customer: ${name} (${phone})`);
    console.log(`   Event Type: "${eventType}" | Guests: ${guests}`);
    console.log(`   Location: "${location}" | Pincode: "${pincode || 'N/A'}"`);
    console.log(`======================================================`);

    const now = new Date();
    const nowIso = now.toISOString();

    // Parse clean pincode
    const pinMatch = (location || '').match(/\b\d{6}\b/);
    const resolvedPincode = pincode || (pinMatch ? pinMatch[0] : (/^\d{6}$/.test((location || '').trim()) ? (location || '').trim() : ''));

    const criteria = {
        eventType,
        location: location || resolvedPincode,
        pincode: resolvedPincode,
        guests: parseInt(guests) || 0
    };

    // 1. Fetch Candidate Venues
    // We fetch all active venues to perform authoritative in-memory evaluation
    let allVenues = [];
    let offset = 0;
    const batchSize = 100;
    while (true) {
        try {
            const res = await databases.listDocuments(
                DATABASE_ID,
                VENUES_COLLECTION_ID,
                [Query.limit(batchSize), Query.offset(offset)]
            );
            allVenues.push(...res.documents);
            if (allVenues.length >= res.total) break;
            offset += batchSize;
        } catch (fetchErr) {
            console.error('[SMART LEAD ENGINE] Error fetching venues:', fetchErr.message);
            break;
        }
    }

    console.log(`[SMART LEAD ENGINE] Evaluating ${allVenues.length} registered venues...`);

    const evaluationResults = [];
    const eligibleVenues = [];
    const excludedVenues = [];

    for (const venue of allVenues) {
        const evalResult = evaluateVenueEligibility(venue, criteria, now);
        evaluationResults.push(evalResult);

        if (evalResult.isEligible) {
            eligibleVenues.push(evalResult);
            console.log(`  ✅ ELIGIBLE: "${venue.venueName}" (${venue.city}, Cap: ${venue.capacity}, Plan: ${evalResult.subscriptionPlan})`);
        } else {
            excludedVenues.push(evalResult);
        }
    }

    console.log(`\n[SMART LEAD ENGINE] Results Summary:`);
    console.log(`   Total Evaluated: ${allVenues.length}`);
    console.log(`   Eligible Venues: ${eligibleVenues.length}`);
    console.log(`   Excluded Venues: ${excludedVenues.length}`);

    const distributionAuditRecords = [];
    const deliveredLeadDocs = [];

    // Step 4 & 5: Distribution or No-Match Handling
    if (eligibleVenues.length === 0) {
        console.log(`⚠️ [SMART LEAD ENGINE] NO MATCH FOUND. Storing inquiry as UNMATCHED for Admin review.`);
        
        // Save unmatched inquiry document to LEADS collection with venueId = 'UNMATCHED'
        const unmatchedDoc = {
            venueId: 'UNMATCHED',
            name,
            phone,
            email,
            eventType,
            guests: criteria.guests,
            eventDate,
            pincode: resolvedPincode,
            location: (location || '').slice(0, 120),
            leadSource,
            campaignData: typeof campaignData === 'string' ? campaignData.slice(0, 990) : JSON.stringify(campaignData).slice(0, 990),
            notes: `UNMATCHED | No eligible partner venue found | Evaluated: ${allVenues.length} venues | ${notes}`,
            status: 'Pending Distribution',
            createdAt: nowIso,
            inquiryId
        };

        let createdUnmatched;
        try {
            createdUnmatched = await databases.createDocument(
                DATABASE_ID,
                LEADS_COLLECTION_ID,
                ID.unique(),
                unmatchedDoc
            );
        } catch (dbErr) {
            console.error('[SMART LEAD ENGINE] Error saving unmatched inquiry:', dbErr.message);
        }

        // Record audit logs for sample exclusions
        const topExclusions = excludedVenues.slice(0, 20);
        for (const ex of topExclusions) {
            try {
                await databases.createDocument(
                    DATABASE_ID,
                    LEAD_DISTRIBUTIONS_COLLECTION_ID,
                    ID.unique(),
                    {
                        leadId: createdUnmatched?.$id || inquiryId,
                        venueId: ex.venue.$id,
                        venueName: (ex.venue.venueName || '').slice(0, 250),
                        partnerId: ex.venue.userId || '',
                        subscriptionId: ex.venue.subscriptionId || '',
                        subscriptionPlan: (ex.venue.subscriptionPlan || 'None').slice(0, 120),
                        distributedAt: nowIso,
                        eligibilityResult: 'INELIGIBLE',
                        deliveryStatus: 'SKIPPED',
                        leadStatus: 'Pending Distribution',
                        rejectionReason: (ex.rejectionReason || 'Did not meet criteria').slice(0, 990),
                        criteriaSnapshot: JSON.stringify(criteria).slice(0, 1990)
                    }
                );
            } catch (auditErr) {
                // Ignore audit index duplicate or minor failure
            }
        }

        return {
            status: 'unmatched',
            inquiryId,
            leadDocumentId: createdUnmatched?.$id,
            matchCount: 0,
            eligibleVenues: [],
            totalEvaluated: allVenues.length,
            excludedCount: excludedVenues.length,
            message: 'Inquiry saved successfully. No eligible partner venues found matching all criteria.'
        };
    }

    // Distribute to ALL eligible venues
    console.log(`\n📤 [SMART LEAD ENGINE] Distributing lead to ${eligibleVenues.length} eligible venue(s)...`);

    for (const match of eligibleVenues) {
        const v = match.venue;
        try {
            // Idempotency check: Do not reassign the same lead/inquiry to this venue if already done
            const existingCheck = await databases.listDocuments(
                DATABASE_ID,
                LEADS_COLLECTION_ID,
                [
                    Query.equal('venueId', v.$id),
                    Query.equal('phone', phone),
                    Query.greaterThan('$createdAt', new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString()),
                    Query.limit(1)
                ]
            );

            if (existingCheck.total > 0) {
                console.log(`  ⏭️ Venue "${v.venueName}" already received this lead in the last 24h. Skipping duplicate.`);
                continue;
            }

            const partnerLeadDoc = {
                venueId: v.$id,
                name,
                phone,
                email,
                eventType,
                guests: criteria.guests,
                eventDate,
                pincode: resolvedPincode,
                location: (location || '').slice(0, 120),
                leadSource,
                campaignData: typeof campaignData === 'string' ? campaignData.slice(0, 990) : JSON.stringify(campaignData).slice(0, 990),
                notes: `SMART MATCH | Eligible Venue: ${v.venueName} | Plan: ${match.subscriptionPlan} | ${notes}`,
                status: 'New',
                createdAt: nowIso,
                inquiryId
            };

            const createdLead = await databases.createDocument(
                DATABASE_ID,
                LEADS_COLLECTION_ID,
                ID.unique(),
                partnerLeadDoc
            );

            deliveredLeadDocs.push(createdLead);

            // Create Distribution Audit Record
            try {
                const auditDoc = await databases.createDocument(
                    DATABASE_ID,
                    LEAD_DISTRIBUTIONS_COLLECTION_ID,
                    ID.unique(),
                    {
                        leadId: createdLead.$id,
                        venueId: v.$id,
                        venueName: (v.venueName || '').slice(0, 250),
                        partnerId: v.userId || '',
                        subscriptionId: v.subscriptionId || '',
                        subscriptionPlan: (match.subscriptionPlan || '').slice(0, 120),
                        distributedAt: nowIso,
                        eligibilityResult: 'ELIGIBLE',
                        deliveryStatus: 'DELIVERED',
                        leadStatus: 'New',
                        rejectionReason: '',
                        criteriaSnapshot: JSON.stringify(criteria).slice(0, 1990)
                    }
                );
                distributionAuditRecords.push(auditDoc);
            } catch (auditErr) {
                console.warn('[SMART LEAD ENGINE] Audit record write notice:', auditErr.message);
            }

            // Push Notification to Venue App
            if (v.expoPushToken) {
                sendPushNotification(
                    v.expoPushToken,
                    'New Qualified Event Inquiry! 🎊',
                    `${name} is planning a ${eventType} for ${criteria.guests} guests in ${v.city}. Tap to view!`,
                    { leadId: createdLead.$id }
                ).catch(() => {});
            }

            // Venue Email Alert
            if (v.contactEmail) {
                sendLeadNotificationEmail(v.contactEmail, {
                    name,
                    number: phone,
                    phone,
                    email,
                    eventType,
                    guestCapacity: criteria.guests,
                    guests: criteria.guests,
                    pincode: resolvedPincode || location,
                    location,
                    eventDate,
                    eventDetails: `Qualified Lead automatically matched for ${v.venueName}`
                }).catch(() => {});
            }

            console.log(`  🎉 DELIVERED: Lead assigned to "${v.venueName}" (Doc ID: ${createdLead.$id})`);
        } catch (distErr) {
            console.error(`  ❌ Failed distributing to "${v.venueName}":`, distErr.message);
        }
    }

    console.log(`\n🏁 [SMART LEAD ENGINE] Distribution complete. Delivered to ${deliveredLeadDocs.length} venues.\n`);

    return {
        status: 'success',
        inquiryId,
        matchCount: deliveredLeadDocs.length,
        eligibleVenues: eligibleVenues.map(e => ({
            venueId: e.venue.$id,
            venueName: e.venue.venueName,
            city: e.venue.city,
            capacity: e.venue.capacity,
            subscriptionPlan: e.subscriptionPlan
        })),
        totalEvaluated: allVenues.length,
        excludedCount: excludedVenues.length,
        message: `Lead successfully distributed to ${deliveredLeadDocs.length} eligible venues.`
    };
}

module.exports = {
    normalizeEventType,
    checkEventTypeMatch,
    checkLocationMatch,
    checkCapacityMatch,
    checkSubscriptionEligibility,
    evaluateVenueEligibility,
    distributeEventInquiry
};
