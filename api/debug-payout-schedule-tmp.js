// ═══════════════════════════════════════════════════════
//  DEBUG TEMPORAIRE — calendrier de virement Stripe
//  À supprimer après usage
// ═══════════════════════════════════════════════════════

module.exports = async (req, res) => {
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

    const account = await stripe.accounts.retrieve();
    const payouts = await stripe.payouts.list({ limit: 10 });
    const balance = await stripe.balance.retrieve();

    return res.status(200).json({
      payout_schedule: account.settings?.payouts?.schedule,
      balance: {
        available: balance.available,
        pending: balance.pending,
      },
      recent_payouts: payouts.data.map(p => ({
        id: p.id,
        amount: p.amount,
        currency: p.currency,
        status: p.status,
        arrival_date: new Date(p.arrival_date * 1000).toISOString(),
        created: new Date(p.created * 1000).toISOString(),
        automatic: p.automatic,
      })),
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
