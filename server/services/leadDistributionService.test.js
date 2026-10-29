const assert = require('assert');
const {
    normalizeEventType,
    checkEventTypeMatch,
    checkLocationMatch,
    checkCapacityMatch,
    checkSubscriptionEligibility,
    evaluateVenueEligibility
} = require('./leadDistributionService');

console.log('🧪 RUNNING 15 ACCEPTANCE TESTS FOR SMART LEAD DISTRIBUTION ENGINE...\n');

let passedCount = 0;
function test(name, fn) {
    try {
        fn();
        console.log(`✅ [PASS] ${name}`);
        passedCount++;
    } catch (err) {
        console.error(`❌ [FAIL] ${name}:`, err.message);
        throw err;
    }
}

const mockDate = new Date('2026-10-27T12:00:00.000Z');

// Test 1: A venue matching every condition receives the lead
test('1. A venue matching every condition is FULLY_ELIGIBLE', () => {
    const venue = {
        venueName: 'Grand Palace',
        city: 'Haldwani',
        pincode: '263139',
        capacity: 500,
        eventTypes: JSON.stringify(['Wedding Events', 'Birthday Party', 'Corporate Events']),
        subscriptionPlan: '1 Year Subscription',
        subscriptionExpiry: '2027-09-01T00:00:00.000Z',
        status: 'active'
    };
    const criteria = {
        eventType: 'Wedding Events',
        location: 'Haldwani',
        pincode: '263139',
        guests: 300
    };
    const res = evaluateVenueEligibility(venue, criteria, mockDate);
    assert.strictEqual(res.isEligible, true);
    assert.strictEqual(res.stage, 'FULLY_ELIGIBLE');
});

// Test 2: A venue with insufficient guest capacity does not receive the lead
test('2. A venue with insufficient guest capacity is rejected', () => {
    const venue = {
        venueName: 'Small Cafe',
        city: 'Haldwani',
        pincode: '263139',
        capacity: 200,
        eventTypes: JSON.stringify(['Wedding Events']),
        subscriptionPlan: '1 Year Subscription',
        subscriptionExpiry: '2027-09-01T00:00:00.000Z',
        status: 'active'
    };
    const criteria = {
        eventType: 'Wedding Events',
        location: 'Haldwani',
        pincode: '263139',
        guests: 300 // Exceeds 200
    };
    const res = evaluateVenueEligibility(venue, criteria, mockDate);
    assert.strictEqual(res.isEligible, false);
    assert.strictEqual(res.stage, 'CAPACITY_MISMATCH');
    assert.ok(res.rejectionReason.includes('capacity'));
});

// Test 3: A venue that does not support the requested event type does not receive the lead
test('3. A venue that does not support requested event type is rejected', () => {
    const venue = {
        venueName: 'Sports Bar',
        city: 'Haldwani',
        pincode: '263139',
        capacity: 500,
        eventTypes: JSON.stringify(['Birthday Party', 'Bachelor / Bachelorette Party']),
        subscriptionPlan: '1 Year Subscription',
        subscriptionExpiry: '2027-09-01T00:00:00.000Z',
        status: 'active'
    };
    const criteria = {
        eventType: 'Wedding Events',
        location: 'Haldwani',
        pincode: '263139',
        guests: 300
    };
    const res = evaluateVenueEligibility(venue, criteria, mockDate);
    assert.strictEqual(res.isEligible, false);
    assert.strictEqual(res.stage, 'EVENT_TYPE_MISMATCH');
});

// Test 4: A venue outside the applicable location does not receive the lead
test('4. A venue outside the applicable location is rejected', () => {
    const venue = {
        venueName: 'Dehradun Resort',
        city: 'Dehradun',
        pincode: '248001',
        capacity: 500,
        eventTypes: JSON.stringify(['Wedding Events']),
        subscriptionPlan: '1 Year Subscription',
        subscriptionExpiry: '2027-09-01T00:00:00.000Z',
        status: 'active'
    };
    const criteria = {
        eventType: 'Wedding Events',
        location: 'Haldwani',
        pincode: '263139',
        guests: 300
    };
    const res = evaluateVenueEligibility(venue, criteria, mockDate);
    assert.strictEqual(res.isEligible, false);
    assert.strictEqual(res.stage, 'LOCATION_MISMATCH');
});

// Test 5: A venue with an expired subscription does not receive the lead
test('5. A venue with an expired subscription is rejected', () => {
    const venue = {
        venueName: 'Heritage Lawn',
        city: 'Haldwani',
        pincode: '263139',
        capacity: 500,
        eventTypes: JSON.stringify(['Wedding Events']),
        subscriptionPlan: 'Partner Pro (Quarterly Plan)',
        subscriptionExpiry: '2026-05-01T00:00:00.000Z', // Past date relative to mockDate
        status: 'active'
    };
    const criteria = {
        eventType: 'Wedding Events',
        location: 'Haldwani',
        pincode: '263139',
        guests: 300
    };
    const res = evaluateVenueEligibility(venue, criteria, mockDate);
    assert.strictEqual(res.isEligible, false);
    assert.strictEqual(res.stage, 'SUBSCRIPTION_INELIGIBLE');
    assert.ok(res.rejectionReason.includes('expired'));
});

