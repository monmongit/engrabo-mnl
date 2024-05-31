const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  grossPrice: { type: Number, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  description: { type: String, required: true },
});

const engravingSchema = new mongoose.Schema({
  type: { type: String, required: true }, // text or image
  grossPrice: { type: Number, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  description: { type: String, required: true },
});

const colorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  stock: { type: Number, required: true },
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Please enter your product name'] },
  description: {
    type: String,
    required: [true, 'Please enter your product description'],
  },
  details: {
    type: String,
    required: [true, 'Please enter your product details'],
  },
  category: {
    type: String,
    required: [true, 'Please enter your product category'],
  },
  tags: { type: String, required: [true, 'Please enter your product tags'] },
  grossPrice: {
    type: Number,
    required: [true, 'Please enter your product gross price'],
  },
  originalPrice: {
    type: Number,
    required: [true, 'Please enter your product original price'],
  },
  discountPrice: { type: Number },
  stock: { type: Number, required: [true, 'Please enter your product stock'] },
  images: [
    {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
  ],
  instructions: { type: String },
  sizes: [optionSchema],
  engravings: [engravingSchema],
  colors: [colorSchema],
  ratings: { type: Number },
  reviews: [
    {
      user: { type: Object },
      rating: { type: Number },
      comment: { type: String },
      isAnonymous: { type: Boolean, default: false },
      reviewImages: [{ public_id: { type: String }, url: { type: String } }],
      productId: { type: String },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  adminId: { type: String, required: true },
  admin: { type: Object, required: true },
  sold_out: { type: Number, default: 0 },
  createAt: { type: Date, default: Date.now },
  mediaType: {
    type: String,
    enum: ['none', 'text', 'image', 'both'],
    default: 'none',
  },
});

module.exports = mongoose.model('Product', productSchema);
