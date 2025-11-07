import Product from '../models/Product.js';
import mongoose from 'mongoose';
import { getMockProductsForResponse, getMockProductsForSeed } from '../utils/mockProducts.js';

// Helper to normalize Mongoose documents for JSON responses
const normalizeProducts = (products) =>
  products.map((product) => {
    const plain = product.toObject ? product.toObject() : { ...product };
    return {
      ...plain,
      _id: plain._id.toString()
    };
  });

// GET /api/products - Return 5-10 mock products
export const getProducts = async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      // MongoDB not connected, return mock data
      console.log('MongoDB not connected, returning mock products');
      return res.status(200).json({
        success: true,
        count: getMockProductsForResponse().length,
        data: getMockProductsForResponse()
      });
    }

    // Check if products exist in database, if not, seed them
    let products = await Product.find();
    
    if (products.length === 0) {
      // Seed mock products (with deterministic ObjectIds)
      const productsToInsert = getMockProductsForSeed();
      products = await Product.insertMany(productsToInsert);
      console.log(`✅ Seeded ${products.length} products into database`);
    }
    
    const normalizedProducts = normalizeProducts(products);

    res.status(200).json({
      success: true,
      count: normalizedProducts.length,
      data: normalizedProducts
    });
  } catch (error) {
    // If database error, return mock data as fallback
    console.error('Database error, returning mock products:', error.message);
    const fallback = getMockProductsForResponse();
    res.status(200).json({
      success: true,
      count: fallback.length,
      data: fallback
    });
  }
};

