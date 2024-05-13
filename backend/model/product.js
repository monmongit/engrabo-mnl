const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your product name'],
  },

  description: {
    type: String,
    required: [true, 'Please enter your product description'],
  },

  category: {
    type: String,
    required: [true, 'Please enter your product description'],
  },

  tags: {
    type: String,
    required: [true, 'Please enter your product description'],
  },

  // grossPrice: {
  //   type: Number,
  //   required: [true, 'Please enter your product gross price'],
  // },

  originalPrice: {
    type: Number,
    required: [true, 'Please enter your product price'],
  },

  discountPrice: {
    type: Number,
  },

  stock: {
    type: Number,
    required: [true, 'Please enter your product stock'],
  },

  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],

  reviews: [
    {
      user: {
        type: Object,
      },
      rating: {
        type: Number,
      },
      comment: {
        type: String,
      },
      productId: {
        type: String,
      },
      createdAt: {
        type: Date,
        default: Date.now(),
      },
    },
  ],

  ratings: {
    type: Number,
  },

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

module.exports = mongoose.model('Product', productSchema);
