const express = require('express');
const User = require('../model/user');
const router = express.Router();
const cloudinary = require('cloudinary');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncError');
const jwt = require('jsonwebtoken');
const sendMail = require('../utils/sendMail');
const sendToken = require('../utils/jwtToken');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// Create user
router.post('/create-user', async (req, res, next) => {
  try {
    const { name, email, password, avatar } = req.body;
    const userEmail = await User.findOne({ email });

    if (userEmail) {
      return next(new ErrorHandler('User already exists', 400));
    }

    const myCloud = await cloudinary.v2.uploader.upload(avatar, {
      folder: 'avatars',
    });

    const user = {
      name: name,
      email: email,
      password: password,
      avatar: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    };

    const activationToken = createActivationToken(user);

    const activationUrl = `http://localhost:3000/activation/${activationToken}`;

    try {
      await sendMail({
        email: user.email,
        subject: 'Activate your account',
        message: `Hello ${user.name}, please click on the link to activate your account: ${activationUrl}`,
      });
      res.status(201).json({
        success: true,
        message: `please check your email:- ${user.email} to activate your account!`,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Create activation token
const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, {
    expiresIn: '5m',
  });
};

// Activate user
router.post(
  '/activation',
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { activation_token } = req.body;

      const newUser = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET
      );
      if (!newUser) {
        return next(new ErrorHandler('Invalid Token', 400));
      }

      const { name, email, password, avatar } = newUser;

      let user = await User.findOne({ email });

      if (user) {
        return next(new ErrorHandler('User already exists', 400));
      }

      // Now, create the user with the verified information
      user = await User.create({
        name,
        email,
        avatar,
        password: password, // Ensure the password is hashed before saving
      });

      sendToken(user, 201, res); // Assuming this function handles token creation and response
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Login user
router.post(
  '/login-user',
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new ErrorHandler('Please provide all the fields', 400));
      }

      const user = await User.findOne({ email }).select('+password');

      if (!user) {
        return next(new ErrorHandler("User doesn't exists!", 400));
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(
          new ErrorHandler('Please enter your credentials correctly!', 400)
        );
      }
      sendToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Load user
router.get(
  '/getuser',
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return next(new ErrorHandler("User doesn't exists!", 400));
      }
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Logout User
router.get(
  '/logout',
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      });

      res.status(201).json({
        success: true,
        message: 'Logout Successfully!',
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Update user info
router.put(
  '/update-user-info',
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password, phoneNumber, name } = req.body;

      const user = await User.findOne({ email }).select('+password');

      if (!user) {
        return next(new ErrorHandler('User not found', 400));
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(
          new ErrorHandler('Please provide the correct information', 400)
        );
      }

      user.name = name;
      user.email = email;
      user.phoneNumber = phoneNumber;

      await user.save();

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Update user avatar
router.put(
  '/update-avatar',
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      let existsUser = await User.findById(req.user.id);
      if (req.body.avatar !== '') {
        const imageId = existsUser.avatar.public_id;

        await cloudinary.v2.uploader.destroy(imageId);

        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
          folder: 'avatars',
          width: 150,
        });

        existsUser.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      await existsUser.save();

      res.status(200).json({
        success: true,
        user: existsUser,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Update user addresses
router.put(
  '/update-user-addresses',
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);

      const sameTypeAddress = user.addresses.find(
        (address) => address.addressType === req.body.addressType
      );

      if (sameTypeAddress) {
        return next(
          new ErrorHandler(`${req.body.addressType} address already exists!`)
        );
      }

      const existsAddress = user.addresses.find(
        (address) => address._id === req.body._id
      );

      if (existsAddress) {
        Object.assign(existsAddress, req.body);
      } else {
        // Add new address to array
        user.addresses.push(req.body);
      }

      await user.save();

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Delete user address
router.delete(
  '/delete-user-address/:id',
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const userId = req.user._id;
      const addressId = req.params.id;
      await User.updateOne(
        {
          _id: userId,
        },
        { $pull: { addresses: { _id: addressId } } }
      );

      const user = await User.findById(userId);

      res.status(200).json({ success: true, user });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Update user password
router.put(
  '/update-user-password',
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).select('+password');

      const isPasswordMatched = await user.comparePassword(
        req.body.oldPassword
      );

      if (!isPasswordMatched) {
        return next(new ErrorHandler('Current password is incorrect!', 400));
      }

      if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler('New password does not matched!', 400));
      }

      user.password = req.body.newPassword;

      await user.save();

      res.status(200).json({
        success: true,
        message: 'Password updated successfully!',
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Get all user by admin
router.get(
  '/admin-all-users/:userID',
  // isAuthenticated,
  isAdmin,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const users = await User.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        users,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Delete all user by admin
router.delete(
  '/delete-user/:id',
  isAdmin,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return next(
          new ErrorHandler('User is not available with this id', 400)
        );
      }

      const imageId = user.avatar.public_id;

      await cloudinary.v2.uploader.destroy(imageId);

      await User.findByIdAndDelete(req.params.id);

      res.status(201).json({
        success: true,
        message: 'User deleted successfully!',
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Find user information with the userId
router.get(
  '/user-info/:id',
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);
      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
