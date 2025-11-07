import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error('Please make sure MongoDB is running on localhost:27017');
    console.error('The server will continue but database operations will fail.');
    // Don't exit - let the server start even if DB is not available
    // This allows the frontend to at least see the server is running
  }
};

export default connectDB;

