import mongoose from "mongoose";


const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },

  discountPercentage: {
    type: Number,
    required: true,
    min:0,
    max:100
  },
  expiresAt: Date,
  minOrderValue: Number,
  isActive: {
    type: Boolean,
    default: true
  },
  useLimit: {
    type: Number
  },
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  }
}, { timestamps: true });

const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;