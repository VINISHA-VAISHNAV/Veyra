const express = require('express');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/admin');

const router = express.Router();

// Apply auth and admin check to all routes in this router
router.use(protect, requireAdmin);

// @route   GET /api/admin/stats
// @desc    Get dashboard summary statistics (Products, Orders, Users, Revenue)
// @access  Admin
router.get('/stats', async (req, res, next) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();

    // Calculate revenue from non-cancelled orders
    const revenueAggregation = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$total' } } },
    ]);

    const revenue = revenueAggregation.length > 0 ? revenueAggregation[0].totalRevenue : 0;

    // Get recent 5 orders for dashboard glance
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email');

    res.json({
      success: true,
      stats: {
        totalProducts,
        totalOrders,
        totalUsers,
        revenue: Math.round(revenue * 100) / 100,
      },
      recentOrders,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/admin/products
// @desc    Get all products for management table
// @access  Admin
router.get('/products', async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/admin/products
// @desc    Create a new product
// @access  Admin
router.post('/products', async (req, res, next) => {
  try {
    const { name, description, price, category, image, stock, featured } = req.body;

    if (!name || !description || price === undefined || !category || !image || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: 'All fields (name, description, price, category, image, stock) are required.',
      });
    }

    const newProduct = await Product.create({
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      category,
      image: image.trim(),
      stock: Number(stock),
      featured: Boolean(featured),
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      product: newProduct,
    });
  } catch (error) {
    next(error);
  }
});

// @route   PATCH /api/admin/products/:id
// @desc    Update product details (price, stock, category, featured, etc.)
// @access  Admin
router.patch('/products/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    const { name, description, price, category, image, stock, featured } = req.body;

    if (name !== undefined) product.name = name.trim();
    if (description !== undefined) product.description = description.trim();
    if (price !== undefined) product.price = Number(price);
    if (category !== undefined) product.category = category;
    if (image !== undefined) product.image = image.trim();
    if (stock !== undefined) product.stock = Number(stock);
    if (featured !== undefined) product.featured = Boolean(featured);

    const updatedProduct = await product.save();

    res.json({
      success: true,
      message: 'Product updated successfully.',
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/admin/products/:id
// @desc    Delete product from catalog
// @access  Admin
router.delete('/products/:id', async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully from VEYRA catalog.',
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/admin/orders
// @desc    Get all orders across all customers
// @access  Admin
router.get('/orders', async (req, res, next) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name email');

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
});

// @route   PATCH /api/admin/orders/:id/status
// @desc    Update order tracking status
// @access  Admin
router.patch('/orders/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['Placed', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}`,
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    // If changing to Cancelled and was previously not cancelled, restore inventory
    if (status === 'Cancelled' && order.status !== 'Cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity },
        });
      }
    }

    order.status = status;
    const updatedOrder = await order.save();

    res.json({
      success: true,
      message: `Order status updated to "${status}".`,
      order: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
