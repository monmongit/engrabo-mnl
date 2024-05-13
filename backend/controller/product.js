const express = require('express');
const { isAdmin, isAuthenticated } = require('../middleware/auth');
const router = express.Router();
const catchAsyncError = require('../middleware/catchAsyncError');
const Product = require('../model/product');
const Admin = require('../model/admin');
const Event = require('../model/event');
const Order = require('../model/order');
const cloudinary = require('cloudinary');
const ErrorHandler = require('../utils/ErrorHandler');

// Create Product
router.post(
  '/create-product',
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

        const product = await Product.create(productData);

        res.status(201).json({
          success: true,
          product,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// Get all Products
router.get(
  '/get-all-products-admin/:id',
  catchAsyncError(async (req, res, next) => {
    try {
      const products = await Product.find({ adminId: req.params.id });

      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// Delete Product by admin
router.delete(
  '/delete-admin-product/:id',
  isAdmin,
  catchAsyncError(async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return next(new ErrorHandler('Product is not found!', 404));
      }

      for (let i = 0; i < product.images.length; i++) {
        const result = await cloudinary.v2.uploader.destroy(
          product.images[i].public_id
        );
      }

      await Product.deleteOne({ _id: req.params.id });

      res.status(201).json({
        success: true,
        message: 'Product deleted successfully!',
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// Get all Products for all users
router.get(
  '/get-all-products',
  catchAsyncError(async (req, res, next) => {
    try {
      const products = await Product.find().sort({ createAt: -1 });

      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// Search products by name or other attributes
router.get(
  '/search-products',
  isAdmin,
  catchAsyncError(async (req, res, next) => {
    try {
      const search = req.query.search;
      const regex = new RegExp(search, 'i'); // 'i' makes it case insensitive
      const products = await Product.find({
        $or: [
          { name: { $regex: regex } },
          { category: { $regex: regex } },
          // Add more fields if needed
        ],
      });

      res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// Review for a product
router.put(
  '/create-new-review',
  isAuthenticated,
  catchAsyncError(async (req, res, next) => {
    try {
      const { user, rating, comment, productId, orderId } = req.body;

      if (!user || !rating || !productId || !orderId) {
        return next(new ErrorHandler('Missing required fields', 400));
      }

      // Attempt to find the item in Products
      let item = await Product.findById(productId);

      // If not found in Products, attempt to find it in Events
      if (!item) {
        item = await Event.findById(productId);
        if (!item) {
          return next(new ErrorHandler('Item not found', 404));
        }
      }

      const review = {
        user,
        rating,
        comment,
        productId,
      };

      // Check if the user has already reviewed this item
      const isReviewed = item.reviews.find(
        (rev) => rev.user._id === req.user._id
      );

      if (isReviewed) {
        item.reviews.forEach((rev) => {
          if (rev.user._id === req.user._id) {
            rev.rating = rating;
            rev.comment = comment;
            rev.user = user;
          }
        });
      } else {
        item.reviews.push(review);
      }

      // Calculate the new average rating
      let avg = 0;
      item.reviews.forEach((rev) => {
        avg += rev.rating;
      });
      item.ratings = avg / item.reviews.length;

      await item.save({ validateBeforeSave: false });

      // Update the order to mark the item as reviewed
      await Order.findByIdAndUpdate(
        orderId,
        { $set: { 'cart.$[elem].isReviewed': true } },
        { arrayFilters: [{ 'elem._id': productId }], new: true }
      );

      res.status(200).json({
        success: true,
        message: 'Reviewed successfully!',
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

module.exports = router;
