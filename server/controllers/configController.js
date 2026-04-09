// Return public Appwrite configuration for the frontend
exports.getPublicConfig = (req, res) => {
    res.status(200).json({
        status: 'success',
        endpoint: process.env.APPWRITE_ENDPOINT || 'https://sgp.cloud.appwrite.io/v1',
        projectId: process.env.APPWRITE_PROJECT_ID || '69ae84bc001ca4edf8c2',
        databaseId: process.env.APPWRITE_DATABASE_ID || '69c2305e000ecd6d04c1',
        venuesCollectionId: process.env.APPWRITE_VENUES_COLLECTION_ID || 'party-dial',
        storageBucketId: process.env.APPWRITE_STORAGE_BUCKET_ID || 'venues_photos',
        razorpayKeyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_Sb1MDU5xx48aKw'
    });
};
