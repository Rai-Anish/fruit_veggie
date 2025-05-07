import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true 
    },
    storeName: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    address: {
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
        required: true
      },
    isApproved: {
        type: Boolean,
        default: false,
        index: true // for filtering approved vs pending vendors
    },
    isOrganicApproved: {
        type: Boolean,
        default: false,
        index: true //  for filtering organic approved vendors
    },
    badges: [String],
}, { timestamps: true })

const Vendor = mongoose.model('Vendor', vendorSchema)

export default Vendor
