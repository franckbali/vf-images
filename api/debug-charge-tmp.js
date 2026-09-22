// ═══════════════════════════════════════════════════════
//  DEBUG TEMPORAIRE — investigation charge Creativehub 43€
//  À supprimer après usage
// ═══════════════════════════════════════════════════════

module.exports = async (req, res) => {
  try {
    const chKey = process.env.CREATIVEHUB_API_KEY;
    const stripeKey = process.env.STRIPE_SECRET_KEY;

    // 1. Dernières factures Creativehub (les "rollups" qui chargent la carte)
    const invoicesRes = await fetch('https://escher-v2.creativehub.io/v1/invoices?limit=5', {
      headers: { 'Authorization': `Bearer ${chKey}` },
    });
    const invoices = await invoicesRes.json();

    // 2. Dernières commandes Creativehub
    const ordersRes = await fetch('https://escher-v2.creativehub.io/v1/orders?limit=10', {
      headers: { 'Authorization': `Bearer ${chKey}` },
    });
    const orders = await ordersRes.json();

    // 3. Dernières sessions Stripe Checkout complétées
    const stripe = require('stripe')(stripeKey);
    const sessions = await stripe.checkout.sessions.list({ limit: 10 });

    return res.status(200).json({
      invoices,
      orders,
      stripe_sessions: sessions.data.map(s => ({
        id: s.id,
        status: s.status,
        payment_status: s.payment_status,
        amount_total: s.amount_total,
        currency: s.currency,
        created: new Date(s.created * 1000).toISOString(),
        customer_email: s.customer_details?.email,
        metadata: s.metadata,
      })),
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
