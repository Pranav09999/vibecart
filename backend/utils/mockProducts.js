import mongoose from 'mongoose';

const baseProducts = [
  {
    hexId: '000000000000000000000001',
    name: 'Wireless Headphones',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    description: 'High-quality wireless headphones with noise cancellation'
  },
  {
    hexId: '000000000000000000000002',
    name: 'Smart Watch',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    description: 'Feature-rich smartwatch with fitness tracking'
  },
  {
    hexId: '000000000000000000000003',
    name: 'Laptop Stand',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
    description: 'Ergonomic aluminum laptop stand for better posture'
  },
  {
    hexId: '000000000000000000000004',
    name: 'Mechanical Keyboard',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
    description: 'RGB mechanical keyboard with cherry MX switches'
  },
  {
    hexId: '000000000000000000000005',
    name: 'USB-C Hub',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=500',
    description: 'Multi-port USB-C hub with HDMI and SD card reader'
  },
  {
    hexId: '000000000000000000000006',
    name: 'Wireless Mouse',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500',
    description: 'Ergonomic wireless mouse with long battery life'
  },
  {
    hexId: '000000000000000000000007',
    name: 'Monitor Stand',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
    description: 'Adjustable monitor stand with storage space'
  },
  {
    hexId: '000000000000000000000008',
    name: 'Webcam HD',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1587825147138-3462375467d1?w=500',
    description: '1080p HD webcam with built-in microphone'
  }
];

const cloneProduct = (product) => ({
  _id: product.hexId,
  name: product.name,
  price: product.price,
  image: product.image,
  description: product.description
});

export const getMockProductsForResponse = () => baseProducts.map(cloneProduct);

export const getMockProductsForSeed = () =>
  baseProducts.map((product) => ({
    _id: new mongoose.Types.ObjectId(product.hexId),
    name: product.name,
    price: product.price,
    image: product.image,
    description: product.description
  }));

export const findMockProductById = (id) => {
  const product = baseProducts.find((item) => item.hexId === id);
  return product ? cloneProduct(product) : null;
};
