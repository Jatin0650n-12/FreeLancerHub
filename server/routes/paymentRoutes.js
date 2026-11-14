import express from 'express';
import auth from '../middleware/authMiddleware.js';
import { createRazorpayOrder, verifyRazorpayPayment } from '../controllers/razorpayController.js';

const router = express.Router();

router.post('/create-order', auth, createRazorpayOrder);
router.post('/create-payment-intent', auth, createRazorpayOrder);
router.post('/verify', auth, verifyRazorpayPayment);

export default router;

