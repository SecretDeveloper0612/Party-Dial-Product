/**
 * PAX Bucket Matching Utility
 * 
 * Distributes leads to venues based on predefined capacity buckets.
 * A venue is eligible if its capacity bucket >= the lead's required bucket.
 * 
 * Example: Lead requests "100-200" guests → venues with buckets 
 * 100-200, 200-500, 500-1000, etc. are eligible.
 * Venues with 0-50 or 50-100 are NOT eligible.
 */

// Predefined PAX ranges with their upper bound values
const PAX_BUCKETS = [
    { range: '0-50',       max: 50 },
    { range: '50-100',     max: 100 },
    { range: '100-200',    max: 200 },
    { range: '200-500',    max: 500 },
    { range: '500-1000',   max: 1000 },
    { range: '1000-2000',  max: 2000 },
    { range: '2000-5000',  max: 5000 },
    { range: '5000+',      max: 10000 },
];

/**
 * Get the bucket max value for a venue's capacity (integer).
 * Maps an integer capacity to the appropriate bucket.
 * 
 * Examples:
 *   50  → 50   (0-50 bucket)
 *   80  → 100  (50-100 bucket)
 *   150 → 200  (100-200 bucket)
 *   500 → 500  (200-500 bucket)
 *   6000 → 10000 (5000+ bucket)
 */
function getVenueBucketMax(capacity) {
    const cap = parseInt(capacity) || 0;
    if (cap <= 0) return 0; // No capacity defined

    for (const bucket of PAX_BUCKETS) {
        if (cap <= bucket.max) return bucket.max;
    }
    return 10000; // 5000+ bucket
}

/**
 * Parse a guest capacity string (from client form) to a bucket max value.
 * Handles formats: "100-200", "5000+", "200", etc.
 * 
 * Examples:
 *   "0-50"     → 50
 *   "100-200"  → 200
 *   "5000+"    → 10000
 *   "300"      → 500  (maps to 200-500 bucket)
 */
function getLeadBucketMax(guestCapacity) {
    const str = String(guestCapacity || '0').trim();

    // Handle "5000+" format
    if (str.includes('+')) {
        return 10000;
    }

    // Handle "100-200" range format — use the upper bound
    if (str.includes('-')) {
        const upper = parseInt(str.split('-').pop()) || 0;
        // Map to nearest bucket boundary
        for (const bucket of PAX_BUCKETS) {
            if (upper <= bucket.max) return bucket.max;
        }
        return 10000;
    }

    // Handle plain number "200"
    const num = parseInt(str) || 0;
    for (const bucket of PAX_BUCKETS) {
        if (num <= bucket.max) return bucket.max;
    }
    return 10000;
}

/**
 * Check if a venue's capacity bucket can handle a lead's guest requirement.
 * 
 * Rule: venue bucket max >= lead bucket max
 * 
 * @param {number|string} venueCapacity - Venue's capacity (integer or string)
 * @param {string} leadGuestCapacity - Lead's guest capacity range string ("100-200", "5000+", etc.)
 * @returns {boolean} true if venue can handle the lead
 * 
 * Examples:
 *   isVenueEligible(500, "100-200")  → true  (500 bucket >= 200 bucket)
 *   isVenueEligible(80, "100-200")   → false (100 bucket < 200 bucket)
 *   isVenueEligible(2000, "1000-2000") → true  (2000 bucket >= 2000 bucket)
 */
function isVenueEligible(venueCapacity, leadGuestCapacity) {
    const venueMax = getVenueBucketMax(venueCapacity);
    const leadBucketMax = getLeadBucketMax(leadGuestCapacity);

    // If venue has no capacity defined, it's not eligible
    if (venueMax === 0) return false;
    // If lead has no guest count, allow all venues
    if (leadBucketMax === 0) return true;

    const venueBucketIdx = PAX_BUCKETS.findIndex(b => b.max === venueMax);
    const leadBucketIdx = PAX_BUCKETS.findIndex(b => b.max === leadBucketMax);

    // 1. Venue must be large enough for the lead (Standard check)
    // Rule: Venue bucket index must be >= Lead bucket index
    const isLargeEnough = venueBucketIdx >= leadBucketIdx;

    // 2. Venue must not be "excessively large" for the lead
    // Rule: We allow a maximum gap of 2 buckets.
    // Example: A 2000-5000 venue (Bucket 6) can take leads from:
    //   - 2000-5000 (Bucket 6)
    //   - 1000-2000 (Bucket 5)
    //   - 500-1000  (Bucket 4)
    // It will REJECT 200-500 (Bucket 3) and below.
    // This prevents 5000-capacity venues from being spammed with 50-guest leads.
    const isNotTooLarge = (venueBucketIdx - leadBucketIdx) <= 2;

    return isLargeEnough && isNotTooLarge;
}

/**
 * Get a human-readable bucket label for a capacity value.
 * @param {number|string} capacity
 * @returns {string} e.g. "100-200 PAX"
 */
function getBucketLabel(capacity) {
    const cap = parseInt(capacity) || 0;
    if (cap <= 0) return 'No Capacity';
    for (const bucket of PAX_BUCKETS) {
        if (cap <= bucket.max) return `${bucket.range} PAX`;
    }
    return '5000+ PAX';
}

module.exports = {
    PAX_BUCKETS,
    getVenueBucketMax,
    getLeadBucketMax,
    isVenueEligible,
    getBucketLabel
};
