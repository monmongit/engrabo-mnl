const express = require('express');
const { isAdmin } = require('../middleware/auth');
const catchAsyncError = require('../middleware/catchAsyncError');
const Category = require('../model/category');
const ErrorHandler = require('../utils/ErrorHandler');
const cloudinary = require('cloudinary');
const router = express.Router();
const Admin = require('../model/admin');

// Create Category
router.post(
  '/create-category',
  catchAsyncError(async (req, res, next) => {
    try {
      const adminId = req.body.adminId;
      const admin = await Admin.findById(adminId);
      if (!admin) {
        return next(new ErrorHandler('Admin Id is invalid', 400));
      } else {
        const { title, image } = req.body;

        const result = await cloudinary.v2.uploader.upload(image, {
          folder: 'categories',
        });

        const category = await Category.create({
          title,
          images: [
            {
              public_id: result.public_id,
              url: result.secure_url,
            },
          ],
          admin: admin._id,
        });

        res.status(201).json({
          success: true,
          category,
        });
      }
    } catch (error) {
      console.error('Create Category Error:', error);
      return next(new ErrorHandler('Failed to create category', 500));
    }
  })
);

// Get All Categories
router.get(
  '/categories',
  catchAsyncError(async (req, res, next) => {
    const categories = await Category.find({});
    res.status(200).json({
      success: true,
      categories,
    });
  })
);

// Update Category
router.put(
  '/update-category/:id',
  isAdmin,
  catchAsyncError(async (req, res, next) => {
    const { title, image } = req.body;
    let image_Url;

    if (image) {
      const result = await cloudinary.v2.uploader.upload(image, {
        folder: 'categories',
      });
      image_Url = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { title, images: image_Url ? [image_Url] : undefined },
      { new: true, runValidators: true }
    );

    if (!category) {
      return next(new ErrorHandler('Category not found', 404));
    }

    res.status(200).json({
      success: true,
      category,
    });
  })
);

// Delete Category
router.delete(
  '/delete-category/:id',
  isAdmin,
  catchAsyncError(async (req, res, next) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return next(new ErrorHandler('Category not found', 404));
    }

    // Optionally delete the image file from Cloudinary
    if (category.images.length) {
      const result = await cloudinary.v2.uploader.destroy(
        category.images[0].public_id
      );
    }

    await Category.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully!',
    });
  })
);

module.exports = router;
