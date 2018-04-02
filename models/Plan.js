// Importing Node packages required for schema
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const PlanSchema = new Schema({
    planName: { type: String },
    planPrice: { type: Number },
    planDetails: [{ type: String }],
    planImage: { type: String }
});

module.exports = mongoose.model('Plan', PlanSchema);