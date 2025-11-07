import express from 'express';
import { addToCart, removeFromCart, getCart } from '../controllers/cartController.js';

const router = express.Router();

router.post('/', addToCart);
router.delete('/:id', removeFromCart);
router.get('/', getCart);

export default router;

