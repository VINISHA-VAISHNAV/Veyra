const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/orders
// @desc    Create a new order with rigorous server-side stock and price verification
// @access  Protected
router.post('/', protect, async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    // 1. Validate Cart Items presence
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty. Please add items before placing an order.',
      });
    }

    // 2. Validate Shipping Address
    if (
      !shippingAddress ||
      !shippingAddress.name ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.pincode
    ) {
      return res.status(400).json({
        success: false,
        message: 'Complete shipping information (name, phone, address, city, pincode) is required.',
      });
    }

    // 3. Server-side validation of products, live stock, and DB prices
    let calculatedTotal = 0;
    const validatedItems = [];
    const productsToUpdate = [];

    for (const item of items) {
      if (!item.product || !item.quantity || item.quantity < 1) {
        return res.status(400).json({
          success: false,
          message: 'Invalid item format or quantity in cart.',
        });
      }

      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${item.product} is no longer available in the VEYRA catalog.`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient inventory for "${product.name}". Available: ${product.stock} units, requested: ${item.quantity} units.`,
        });
      }

      const itemSubtotal = product.price * item.quantity;
      calculatedTotal += itemSubtotal;

      validatedItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image,
      });

      productsToUpdate.push({
        productId: product._id,
        decrementBy: item.quantity,
      });
    }

    // 4. Atomically decrement stock in database
    for (const update of productsToUpdate) {
      await Product.findByIdAndUpdate(update.productId, {
        $inc: { stock: -update.decrementBy },
      });
    }

    // 5. Create Order record
    const finalTotal = Math.round(calculatedTotal * 100) / 100;
    const order = await Order.create({
      user: req.user._id,
      items: validatedItems,
      total: finalTotal,
      shippingAddress: {
        name: shippingAddress.name.trim(),
        phone: shippingAddress.phone.trim(),
        address: shippingAddress.address.trim(),
        city: shippingAddress.city.trim(),
        pincode: shippingAddress.pincode.trim(),
      },
      paymentMethod: paymentMethod === 'Demo Card' ? 'Demo Card' : 'Cash on Delivery',
      status: 'Placed',
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully.',
      order,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/orders/my
// @desc    Retrieve logged-in user's order history
// @access  Protected
router.get('/my', protect, async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name image category');

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
