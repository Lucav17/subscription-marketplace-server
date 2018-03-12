// Importing Node packages required for schema
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const ListingSchema = new Schema({
    storeName: { type: String },
    productName: { type: String },
    productDescription: { type: String },
    storeEmail: { type: String },
    terms: [
        {
            option: { type: String },
            title: { type: String },
            price: { type: Number }
        }
    ],
    images: [{ type: String }],
    categories: [{ type: String }],
    tags: [{ type: String }],
    isFeatured: { type: Boolean }
});
module.exports = mongoose.model('Listing', ListingSchema);