import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true // Added index for filtering by user
    },
    code: {
        type: String,
        required: true
    },
    purpose: {
        type: String,
        enum: ['register', 'login', 'passwordReset'],
        required: true,
        default:'register'
    },
    expiresAt: {
        type: Date,
        required: true,
        index: true // Added index for filtering by expiration time
    }
}, { timestamps: true })

const OTP = mongoose.model('OTP', otpSchema)

export default OTP
