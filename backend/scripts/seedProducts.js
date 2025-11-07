import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import { getMockProductsForSeed } from '../utils/mockProducts.js';

dotenv.config();

const seedProducts = async () => {
  try {
    // Connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert products with deterministic ObjectIds
    const mockProducts = getMockProductsForSeed();
    const products = await Product.insertMany(mockProducts);
    console.log(`✅ Successfully seeded ${products.length} products!`);

    // Display products
    console.log('\nProducts in database:');
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - $${product.price}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();

