// ═══════════════════════════════════════════════════════
//  DEBUG TEMPORAIRE — vérifier le virement Stripe des 95€
//  À supprimer après usage
// ═══════════════════════════════════════════════════════

const SESSION_ID = 'cs_live_a1p6itEggZK30xRnYRSapxyssww4dimTy2pfMAelL5IpW2KSSDV6GsIuXc';

module.exports = async (req, res) => {
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.retrieve(SESSION_ID, {
      expand: ['payment_intent'],
    });

    const pi = session.payment_intent;
    const chargeId = pi.latest_charge;
    const charge = await stripe.charges.retrieve(chargeId, {
      expand: ['balance_transaction'],
    });
    const bt = charge.balance_transaction;

    // Cherche le payout qui contient cette balance_transaction, si déjà versé
    let matchedPayout = null;
    if (bt.status === 'available' || bt.status === 'pending') {
      const payouts = await stripe.payouts.list({ limit: 20 });
      for (const p of payouts.data) {
        const txs = await stripe.balanceTransactions.list({ payout: p.id, limit: 100 });
        if (txs.data.some(t => t.id === bt.id)) {
          matchedPayout = p;
          break;
        }
      }
    }

    return res.status(200).json({
      session_id: session.id,
      payment_status: session.payment_status,
      charge: {
        id: charge.id,
        paid: charge.paid,
        status: charge.status,
        amount: charge.amount,
        currency: charge.currency,
      },
      balance_transaction: {
        id: bt.id,
        amount: bt.amount,
        fee: bt.fee,
        net: bt.net,
        currency: bt.currency,
        status: bt.status,
        available_on: new Date(bt.available_on * 1000).toISOString(),
        fee_details: bt.fee_details,
      },
      matched_payout: matchedPayout ? {
        id: matchedPayout.id,
        amount: matchedPayout.amount,
        currency: matchedPayout.currency,
        status: matchedPayout.status,
        arrival_date: new Date(matchedPayout.arrival_date * 1000).toISOString(),
      } : 'pas encore inclus dans un virement (fonds sur le solde Stripe)',
    });
  } catch (err) {
    return res.status(500).json({ error: err.message, stack: err.stack });
  }
};
