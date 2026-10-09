import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client', 'build')));

// Sample paintings database
const paintings = [
  {
    id: 1,
    title: 'Sunset Over Mountains',
    price: 29999,
    image: '/images/painting1.jpg',
    description: 'Beautiful landscape painting capturing the golden hour',
    artist: 'Hastick'
  },
  {
    id: 2,
    title: 'Urban Dreams',
    price: 39999,
    image: '/images/painting2.jpg',
    description: 'Modern abstract cityscape',
    artist: 'Hastick'
  },
  {
    id: 3,
    title: 'Ocean Wave',
    price: 34999,
    image: '/images/painting3.jpg',
    description: 'Dynamic seascape with vibrant colors',
    artist: 'Hastick'
  }
];

// API Routes

// Get all paintings
app.get('/api/paintings', (req, res) => {
  res.json(paintings);
});

// Get single painting
app.get('/api/paintings/:id', (req, res) => {
  const painting = paintings.find(p => p.id === parseInt(req.params.id));
  if (painting) {
    res.json(painting);
  } else {
    res.status(404).json({ error: 'Painting not found' });
  }
});

// Create payment intent
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, paintingId, paintingTitle } = req.body;

    if (!amount || amount < 100) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      metadata: {
        paintingId: paintingId,
        paintingTitle: paintingTitle
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      amount: paymentIntent.amount
    });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Confirm payment
app.post('/api/confirm-payment', async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      res.json({
        success: true,
        message: 'Payment successful!',
        orderId: paymentIntent.id
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment not completed'
      });
    }
  } catch (error) {
    console.error('Confirmation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'API is running' });
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🎨 Hastick Gallery API running on port ${PORT}`);
});