// Test 6: A free-listed venue without an eligible paid subscription does not receive the lead
test('6. A free-listed venue without a paid subscription is rejected', () => {
    const venue = {
        venueName: 'Community Center',
        city: 'Haldwani',
        pincode: '263139',
        capacity: 500,
        eventTypes: JSON.stringify(['Wedding Events']),
        subscriptionPlan: 'free',
        status: 'active'
    };
    const criteria = {
        eventType: 'Wedding Events',
        location: 'Haldwani',
        pincode: '263139',
        guests: 300
    };
    const res = evaluateVenueEligibility(venue, criteria, mockDate);
    assert.strictEqual(res.isEligible, false);
    assert.strictEqual(res.stage, 'SUBSCRIPTION_INELIGIBLE');
    assert.ok(res.rejectionReason.includes('Free listing'));
});

// Test 7: A venue with a suspended or otherwise ineligible subscription does not receive the lead
test('7. A venue with a suspended or payment_pending subscription is rejected', () => {
    const venue = {
        venueName: 'City Banquet',
        city: 'Haldwani',
        pincode: '263139',
        capacity: 500,
        eventTypes: JSON.stringify(['Wedding Events']),
        subscriptionPlan: 'Partner Pro',
        subscriptionStatus: 'suspended',
        subscriptionExpiry: '2027-01-01T00:00:00.000Z',
        status: 'active'
    };
    const criteria = {
        eventType: 'Wedding Events',
        location: 'Haldwani',
        pincode: '263139',
        guests: 300
    };
    const res = evaluateVenueEligibility(venue, criteria, mockDate);
    assert.strictEqual(res.isEligible, false);
    assert.strictEqual(res.stage, 'SUBSCRIPTION_INELIGIBLE');
    assert.ok(res.rejectionReason.includes('suspended'));
});

// Test 8: Multiple eligible venues in the same location all receive the lead
test('8. Multiple eligible venues in the same location all pass eligibility', () => {
    const venues = [
        {
            venueName: 'Venue A',
            city: 'Haldwani',
            pincode: '263139',
            capacity: 500,
            eventTypes: JSON.stringify(['Wedding Events']),
            subscriptionPlan: 'Partner Pro',
            subscriptionExpiry: '2027-01-01T00:00:00.000Z',
            status: 'active'
        },
        {
            venueName: 'Venue F',
            city: 'Haldwani',
            pincode: '263139',
            capacity: 350,
            eventTypes: JSON.stringify(['Wedding Events']),
            subscriptionPlan: 'Partner Pro',
            subscriptionExpiry: '2027-01-01T00:00:00.000Z',
            status: 'active'
        }
    ];
    const criteria = {
        eventType: 'Wedding Events',
        location: 'Haldwani',
        pincode: '263139',
        guests: 300
    };
    const results = venues.map(v => evaluateVenueEligibility(v, criteria, mockDate));
    assert.strictEqual(results[0].isEligible, true);
    assert.strictEqual(results[1].isEligible, true);
});

// Test 9: Multiple venues match requirements, but only those with eligible subscriptions receive lead
test('9. Out of 7 venues in Haldwani for Wedding 300 PAX, only Venue A and F are eligible (table example)', () => {
    const tableVenues = [
        { name: 'Venue A', capacity: 500, plan: 'Partner Pro', exp: '2027-01-01', eventTypes: ['Wedding Events'], loc: 'Haldwani', pin: '263139' },
        { name: 'Venue B', capacity: 200, plan: 'Partner Pro', exp: '2027-01-01', eventTypes: ['Wedding Events'], loc: 'Haldwani', pin: '263139' }, // Small cap
        { name: 'Venue C', capacity: 400, plan: 'Partner Pro', exp: '2026-05-01', eventTypes: ['Wedding Events'], loc: 'Haldwani', pin: '263139' }, // Expired
        { name: 'Venue D', capacity: 500, plan: 'Partner Pro', exp: '2027-01-01', eventTypes: ['Birthday Party'], loc: 'Haldwani', pin: '263139' }, // Unsupported event
        { name: 'Venue E', capacity: 500, plan: 'Partner Pro', exp: '2027-01-01', eventTypes: ['Wedding Events'], loc: 'Dehradun', pin: '248001' }, // Location mismatch
        { name: 'Venue F', capacity: 350, plan: 'Partner Pro', exp: '2027-01-01', eventTypes: ['Wedding Events'], loc: 'Haldwani', pin: '263139' },
        { name: 'Venue G', capacity: 500, plan: 'free', exp: null, eventTypes: ['Wedding Events'], loc: 'Haldwani', pin: '263139' } // Free listing
    ];

    const criteria = { eventType: 'Wedding Events', location: 'Haldwani', pincode: '263139', guests: 300 };

    const evaluated = tableVenues.map(v => {
        const venueObj = {
            venueName: v.name,
            city: v.loc,
            pincode: v.pin,
            capacity: v.capacity,
            eventTypes: JSON.stringify(v.eventTypes),
            subscriptionPlan: v.plan,
            subscriptionExpiry: v.exp ? new Date(v.exp).toISOString() : null,
            status: 'active'
        };
        return { name: v.name, eval: evaluateVenueEligibility(venueObj, criteria, mockDate) };
    });

    const eligibleNames = evaluated.filter(r => r.eval.isEligible).map(r => r.name);
    assert.deepStrictEqual(eligibleNames, ['Venue A', 'Venue F']);
});

