// Shared in-memory cart storage for when MongoDB is not available
export const inMemoryCart = new Map();
export let cartIdCounter = 1;

export const getNextCartId = () => {
  return `mem_${cartIdCounter++}`;
};

