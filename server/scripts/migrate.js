require('dotenv').config();
const { databases, DATABASE_ID, VENUES_COLLECTION_ID, LEADS_COLLECTION_ID } = require('../config/appwrite');
const connectDB = require('../config/mongoose');
const Venue = require('../models/Venue');
const Lead = require('../models/Lead');
const User = require('../models/User');
const mongoose = require('mongoose');

async function migrate() {
    try {
        await connectDB();
        console.log('--- Starting Migration from Appwrite to MongoDB ---');

        // 1. Migrate Venues
        console.log('Fetching venues from Appwrite...');
        const appwriteVenues = await databases.listDocuments(DATABASE_ID, VENUES_COLLECTION_ID);
        
        for (const av of appwriteVenues.documents) {
            // Check if venue already exists by name or some mapping
            const existingVenue = await Venue.findOne({ name: av.venueName });
            if (!existingVenue) {
                console.log(`Migrating Venue: ${av.venueName}`);
                await Venue.create({
                    name: av.venueName,
                    location: av.state || 'Unknown',
                    city: av.city || 'Unknown',
                    type: av.venueType || 'Banquet Hall',
                    capacity: parseInt(av.capacity) || 0, // Converting string to number if possible
                    pricePerPlate: 0, // Placeholder
                    rating: 0,
                    reviewsCount: 0,
                    verified: av.isVerified || false,
                    onboardingComplete: av.onboardingComplete || false,
                    status: av.status || 'active'
                });
            }
        }

        console.log('✅ Migration complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    }
}

migrate();
