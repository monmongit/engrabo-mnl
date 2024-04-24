const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your event product name'],
  },

  description: {
    type: String,
    required: [true, 'Please enter your event product description'],
  },

  category: {
    type: String,
    required: [true, 'Please enter your event product description'],
  },

  start_Date: {
    type: Date,
    required: true,
  },

  Finish_Date: {
    type: Date,
    required: true,
  },

  status: {
    type: String,
    default: 'Running',
  },

  tags: {
    type: String,
    required: [true, 'Please enter your event product description'],
  },

  originalPrice: {
    type: Number,
    required: [true, 'Please enter your event product price'],
  },

  discountPrice: {
    type: Number,
  },

  stock: {
    type: Number,
    required: [true, 'Please enter your event product stock'],
  },

  images: [
    {
      type: String,
    },
  ],

  adminId: {
    type: String,
    required: true,
  },

  admin: {
    type: Object,
    required: true,
  },

  sold_out: {
    type: Number,
    default: 0,
  },

  createAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('Event', eventSchema);
