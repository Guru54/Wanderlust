const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review.js');
const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        filename: {
            type: String,
        },
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1502120663599-9d25e3b546a6?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8GVufDB8fHx8fA%3D%3D",
            set: (v) => v === "" ? "https://images.unsplash.com/photo-1502120663599-9d25e3b546a6?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8GVufDB8fHx8fA%3D%3D" : v,
        },
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review',
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }` or Mongoose will add "location" as an index
            enum: ['Point'], // must be 'Point'
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    }

});
listingSchema.post('findOneAndDelete', async function (listing) {
    if (listing) {
        await Review.deleteMany({_id: { $in: listing.reviews, }, });
    }
});
const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;