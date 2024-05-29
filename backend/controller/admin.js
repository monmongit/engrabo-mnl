const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const resetMail = require("../utils/resetMail");
const Admin = require("../model/admin");
const { isAdmin } = require("../middleware/auth");
const cloudinary = require("cloudinary");
const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/ErrorHandler");
const sendAdminToken = require("../utils/adminToken");

router.post(
  "/create-admin",
  catchAsyncError(async (req, res, next) => {
    try {
      const { email } = req.body;
      const adminEmail = await Admin.findOne({ email });
      if (adminEmail) {
        return next(new ErrorHandler("User already exist!", 400));
      }

      const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
      });

      const admin = {
        name: req.body.name,
        email: email,
        password: req.body.password,
        avatar: {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        },
        address: req.body.address,
        phoneNumber: req.body.phoneNumber,
        zipCode: req.body.zipCode,
      };

      const activationToken = createActivationToken(admin);

      const activationUrl = `http://localhost:3000/admin/activation/${activationToken}`;

      try {
        await resetMail({
          name: admin.name,
          email: admin.email,
          subject: "Activate your admin account",
          url: activationUrl,
        });
        res.status(201).json({
          success: true,
          message: `please check your email:- ${admin.email} to activate your admin account!`,
        });
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// Create activation token
const createActivationToken = (admin) => {
  return jwt.sign(admin, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

// Activate admin
router.post(
  "/activation",
  catchAsyncError(async (req, res, next) => {
    try {
      const { activation_token } = req.body;

      const newAdmin = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET
      );

      if (!newAdmin) {
        return next(new ErrorHandler("Invalid Token", 400));
      }

      const { name, email, password, avatar, zipCode, address, phoneNumber } =
        newAdmin;

      // Check if user already exists
      let admin = await Admin.findOne({ email });
      if (admin) {
        return next(new ErrorHandler("User already exists", 400));
      }
      // Now, create the user with the verified information
      admin = await Admin.create({
        name,
        email,
        avatar,
        password: password, // Ensure the password is hashed before saving
        zipCode,
        address,
        phoneNumber,
      });

      sendAdminToken(admin, 201, res); // Assuming this function handles token creation and response
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Login admin
router.post(
  "/login-admin",
  catchAsyncError(async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new ErrorHandler("Please provide all the fields", 400));
      }

      const user = await Admin.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("User doesn't exists!", 400));
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Please enter your credentials correctly!", 400)
        );
      }

      sendAdminToken(user, 201, res); // Assuming this function handles token creation and response
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Load admin
router.get(
  "/getAdmin",
  isAdmin,
  catchAsyncError(async (req, res, next) => {
    try {
      const admin = await Admin.findById(req.admin._id);

      if (!admin) {
        return next(new ErrorHandler("User doesn't exists", 400));
      }

      res.status(200).json({
        success: true,
        admin,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Logout Admin
router.get(
  "/logout",
  catchAsyncError(async (req, res, next) => {
    try {
      res.cookie("admin_token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });

      res.status(201).json({
        success: true,
        message: "Your admin account is successfully logout!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Get admin info
router.get(
  "/get-admin-info/:id",
  catchAsyncError(async (req, res, next) => {
    try {
      const admin = await Admin.findById(req.params.id);
      res.status(201).json({
        success: true,
        admin,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Update admin profile picture
router.put(
  "/update-admin-avatar",
  isAdmin,
  catchAsyncError(async (req, res, next) => {
    try {
      let existsAdmin = await Admin.findById(req.admin._id);

      const imageId = existsAdmin.avatar.public_id;

      await cloudinary.v2.uploader.destroy(imageId);

      const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
      });

      existsAdmin.avatar = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };

      await existsAdmin.save();

      res.status(200).json({
        success: true,
        admin: existsAdmin,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Update admin info
router.put(
  "/update-admin-info",
  isAdmin,
  catchAsyncError(async (req, res, next) => {
    try {
      const { name, description, address, phoneNumber, zipCode } = req.body;

      const admin = await Admin.findOne(req.admin._id);

      if (!admin) {
        return next(new ErrorHandler("Admin not found", 400));
      }

      admin.name = name;
      admin.description = description;
      admin.address = address;
      admin.phoneNumber = phoneNumber;
      admin.zipCode = zipCode;

      await admin.save();

      res.status(201).json({
        success: true,
        admin,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Update admin password
router.put(
  "/update-admin-password",
  isAdmin,
  catchAsyncError(async (req, res, next) => {
    try {
      const admin = await Admin.findById(req.admin._id).select("+password");

      if (!(await admin.comparePassword(req.body.oldPassword))) {
        return next(new ErrorHandler("Current password is incorrect!", 400));
      }

      admin.password = req.body.newPassword;
      await admin.save();

      res.status(200).json({
        success: true,
        message: "Password updated successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
module.exports = router;
