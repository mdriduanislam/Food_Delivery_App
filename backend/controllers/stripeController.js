const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const Cart = require('../models/Cart');


exports.stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata.orderId;
        const userId = paymentIntent.metadata && paymentIntent.metadata.userId;

        if (!orderId) break;

        await Order.findByIdAndUpdate(orderId, {
          paymentStatus: 'paid',
          orderStatus: 'confirmed',
        });

        // Clear user's cart for CARD payments
        try {
          if (userId) {
            await Cart.findOneAndDelete({ user: userId });
            console.log('Cleared cart for user:', userId);
          } else {
            // fallback: try to clear by order.user
            const ord = await Order.findById(orderId);
            if (ord && ord.user) {
              await Cart.findOneAndDelete({ user: ord.user });
              console.log('Cleared cart for user from order:', ord.user.toString());
            }
          }
        } catch (err) {
          console.error('Error clearing cart after payment:', err.message);
        }

        console.log('Payment succeeded for order:', orderId);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata.orderId;

        if (!orderId) break;

        await Order.findByIdAndUpdate(orderId, {
          paymentStatus: 'failed',
          orderStatus: 'cancelled',
        });

        console.log('Payment failed for order:', orderId);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error.message);
    res.status(500).json({ message: 'Webhook processing error' });
  }
};

