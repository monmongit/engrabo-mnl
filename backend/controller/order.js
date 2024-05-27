const express = require('express');
const router = express.Router();
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncError = require('../middleware/catchAsyncError');
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const Order = require('../model/order');
const Product = require('../model/product');
const Event = require('../model/event');
const Admin = require('../model/admin');
const sendMail = require('../utils/sendMail');
const cloudinary = require('cloudinary');

// Email Template Function
const getEmailTemplate = (content) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <div style="background-color: #f4f4f4; padding: 20px; text-align: center;">
        <h1 style="color: #333;">Your Company Name</h1>
      </div>
      <div style="padding: 20px;">
        ${content}
      </div>
      <div style="background-color: #f4f4f4; padding: 20px; text-align: center;">
        <img src="https://your-image-url.com/footer-image.png" alt="Footer Image" style="width: 100%; max-width: 600px;">
      </div>
    </div>
  `;
};

// create new order
router.post(
  '/create-order',
  catchAsyncError(async (req, res, next) => {
    try {
      const { cart, shippingAddress, user, totalPrice, paymentInfo } = req.body;

      // Group Cart Items by AdminID
      const adminItemsMap = new Map();

      for (const item of cart) {
        const adminId = item.adminId;
        if (!adminItemsMap.has(adminId)) {
          adminItemsMap.set(adminId, []);
        }
        adminItemsMap.get(adminId).push(item);
      }

      // Create an order
      const orders = [];

      for (const [adminId, items] of adminItemsMap) {
        const order = await Order.create({
          cart: items.map((item) => ({
            ...item,
            subTotal: item.qty * item.price,
          })),
          shippingAddress,
          user,
          totalPrice,
          paymentInfo,
        });
        orders.push(order);
      }

      res.status(201).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// Get all orders of the user
router.get(
  '/get-all-orders/:userId',
  catchAsyncError(async (req, res, next) => {
    try {
      const orders = await Order.find({ 'user._id': req.params.userId }).sort({
        createAt: -1,
      });

      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// Get all orders of admin
router.get(
  '/get-admin-all-orders/:adminId',
  catchAsyncError(async (req, res, next) => {
    try {
      const orders = await Order.find({
        'cart.adminId': req.params.adminId,
      }).sort({
        createAt: -1,
      });

      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// Update order status for Admin
router.put(
  '/update-order-status/:id',
  isAdmin,
  catchAsyncError(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id).populate('user');

      if (!order) {
        return next(new ErrorHandler('Order not found', 400));
      }

      const newStatus = req.body.status;

      // Update the stock when transferring to delivery partner
      if (newStatus === 'Transferred to delivery partner') {
        for (let item of order.cart) {
          await updateItemStock(item._id, item.qty);
        }
      }

      // Update order details
      order.status = newStatus;
      if (newStatus === 'Delivered') {
        order.deliveredAt = Date.now();
        order.paymentInfo.status = 'Paid';
      }

      await order.save({ validateBeforeSave: false });

      const message = `Dear ${order.user.name}, your order status has been updated to ${newStatus}. Thank you for shopping with us!`;
      const html = getEmailTemplate(message);
      await sendMail({
        email: order.user.email,
        subject: 'Order Status Update',
        message,
        html,
      });

      res.status(200).json({
        success: true,
        order,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

async function updateItemStock(id, qty) {
  // Try to update a product
  let item = await Product.findById(id);

  // If not a product, it might be an event
  if (!item) {
    item = await Event.findById(id);
  }

  if (!item) {
    console.log('Item not found with ID:', id);
    return; // If neither, skip the update
  }

  // Update stock and sold_out values
  item.stock -= qty;
  item.sold_out += qty;

  await item.save({ validateBeforeSave: false });

  // Check if stock is low and send an email to the admin
  if (item.stock <= 5) {
    const admin = await Admin.findOne(); // Assuming there's a single admin, modify if multiple admins
    if (admin) {
      const lowStockMessage = `The stock for product "${item.name}" is low. Current stock: ${item.stock}`;
      const lowStockHtml = getEmailTemplate(lowStockMessage);
      await sendMail({
        email: admin.email,
        subject: 'Low Stock Alert',
        message: lowStockMessage,
        html: lowStockHtml,
      });
    }
  }
}
// Refund an order of user
router.put(
  '/order-refund/:id',
  catchAsyncError(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler('Order not found', 400));
      }

      order.status = req.body.status;

      await order.save({ validateBeforeSave: false });

      res.status(200).json({
        success: true,
        order,
        message: 'Order Refund Request Successfully!',
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// Refund an order of user
router.put(
  '/order-refund/:id',
  catchAsyncError(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler('Order not found', 400));
      }

      order.status = req.body.status;

      await order.save({ validateBeforeSave: false });

      res.status(200).json({
        success: true,
        order,
        message: 'Order Refund Request Successfully!',
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// Refund a order of user
router.put(
  '/update-order-status/:id',
  isAdmin,
  catchAsyncError(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id).populate('user');

      if (!order) {
        return next(new ErrorHandler('Order not found', 400));
      }

      const newStatus = req.body.status;

      // Update the stock when transferring to delivery partner
      if (newStatus === 'Transferred to delivery partner') {
        for (let item of order.cart) {
          await updateItemStock(item._id, item.qty);
        }
      }

      // Update order details
      order.status = newStatus;
      if (newStatus === 'Delivered') {
        order.deliveredAt = Date.now();
        order.paymentInfo.status = 'Paid';
      }

      await order.save({ validateBeforeSave: false });

      const message = `Dear ${order.user.name}, your order status has been updated to ${newStatus}. Thank you for shopping with us!`;
      await sendMail({
        email: order.user.email,
        subject: 'Order Status Update',
        message,
      });

      res.status(200).json({
        success: true,
        order,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

async function updateItemStock(id, qty) {
  // Try to update a product
  let item = await Product.findById(id);

  // If not a product, it might be an event
  if (!item) {
    item = await Event.findById(id);
  }

  if (!item) {
    console.log('Item not found with ID:', id);
    return; // If neither, skip the update
  }

  // Update stock and sold_out values
  item.stock -= qty;
  item.sold_out += qty;

  await item.save({ validateBeforeSave: false });

  // Check if stock is low and send an email to the admin
  if (item.stock <= 5) {
    const admin = await Admin.findOne(); // Assuming there's a single admin, modify if multiple admins
    if (admin) {
      const message = `The stock for product "${item.name}" is low. Current stock: ${item.stock}`;
      await sendMail({
        email: admin.email,
        subject: 'Low Stock Alert',
        message,
      });
    }
  }
}
// Refund for admin side
router.put(
  '/order-refund-success/:id',
  isAdmin,
  catchAsyncError(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler('Order not found!'));
      }

      order.status = req.body.status;

      await order.save();

      res.status(200).json({
        success: true,
        message: 'Order Refund Successfully!',
      });

      if (req.body.status === 'Refund Approved') {
        order.cart.forEach(async (o) => {
          await updateOrder(o._id, o.qty);
        });
      }

      async function updateOrder(id, qty) {
        const product = await Product.findById(id);
        product.stock += qty;
        product.sold_out -= qty;

        await product.save({ validateBeforeSave: false });
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

router.post(
  '/custom',
  catchAsyncError(async (req, res, next) => {
    // get the url
    console.log(req.body);
    // get upload the url to the cloudinary
    // send back the url as a string? or json
  })
);

module.exports = router;
