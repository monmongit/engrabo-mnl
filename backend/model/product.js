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
  grossPrice: {
    type: Number,
    required: [true, 'Please enter your product gross price'],
  },
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
<<<<<<< HEAD

  // add an option for admin instructions to customer for personalization
  instructions : {
    type: String,
  }, 

  // add fields for dropdown menus for product
  dropdowns : [
    {
      name: String, 
      options: [String]
    }
  ],


=======
>>>>>>> 259617d748bf340a6567d21213a614f0954324fd
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
      isAnonymous: {
        type: Boolean,
        default: false,
      },
      reviewImages: [
        {
          public_id: {
            type: String,
          },
          url: {
            type: String,
          },
        },
      ],
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
