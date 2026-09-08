// ═══════════════════════════════════════════════════════
//  VF Images — Création session Stripe Checkout
//  POST /api/create-checkout
//  Body : { photo_id: "portrait-bali-012", format_label: "45×30" }
// ═══════════════════════════════════════════════════════

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const catalogue = require('../catalogue.json');

// Lit le body JSON depuis le stream de la requête
function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => (body += chunk.toString()));
    req.on('end', () => {
      try { resolve(JSON.parse(body)); }
      catch (e) { reject(new Error('Body JSON invalide')); }
    });
    req.on('error', reject);
  });
}

module.exports = async (req, res) => {
  // CORS — même domaine, mais on autorise aussi les previews Vercel
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

  let body;
  try {
    body = await readBody(req);
  } catch (e) {
    return res.status(400).json({ error: 'Body invalide' });
  }

  const { photo_id, format_label } = body;

  // Trouver la photo dans le catalogue
  const photo = catalogue.photos.find(p => p.id === photo_id);
  if (!photo) return res.status(404).json({ error: `Photo "${photo_id}" introuvable` });

  // Trouver le format
  const format = photo.formats.find(f => f.label === format_label);
  if (!format) return res.status(404).json({ error: `Format "${format_label}" introuvable` });

  const siteUrl = process.env.SITE_URL || 'https://www.vfimages.com';

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `${photo.title_fr} — ${format_label} cm`,
              description: `Tirage Fine Art Hahnemühle · ${format_label} cm · Livraison offerte en Europe`,
              images: [`${siteUrl}/${photo.image}`],
            },
            unit_amount: format.price_eur * 100, // Stripe travaille en centimes
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      // Collecte l'adresse de livraison directement dans Stripe
      shipping_address_collection: {
        allowed_countries: [
          'FR', 'BE', 'CH', 'LU', 'DE', 'NL', 'IT', 'ES', 'PT',
          'AT', 'GB', 'IE', 'SE', 'NO', 'DK', 'FI', 'PL', 'CZ',
          'HU', 'RO', 'GR', 'HR', 'SK', 'SI', 'BG', 'EE', 'LV', 'LT'
        ],
      },
      // Infos passées au webhook pour créer la commande Creativehub
      metadata: {
        photo_id: photo.id,
        format_label: format_label,
        creativehub_variant_id: format.creativehub_variant_id,
        price_eur: String(format.price_eur),
      },
      success_url: `${siteUrl}/boutique.html?status=success`,
      cancel_url:  `${siteUrl}/boutique.html?status=cancelled`,
    });

    return res.status(200).json({ url: session.url });

  } catch (err) {
    console.error('Stripe error:', err.message);
    return res.status(500).json({ error: 'Impossible de créer la session de paiement' });
  }
};
