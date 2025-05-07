import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
        index: true // Added index for filtering by product
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true // Added index for filtering by customer
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
        default:1
    },
    comment: String
}, { timestamps: true })

const Review = mongoose.model('Review', reviewSchema)

export default Review
