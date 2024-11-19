// deal model
import mongoose from 'mongoose';

const dealSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    dealDescription: {
        type: String,
        required: true
    },
    creatorType: {
        type: String,
        default: "Any type of Creator"
    },
    followers: {
        type: Number,
        default: 0
    },
    dealType: {
        type: [String],
        default: ["barter", "paid", "commission", "job"]
    },
    email: {
        type: String
    },
    mobile: {
        type: String,
    },
    socialMedia: {
        type: String,
        required: true
    },
    approved: {
        type: String,
        default: "pending"
    }
}, { timestamps: true });

const deals = mongoose.model("Deal", dealSchema);
export default deals;