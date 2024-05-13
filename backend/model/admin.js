const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your shop name!'],
  },
  email: {
    type: String,
    required: [true, 'Please enter your email!'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Please enter your password'],
    minLength: [6, 'Password should be at least 6 characters'],
    select: false,
  },
  description: {
    type: String,
  },
  phoneNumber: {
    type: Number,
  },
  address: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'Admin',
  },
  zipCode: {
    type: Number,
    required: true,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  availableBalance: {
    type: Number,
    default: 0,
  },
  transections: [
    {
      amount: {
        type: Number,
        required: true,
      },
      status: {
        type: String,
        default: 'Processing',
      },
      createAt: {
        type: Date,
        default: Date.now(),
      },
      updateAt: {
        type: Date,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordTime: Date,
});

//  Hash password
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// jwt token
adminSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

// compare password
adminSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);
