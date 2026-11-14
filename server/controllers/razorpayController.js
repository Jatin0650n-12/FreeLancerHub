import Razorpay from 'razorpay';
import crypto from 'crypto';
import Invoice from '../models/Invoice.js';
import Project from '../models/Project.js';
import Notification from '../models/Notification.js';
import { getIO } from '../socket.js';

const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_API_KEY;
  const key_secret = process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_API_SECRET;

  if (!key_id || !key_secret) {
    throw new Error('Razorpay API keys are not configured in environment variables.');
  }

  return new Razorpay({ key_id, key_secret });
};

export const createRazorpayOrder = async (req, res) => {
  try {
    const { invoiceId } = req.body;
    const userId = req.user._id;

    if (!invoiceId) {
      return res.status(400).json({ error: 'Invoice ID is required.' });
    }

    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found.' });
    }
    if (invoice.status === 'paid') {
      return res.status(400).json({ error: 'This invoice has already been paid.' });
    }
    if (!invoice.client.equals(userId)) {
      return res.status(403).json({ error: 'Forbidden: You are not the client for this invoice.' });
    }

    const razorpay = getRazorpayInstance();

    // Razorpay accepts amount in paise (1 INR = 100 paise)
    const options = {
      amount: Math.round(Number(invoice.amount) * 100),
      currency: 'INR',
      receipt: `inv_${invoice._id.toString().slice(-10)}`,
      notes: {
        invoiceId: invoice._id.toString(),
        projectId: invoice.project.toString(),
      },
    };

    const order = await razorpay.orders.create(options);

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_API_KEY,
    });
  } catch (err) {
    console.error('Razorpay create order error:', err);
    res.status(500).json({ error: err.message || 'Failed to create Razorpay order.' });
  }
};

export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, invoiceId } = req.body;
    const key_secret = process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_API_SECRET;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !invoiceId) {
      return res.status(400).json({ error: 'Missing required payment verification details.' });
    }

    // Verify HMAC SHA256 signature
    const generatedSignature = crypto
      .createHmac('sha256', key_secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Payment verification failed: Invalid signature.' });
    }

    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found.' });
    }

    if (invoice.status !== 'paid') {
      invoice.status = 'paid';
      await invoice.save();

      const project = await Project.findByIdAndUpdate(
        invoice.project,
        { status: 'completed' },
        { new: true }
      );

      const notification = new Notification({
        recipient: invoice.freelancer,
        sender: invoice.client,
        type: 'invoice_paid',
        link: `/project/${invoice.project}`,
      });
      await notification.save();

      try {
        const io = getIO();
        io.to(invoice.freelancer.toString()).emit('newNotification', {
          message: `Your invoice for "${project?.title || 'the project'}" has been paid!`,
        });
      } catch (socketErr) {
        console.warn('Socket notification error (non-fatal):', socketErr.message);
      }
    }

    res.json({
      success: true,
      message: 'Payment verified and invoice updated successfully.',
    });
  } catch (err) {
    console.error('Razorpay verification error:', err);
    res.status(500).json({ error: err.message || 'Failed to verify payment.' });
  }
};

