module.exports = async (req, res) => {
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const charges = await stripe.charges.list({ limit: 20, expand: ['data.balance_transaction'] });
    return res.status(200).json(charges.data.map(c => ({
      id: c.id,
      created: new Date(c.created * 1000).toISOString(),
      amount: c.amount,
      paid: c.paid,
      status: c.status,
      refunded: c.refunded,
      amount_refunded: c.amount_refunded,
      fee: c.balance_transaction && c.balance_transaction.fee,
      net: c.balance_transaction && c.balance_transaction.net,
      email: c.billing_details && c.billing_details.email,
      description: c.description,
    })));
  } catch (e) { return res.status(500).json({ error: e.message }); }
};
