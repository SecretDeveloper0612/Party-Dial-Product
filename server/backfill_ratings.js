import { Client, Databases, Query } from 'node-appwrite';
import dotenv from 'dotenv';
dotenv.config({ path: '/Users/haldwani/Documents/Working/party_dial/server/.env' });

const client = new Client()
    .setEndpoint('https://sgp.cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

async function run() {
    try {
        console.log("Fetching all reviews...");
        const reviewsData = await databases.listDocuments(
            process.env.APPWRITE_DATABASE_ID,
            process.env.APPWRITE_REVIEWS_COLLECTION_ID,
            [Query.limit(1000)]
        );
        
        const reviewsByVenue = {};
        for (const review of reviewsData.documents) {
            if (!reviewsByVenue[review.venueId]) {
                reviewsByVenue[review.venueId] = [];
            }
            reviewsByVenue[review.venueId].push(review.rating);
        }

        console.log(`Found reviews for ${Object.keys(reviewsByVenue).length} venues. Updating venues...`);

        for (const [venueId, ratings] of Object.entries(reviewsByVenue)) {
            const totalReviews = ratings.length;
            const avgRating = ratings.reduce((acc, r) => acc + (Number(r) || 0), 0) / totalReviews;
            
            try {
                await databases.updateDocument(
                    process.env.APPWRITE_DATABASE_ID,
                    process.env.APPWRITE_VENUES_COLLECTION_ID,
                    venueId,
                    {
                        rating: parseFloat(avgRating.toFixed(1)),
                        totalReviews: totalReviews
                    }
                );
                console.log(`Updated venue ${venueId}: rating ${avgRating.toFixed(1)}, totalReviews ${totalReviews}`);
            } catch (err) {
                console.error(`Failed to update venue ${venueId}:`, err.message);
            }
        }
        console.log("Backfill complete!");
    } catch (error) {
        console.error(error);
    }
}
run();
