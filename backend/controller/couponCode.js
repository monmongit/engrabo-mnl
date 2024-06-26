const express = require('express');
const catchAsyncError = require('../middleware/catchAsyncError');
const ErrorHandler = require('../utils/ErrorHandler');
const { isAdmin } = require('../middleware/auth');
const CouponCode = require('../model/couponCode');
const router = express.Router();

// create coupoun code
router.post(
  '/create-coupon-code',
  isAdmin,
  catchAsyncError(async (req, res, next) => {
    try {
      const isCouponCodeExists = await CouponCode.find({
        name: req.body.name,
      });

      if (isCouponCodeExists.length !== 0) {
        return next(new ErrorHandler('Coupoun code already exists!', 400));
      }

      const couponCode = await CouponCode.create(req.body);

      res.status(201).json({
        success: true,
        couponCode,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

router.post(
  '/apply-coupon',

  catchAsyncError(async (req, res, next) => {
    const { couponCode, cart } = req.body;

    const coupon = await CouponCode.findOne({ name: couponCode });

    if (!coupon) {
      return next(new ErrorHandler('Coupon code does not exist.', 404));
    }

    const today = new Date();
    if (today > coupon.expiresAt) {
      return next(new ErrorHandler('This coupon has expired.', 400));
    }

    if (
      cart.reduce((acc, item) => acc + item.qty * item.price, 0) <
      coupon.minAmount
    ) {
      return next(
        new ErrorHandler(
          `This coupon requires a minimum amount of ${coupon.minAmount}.`,
          400
        )
      );
    }

    const selectedProductNames = coupon.selectedProducts;
    const cartProductNames = cart.map((item) => item.name);

    const isValid = selectedProductNames.every((productName) =>
      cartProductNames.includes(productName)
    );

    if (!isValid) {
      return next(
        new ErrorHandler(
          'This coupon is not applicable to the selected products in your cart.',
          400
        )
      );
    }

    const discountValue =
      (coupon.value / 100) *
      cart.reduce((acc, item) => acc + item.qty * item.price, 0);

    res.status(200).json({
      success: true,
      discountValue,
    });
  })
);

// get all coupons of a shop
router.get(
  '/get-coupon/:id',
  isAdmin,
  catchAsyncError(async (req, res, next) => {
    try {
      const couponCodes = await CouponCode.find({ adminId: req.admin.id });
      res.status(201).json({
        success: true,
        couponCodes,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// delete coupoun code of a shop
router.delete(
  '/delete-coupon/:id',
  isAdmin,
  catchAsyncError(async (req, res, next) => {
    try {
      const couponCode = await CouponCode.findByIdAndDelete(req.params.id);

      if (!couponCode) {
        return next(new ErrorHandler("Coupon code dosen't exists!", 400));
      }
      res.status(201).json({
        success: true,
        message: 'Coupon code deleted successfully!',
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// get coupon code value by its name
router.get(
  '/get-coupon-value/:name',
  catchAsyncError(async (req, res, next) => {
    const couponCode = await CouponCode.findOne({ name: req.params.name });

    if (!couponCode) {
      return next(new ErrorHandler('Coupon code does not exist.', 404));
    }

    res.status(200).json({
      success: true,
      couponCode: couponCode,
    });
  })
);
module.exports = router;
