const express = require('express');
const catchAsyncError = require('../middleware/catchAsyncError');
const Admin = require('../model/admin');
const Event = require('../model/event');
const ErrorHandler = require('../utils/ErrorHandler');
const { isAdmin, isAuthenticated } = require('../middleware/auth');
const router = express.Router();
const cloudinary = require('cloudinary');

// Create Event
router.post(
  '/create-event',
  catchAsyncError(async (req, res, next) => {
    try {
      const adminId = req.body.adminId;
      const admin = await Admin.findById(adminId);
      if (!admin) {
        return next(new ErrorHandler('Admin Id is invalid', 400));
      } else {
        let images = [];
        if (typeof req.body.images === 'string') {
          images.push(req.body.images);
        } else {
          images = req.body.images;
        }

        const imagesLinks = [];

        for (let i = 0; i < images.length; i++) {
          const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: 'products',
          });

          imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
          });
        }

        const productData = req.body;
        productData.images = imagesLinks;
        productData.admin = admin;

        const event = await Event.create(productData);

        res.status(201).json({
          success: true,
          event,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// Get all Events
router.get(
  '/get-all-events',
  catchAsyncError(async (req, res, next) => {
    try {
      const events = await Event.find();

      res.status(201).json({
        success: true,
        events,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// Delete Event
router.delete(
  '/delete-admin-event/:id',
  catchAsyncError(async (req, res, next) => {
    try {
      const event = await Event.findById(req.params.id);

      if (!event) {
        return next(new ErrorHandler('Product is not found', 404));
      }

      for (let i = 0; i < event.images.length; i++) {
        const result = await cloudinary.v2.uploader.destroy(
          event.images[i].public_id
        );
      }

      await Event.deleteOne({ _id: req.params.id });

      res.status(201).json({
        success: true,
        message: 'Event Deleted successfully!',
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// Get all events of admin
router.get(
  '/get-all-events/:id',
  catchAsyncError(async (req, res, next) => {
    try {
      const events = await Event.find({ adminId: req.params.id });

      res.status(201).json({
        success: true,
        events,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// Search Events by name or other attributes
router.get(
  '/search-events',
  isAdmin,
  catchAsyncError(async (req, res, next) => {
    try {
      const search = req.query.search;
      const regex = new RegExp(search, 'i');
      const events = await Event.find({
        $or: [{ name: { $regex: regex } }, { location: { $regex: regex } }],
      });

      res.status(200).json({
        success: true,
        events,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

module.exports = router;
