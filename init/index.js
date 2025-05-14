const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');

main().then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

async function main() {
    await mongoose.connect('mongodb://localhost:27017/wanderlust');
}

const initDb = async () => {
    try {
        // Delete all existing data
        const deleteResult = await Listing.deleteMany({});
        console.log(`Deleted ${deleteResult.deletedCount} existing listings.`);
        const ownerId = new mongoose.Types.ObjectId("681c3d557a4ed8ad2954db9e");
        initData.data =   initData.data.map((listing) => ({...listing, owner: ownerId}));
        // Insert new data
        const insertResult = await Listing.insertMany(initData.data);

        console.log(`Inserted ${insertResult.length} new listings.`);
    } catch (error) {
        console.error('Error initializing database:', error);
    }
};

initDb();