export const PAX_BUCKETS = [
    { range: '0-50',       max: 50 },
    { range: '50-100',     max: 100 },
    { range: '100-200',    max: 200 },
    { range: '200-500',    max: 500 },
    { range: '500-1000',   max: 1000 },
    { range: '1000-2000',  max: 2000 },
    { range: '2000-5000',  max: 5000 },
    { range: '5000+',      max: 10000 },
];

export function getVenueBucketMax(capacity) {
    const cap = parseInt(capacity) || 0;
    if (cap <= 0) return 0;

    for (const bucket of PAX_BUCKETS) {
        if (cap <= bucket.max) return bucket.max;
    }
    return 10000;
}

export function getLeadBucketMax(guestCapacity) {
    const str = String(guestCapacity || '0').trim();

    if (str.includes('+')) return 10000;

    if (str.includes('-')) {
        const upper = parseInt(str.split('-').pop()) || 0;
        for (const bucket of PAX_BUCKETS) {
            if (upper <= bucket.max) return bucket.max;
        }
        return 10000;
    }

    const num = parseInt(str) || 0;
    for (const bucket of PAX_BUCKETS) {
        if (num <= bucket.max) return bucket.max;
    }
    return 10000;
}

export function isVenueEligible(venueCapacity, leadGuestCapacity) {
    const venueMax = getVenueBucketMax(venueCapacity);
    const leadBucketMax = getLeadBucketMax(leadGuestCapacity);

    if (venueMax === 0) return false;
    if (leadBucketMax === 0) return true;

    const venueBucketIdx = PAX_BUCKETS.findIndex(b => b.max === venueMax);
    const leadBucketIdx = PAX_BUCKETS.findIndex(b => b.max === leadBucketMax);

    const isLargeEnough = venueBucketIdx >= leadBucketIdx;
    const isNotTooLarge = (venueBucketIdx - leadBucketIdx) <= 2;

    return isLargeEnough && isNotTooLarge;
}

export function getBucketLabel(capacity) {
    const cap = parseInt(capacity) || 0;
    if (cap <= 0) return 'No Capacity';
    for (const bucket of PAX_BUCKETS) {
        if (cap <= bucket.max) return `${bucket.range} PAX`;
    }
    return '5000+ PAX';
}
