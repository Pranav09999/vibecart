import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import mongoose from 'mongoose';
import { inMemoryCart, getNextCartId } from '../utils/inMemoryCart.js';
import { getMockProductsForResponse, findMockProductById } from '../utils/mockProducts.js';

// POST /api/cart - Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, qty } = req.body;

    if (!productId || !qty) {
      return res.status(400).json({
        success: false,
        message: 'Please provide productId and qty'
      });
    }

    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      console.log('[Cart] MongoDB not connected – using in-memory cart');
      // Use in-memory storage
      const product = findMockProductById(productId);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      // Check if item already exists in in-memory cart
      let existingItem = null;
      for (const [id, item] of inMemoryCart.entries()) {
        const itemProductId = typeof item.productId === 'object' ? item.productId._id : item.productId;
        if (itemProductId === productId) {
          existingItem = { id, item };
          break;
        }
      }

      if (existingItem) {
        // Update quantity
        existingItem.item.qty = qty;
        inMemoryCart.set(existingItem.id, existingItem.item);
        
        return res.status(200).json({
          success: true,
          message: 'Cart item updated',
          data: {
            _id: existingItem.id,
            productId: product,
            qty: qty
          }
        });
      }

      // Create new cart item
      const newId = getNextCartId();
      const cartItem = {
        _id: newId,
        productId: product,
        qty: qty
      };
      inMemoryCart.set(newId, cartItem);

      return res.status(201).json({
        success: true,
        message: 'Item added to cart',
        data: cartItem
      });
    }

    // MongoDB is connected - use database
    console.log('[Cart] MongoDB connected – using persistent cart');
    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if item already exists in cart
    const existingCartItem = await Cart.findOne({ productId });
    
    if (existingCartItem) {
      // Update quantity
      existingCartItem.qty = qty;
      await existingCartItem.save();
      
      return res.status(200).json({
        success: true,
        message: 'Cart item updated',
        data: existingCartItem
      });
    }

    // Create new cart item
    const cartItem = await Cart.create({ productId, qty });

    res.status(201).json({
      success: true,
      message: 'Item added to cart',
      data: cartItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding item to cart',
      error: error.message
    });
  }
};

// DELETE /api/cart/:id - Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      // Use in-memory storage
      if (inMemoryCart.has(id)) {
        const cartItem = inMemoryCart.get(id);
        inMemoryCart.delete(id);
        return res.status(200).json({
          success: true,
          message: 'Item removed from cart',
          data: cartItem
        });
      } else {
        return res.status(404).json({
          success: false,
          message: 'Cart item not found'
        });
      }
    }

    // MongoDB is connected - use database
    const cartItem = await Cart.findByIdAndDelete(id);

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      data: cartItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing item from cart',
      error: error.message
    });
  }
};

// GET /api/cart - Get all cart items with total
export const getCart = async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      console.log('[Cart] MongoDB not connected – reading in-memory cart');
      // Use in-memory storage
      const cartItems = Array.from(inMemoryCart.values());
      
      // Calculate total
      let total = 0;
      const itemsWithSubtotal = cartItems.map(item => {
        const product = typeof item.productId === 'object' ? item.productId : findMockProductById(item.productId);
        if (!product) {
          return null;
        }
        const subtotal = product.price * item.qty;
        total += subtotal;
        return {
          _id: item._id,
          productId: product,
          qty: item.qty,
          subtotal: subtotal
        };
      }).filter(Boolean);

      return res.status(200).json({
        success: true,
        count: itemsWithSubtotal.length,
        data: itemsWithSubtotal,
        total: total.toFixed(2)
      });
    }

    // MongoDB is connected - use database
    console.log('[Cart] MongoDB connected – reading persistent cart');
    const cartItems = await Cart.find().populate('productId');

    const validCartItems = [];
    const orphanedCartIds = [];
    for (const item of cartItems) {
      if (!item.productId) {
        orphanedCartIds.push(item._id);
        continue;
      }
      validCartItems.push(item);
    }

    if (orphanedCartIds.length > 0) {
      await Cart.deleteMany({ _id: { $in: orphanedCartIds } });
      console.warn(`[Cart] Removed ${orphanedCartIds.length} orphaned cart items without a matching product.`);
    }

    // Calculate total
    let total = 0;
    const itemsWithSubtotal = validCartItems.map(item => {
      const product = item.productId.toObject();
      product._id = product._id.toString();
      const subtotal = product.price * item.qty;
      total += subtotal;
      return {
        _id: item._id,
        productId: product,
        qty: item.qty,
        subtotal: subtotal
      };
    });

    res.status(200).json({
      success: true,
      count: itemsWithSubtotal.length,
      data: itemsWithSubtotal,
      total: total.toFixed(2)
    });
  } catch (error) {
    // Return empty cart on error
    res.status(200).json({
      success: true,
      count: 0,
      data: [],
      total: '0.00'
    });
  }
};

