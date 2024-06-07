const mongoose = require('mongoose');

const couponCodeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your coupon code name'],
    unique: true,
  },
  value: {
    type: Number,
    required: true,
  },
  minAmount: {
    type: Number,
  },
  adminId: {
    type: String,
    required: true,
  },
  selectedProducts: {
    type: [String], // Update to array
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
  expiresAt: {
    type: Date,
    required: [true, 'Please enter an expiry date for the coupon code'],
  },
});

// Virtual field for 'status'
couponCodeSchema.virtual('status').get(function () {
  return new Date() < this.expiresAt ? 'Active' : 'Expired';
});

// Make sure virtuals are included when you convert a document to JSON or an Object
couponCodeSchema.set('toJSON', { virtuals: true });
couponCodeSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('CouponCode', couponCodeSchema);
