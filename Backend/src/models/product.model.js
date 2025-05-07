import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    price: {
        type: Number,
        required: true
    },
    isOrganic: {
        type: Boolean,
        default:false
    },
    organicRequestPending: {
        type:Boolean,
        default:false
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
        index: true 
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true,
        index: true 
    },
    stock: {
        type: Number,
        default: 0
    },
    imageUrl: [String],
}, { timestamps: true })

const Product = mongoose.model('Product', productSchema)

export default Product
