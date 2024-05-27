const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Please enter your product name'] },
  description: {
    type: String,
    required: [true, 'Please enter your product description'],
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
  dropdowns: [{ name: String, options: [String] }],
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
  ratings: { type: Number },
  adminId: { type: String, required: true },
  admin: { type: Object, required: true },
  sold_out: { type: Number, default: 0 },
  createAt: { type: Date, default: Date.now },
  sizes: [{ name: String, price: Number, description: String }], // Add sizes field
  colors: [String], // Add colors field
  mediaType: {
    type: String,
    enum: ['none', 'text', 'image', 'both'],
    default: 'none',
  }, // Add mediaType field
  imageOptions: [{ name: String, price: Number, description: String }], // Add imageOptions field
  textOptions: [{ name: String, price: Number, description: String }], // Add textOptions field
});

module.exports = mongoose.model('Product', productSchema);
