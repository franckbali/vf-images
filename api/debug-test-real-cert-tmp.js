// DEBUG TEMPORAIRE — teste createCertificate() avec les vraies données de
// la commande EC-AA98978 (18 sept.), sans repasser par Stripe/Creativehub
// (pas de nouveau paiement, pas de commande dupliquée).
// GET /api/debug-test-real-cert-tmp
// À SUPPRIMER après usage.

const { createCertificate } = require('./stripe-webhook');

module.exports = async (req, res) => {
  const session = {
    id: 'cs_manual_verify_' + Date.now(),
    created: Math.floor(Date.now() / 1000),
    metadata: {
      photo_id: 'offrandes-bali-002',
      format_label: '30×40',
      creativehub_variant_id: 'c6efbf7d-cc07-4a81-a0da-d8ce9c3dfb56',
      price_eur: '95',
    },
    collected_information: {
      shipping_details: {
        name: 'Dunos Olivier',
        address: {
          line1: '30 chemin d\'aubagne',
          line2: null,
          city: 'Ceyreste',
          postal_code: '13600',
          country: 'FR',
        },
      },
    },
    customer_details: { email: 'fvinel22@gmail.com' },
  };

  try {
    const code = await createCertificate(session);
    return res.status(200).json({ ok: true, code, url: `/certificat/${code}` });
  } catch (err) {
    return res.status(500).json({ error: err.message, stack: err.stack });
  }
};
