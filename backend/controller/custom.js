const express = require('express');
const catchAsyncError = require('../middleware/catchAsyncError');
const router = express.Router();
const cloudinary = require('cloudinary');


router.post(
    '/create-custom',
    catchAsyncError(async (req, res, next) => {
      try {
        // Access 'canvasDataURL' from 'req.body' which is the same key sent from the client-side
        const uploadedImage = await cloudinary.uploader.upload(
          req.body.canvasDataURL, // Changed to access 'canvasDataURL' instead of a non-matching key
          {
            folder: 'designs',
          }
        );
        res.json({ secureURL: uploadedImage.secure_url });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to upload image to Cloudinary' });
      }
    })
  );

router.get("/get-customs")
  

module.exports = router;