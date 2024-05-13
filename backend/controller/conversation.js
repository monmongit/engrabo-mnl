const Conversation = require('../model/conversation');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncError = require('../middleware/catchAsyncError');
const express = require('express');
const { isAdmin, isAuthenticated } = require('../middleware/auth');
const router = express.Router();

// Create new conversation
router.post(
  '/create-new-conversation',
  catchAsyncError(async (req, res, next) => {
    try {
      const { groupTitle, userId, adminId } = req.body;

      const isConversationExist = await Conversation.findOne({ groupTitle });

      if (isConversationExist) {
        const conversation = isConversationExist;
        res.status(201).json({
          success: true,
          conversation,
        });
      } else {
        const conversation = await Conversation.create({
          members: [userId, adminId],
          groupTitle: groupTitle,
        });

        res.status(201).json({
          success: true,
          conversation,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error.response.meesage), 500);
    }
  })
);

// Get admin conversation
router.get(
  '/get-all-conversation-admin/:id',
  isAdmin,
  catchAsyncError(async (req, res, next) => {
    try {
      const conversations = await Conversation.find({
        members: {
          $in: [req.params.id],
        },
      }).sort({ updatedAt: -1, createdAt: -1 });
      res.status(201).json({
        success: true,
        conversations,
      });
    } catch (error) {
      return next(new ErrorHandler(error), 400);
    }
  })
);

// Get user conversation
router.get(
  '/get-all-conversation-user/:id',
  isAuthenticated,
  catchAsyncError(async (req, res, next) => {
    try {
      const conversations = await Conversation.find({
        members: {
          $in: [req.params.id],
        },
      }).sort({ updatedAt: -1, createdAt: -1 });
      res.status(201).json({
        success: true,
        conversations,
      });
    } catch (error) {
      return next(new ErrorHandler(error), 400);
    }
  })
);

// Update the last message
router.put(
  '/update-last-message/:id',
  catchAsyncError(async (req, res, next) => {
    try {
      const { lastMessage, lastMessageId } = req.body;

      const conversation = await Conversation.findByIdAndUpdate(req.params.id, {
        lastMessage,
        lastMessageId,
      });

      res.status(201).json({
        success: true,
        conversation,
      });
    } catch (error) {
      return next(new ErrorHandler(error), 500);
    }
  })
);

module.exports = router;
