const express = require('express');
const User = require('../model/user');
const Product = require('../model/product');
const Admin = require('../model/admin');
const router = express.Router();
const cloudinary = require('cloudinary');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncError');
const jwt = require('jsonwebtoken');
const sendMail = require('../utils/sendMail');
const resetMail = require('../utils/resetMail');
const { upload } = require('../multer');

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

    const activationUrl = `https://engrabo-mnl-frnt.vercel.app/activation/${activationToken}`;

    try {
      await resetMail({
        name: user.name,
        email: user.email,
        subject: 'Activate your account',
        url: activationUrl,
        // message: `Hello ${user.name}, please click on the link to activate your account: ${activationUrl}`,
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

const findUserOrAdmin = async (email) => {
  let user = await User.findOne({ email }).select('name').lean();
  let userType = 'User';

  if (!user) {
    user = await Admin.findOne({ email }).select('name').lean();
    let userType = 'Admin';
  }
  return { user, userType };
};

// Forgot Password
router.post('/forgot-pass', async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(new ErrorHandler('Please provide the field', 400));
    }

    const { user, userType } = await findUserOrAdmin(email);

    if (!user) {
      return next(new ErrorHandler("User doesn't exist", 400));
    }

    const userFirstName = user.name.split(' ')[0];

    const userPayload = { email: email };
    const activationToken = createActivationToken(userPayload);
    const activationUrl = `https://engrabo-mnl-frnt.vercel.app/reset/${activationToken}`;

    try {
      await resetMail({
        name: userFirstName,
        email: email,
        subject: 'Reset your account password',
        url: activationUrl,
      });
      res.status(201).json({
        success: true,
        message: `Please check your email:- ${user.email} to reset your account!`,
        userType: userType,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

//Verify token
router.post(
  '/reset',
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { reset_token } = req.body;

      const verifyToken = jwt.verify(
        reset_token,
        process.env.ACTIVATION_SECRET
      );
      if (!verifyToken) {
        return next(new ErrorHandler('Invalid Token', 400));
      }

      const { email } = verifyToken;

      let foundUser = await User.findOne({ email });

      if (!foundUser) {
        foundUser = await Admin.findOne({ email });

        if (!foundUser) {
          return next(new ErrorHandler("User doesn't exist", 400));
        }
      }

      sendToken(foundUser, 201, res); // Assuming this function handles token creation and response
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
//Update password (reset)
router.post(
  '/reset-password',
  catchAsyncErrors(async (req, res, next) => {
    const { newPassword, confirmPassword, reset_token } = req.body;

    const verifyToken = jwt.verify(reset_token, process.env.ACTIVATION_SECRET);
    if (!verifyToken) {
      return next(new ErrorHandler('Invalid Token', 400));
    }

    if (!newPassword || !confirmPassword) {
      return next(new ErrorHandler('Please provide all the fields', 400));
    }

    if (newPassword !== confirmPassword) {
      return next(new ErrorHandler('New password does not matched!', 400));
    }

    try {
      const { email } = verifyToken;
      const { userType } = await findUserOrAdmin(email);

      let user = await User.findOne({ email });
      // let userType = "User";

      if (!user) {
        user = await Admin.findOne({ email });
        // userType = "Admin";
      }

      if (user) {
        user.password = newPassword;
        await user.save();
        return res.status(200).json({
          success: true,
          message: 'Password was updated successfully!',
          userType: userType,
        });
      } else {
        return next(new ErrorHandler("Email doesn't exist", 400));
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

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
  isAdmin,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const users = await User.find().populate('wishlist').sort({
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

// Delete user by admin
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

// Add to Wishlist
router.post(
  '/add-to-wishlist',
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).populate('wishlist');
    const { productId } = req.body;

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const alreadyInWishlist = user.wishlist.find(
      (item) => item._id.toString() === productId
    );

    if (alreadyInWishlist) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    user.wishlist.push(productId);
    await user.save();

    const populatedUser = await User.findById(req.user.id).populate('wishlist');

    res.status(200).json({
      success: true,
      wishlist: populatedUser.wishlist,
    });
  })
);

// Remove from Wishlist
router.post(
  '/remove-from-wishlist',
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).populate('wishlist');
    const { productId } = req.body;

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.wishlist = user.wishlist.filter(
      (item) => item._id.toString() !== productId
    );
    await user.save();

    const populatedUser = await User.findById(req.user.id).populate('wishlist');

    res.status(200).json({
      success: true,
      wishlist: populatedUser.wishlist,
    });
  })
);

// Get User Wishlist
router.get(
  '/user/:userId/wishlist',
  catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.userId).populate('wishlist');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      success: true,
      wishlist: user.wishlist,
    });
  })
);

module.exports = router;