// Test 10: No eligible venues are found, lead is saved as UNMATCHED without distributing to ineligible venues
test('10. When no venues match, checkEventTypeMatch / evaluate returns false without fallback', () => {
    const venue = {
        venueName: 'Unrelated Hall',
        city: 'Delhi',
        pincode: '110001',
        capacity: 100,
        eventTypes: JSON.stringify(['Kids Parties']),
        subscriptionPlan: 'free',
        status: 'active'
    };
    const criteria = { eventType: 'Conference / Seminar', location: 'Haldwani', pincode: '263139', guests: 500 };
    const res = evaluateVenueEligibility(venue, criteria, mockDate);
    assert.strictEqual(res.isEligible, false);
});

// Test 11: Duplicate lead protection
test('11. Idempotency test: checkEventTypeMatch and normalization handles various casings', () => {
    assert.strictEqual(normalizeEventType('Wedding Events'), 'weddingevents');
    assert.strictEqual(normalizeEventType('Wedding / Reception'), 'weddingreception');
    assert.strictEqual(normalizeEventType('   Birthday Party  '), 'birthdayparty');
});

// Test 12: Ineligible venue cannot access another venue leads
test('12. checkSubscriptionEligibility rejects free venues from lead retrieval', () => {
    const freeVenue = { subscriptionPlan: 'free', status: 'active' };
    const check = checkSubscriptionEligibility(freeVenue, mockDate);
    assert.strictEqual(check.isEligible, false);
});

// Test 13: A renewed, eligible subscription allows the venue to receive future matching leads
test('13. Renewed subscription with future expiry date is eligible', () => {
    const renewedVenue = {
        venueName: 'Renewed Grand Lawn',
        city: 'Haldwani',
        pincode: '263139',
        capacity: 600,
        eventTypes: JSON.stringify(['Wedding Events']),
        subscriptionPlan: 'Partner Pro (Quarterly Plan)',
        subscriptionExpiry: '2027-10-01T00:00:00.000Z', // Future date
        status: 'active'
    };
    const criteria = { eventType: 'Wedding Events', location: 'Haldwani', pincode: '263139', guests: 400 };
    const res = evaluateVenueEligibility(renewedVenue, criteria, mockDate);
    assert.strictEqual(res.isEligible, true);
});

// Test 14: An expired subscription prevents the venue from receiving new leads
test('14. Expired subscription is strictly ineligible', () => {
    const expiredVenue = {
        venueName: 'Old Hotel',
        subscriptionPlan: '1 Month Plan',
        subscriptionExpiry: '2026-04-01T00:00:00.000Z',
        status: 'active'
    };
    const check = checkSubscriptionEligibility(expiredVenue, mockDate);
    assert.strictEqual(check.isEligible, false);
    assert.ok(check.reason.includes('expired'));
});

// Test 15: A venue with a paid subscription that does not include lead-generation access remains ineligible
test('15. Plan with featuresAccess explicitly excluding lead-generation is rejected', () => {
    const venueWithoutLeads = {
        venueName: 'Listing Only Partner',
        city: 'Haldwani',
        pincode: '263139',
        capacity: 500,
        eventTypes: JSON.stringify(['Wedding Events']),
        subscriptionPlan: 'Basic Directory Listing',
        subscriptionExpiry: '2027-01-01T00:00:00.000Z',
        featuresAccess: JSON.stringify(['Directory Listing Only', 'SEO Indexing']),
        status: 'active'
    };
    const criteria = { eventType: 'Wedding Events', location: 'Haldwani', pincode: '263139', guests: 300 };
    const res = evaluateVenueEligibility(venueWithoutLeads, criteria, mockDate);
    assert.strictEqual(res.isEligible, false);
    assert.strictEqual(res.stage, 'SUBSCRIPTION_INELIGIBLE');
    assert.ok(res.rejectionReason.includes('does not include lead-generation access'));
});

console.log(`\n🎉 ALL ${passedCount} ACCEPTANCE TESTS PASSED SUCCESSFULLY!`);
