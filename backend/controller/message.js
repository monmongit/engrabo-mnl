const Messages = require('../model/messages');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncError = require('../middleware/catchAsyncError');
const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary');
const Admin = require('../model/admin'); // Import the Admin model

// Create new message
router.post(
  '/create-new-message',
  catchAsyncError(async (req, res, next) => {
    try {
      const messageData = req.body;

      if (req.body.images) {
        const myCloud = await cloudinary.v2.uploader.upload(req.body.images, {
          folder: 'messages',
        });
        messageData.images = {
          public_id: myCloud.public_id,
          url: myCloud.url,
        };
      }

      messageData.conversationId = req.body.conversationId;
      messageData.sender = req.body.sender;
      messageData.text = req.body.text;

      const message = new Messages(messageData);
      await message.save();

      // Fetch the admin ID from the database
      const admin = await Admin.findOne({
        /* your criteria here */
      });

      // Handle automatic response only if the sender is not the admin
      if (req.body.sender !== admin._id.toString()) {
        const autoResponse = handleAutomaticResponse(
          req.body.text,
          req.body.conversationId,
          req.body.sender
        );
        if (autoResponse) {
          const autoMessage = new Messages({
            conversationId: req.body.conversationId,
            sender: admin._id, // Use the fetched admin ID
            text: autoResponse,
          });
          await autoMessage.save();
        }
      }

      res.status(201).json({
        success: true,
        message,
      });
    } catch (error) {
      return next(new ErrorHandler(error.response.message), 400);
    }
  })
);

// Function to handle automatic response
const handleAutomaticResponse = (messageText, conversationId, senderId) => {
  let responseText = '';
  if (messageText.toLowerCase().includes('how to order')) {
    responseText =
      'To place an order, please browse our catalog, add items to your cart, and proceed to checkout.';
  } else if (messageText.toLowerCase().includes('how to refund')) {
    responseText =
      'To request a refund, please visit your order history, select the order, and click on "Request Refund".';
  } // Add more conditions as needed

  return responseText;
};

// Get all messages with conversation id
router.get(
  '/get-all-messages/:id',
  catchAsyncError(async (req, res, next) => {
    try {
      const messages = await Messages.find({
        conversationId: req.params.id,
      });

      res.status(201).json({
        success: true,
        messages,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message), 500);
    }
  })
);

module.exports = router;
