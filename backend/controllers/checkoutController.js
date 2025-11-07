import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import mongoose from 'mongoose';
import { inMemoryCart } from '../utils/inMemoryCart.js';
import { findMockProductById } from '../utils/mockProducts.js';

// POST /api/checkout - Process checkout
export const checkout = async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      // Use in-memory cart
      const cartItems = Array.from(inMemoryCart.values());
      
      if (cartItems.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Cart is empty'
        });
      }

      // Calculate total
      let total = 0;
      cartItems.forEach(item => {
        const product = typeof item.productId === 'object' ? item.productId : findMockProductById(item.productId);
        total += product.price * item.qty;
      });

      // Clear in-memory cart after checkout
      inMemoryCart.clear();

      const timestamp = new Date().toISOString();

      return res.status(200).json({
        success: true,
        message: 'Checkout successful',
        data: {
          total: total.toFixed(2),
          timestamp: timestamp
        }
      });
    }

    // MongoDB is connected - use database
    const cartItems = await Cart.find().populate('productId');

    if (cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Calculate total
    let total = 0;
    cartItems.forEach(item => {
      total += item.productId.price * item.qty;
    });

    // Clear cart after checkout
    await Cart.deleteMany({});

    const timestamp = new Date().toISOString();

    res.status(200).json({
      success: true,
      message: 'Checkout successful',
      data: {
        total: total.toFixed(2),
        timestamp: timestamp
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing checkout',
      error: error.message
    });
  }
};

