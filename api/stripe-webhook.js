// ═══════════════════════════════════════════════════════
//  VF Images — Webhook Stripe → commande Creativehub
//  POST /api/stripe-webhook
//  Appelé automatiquement par Stripe après chaque paiement
// ═══════════════════════════════════════════════════════

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Lit le body brut (nécessaire pour vérifier la signature Stripe)
function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  const rawBody = await readRawBody(req);
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    // Vérifie que c'est bien Stripe qui envoie (et pas quelqu'un d'autre)
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Signature webhook invalide:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // On ne traite que les paiements confirmés
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log('Paiement confirmé:', session.id, '| Photo:', session.metadata?.photo_id);

    try {
      const order = await sendToCreativehub(session);
      console.log('Commande Creativehub créée:', order);
    } catch (err) {
      console.error('Erreur Creativehub:', err.message);
      // On notifie par email pour intervention manuelle
      await sendErrorNotification(err, session);
    }
  }

  // Toujours répondre 200 à Stripe (sinon il réessaie)
  return res.status(200).json({ received: true });
};

// ─── Envoie la commande à Creativehub/Printspace ───────────────────────────
// API "Escher V2" (migration obligatoire début sept. 2026, l'ancienne
// https://api.creativehub.io/api/v1 ne répond plus). Doc à jour :
// https://sell.creativehub.io/api-docs#create-order
//
// Différences avec l'ancienne v1 :
// - base URL : https://escher-v2.creativehub.io/v1 (plus de /api/ dans le chemin)
// - payload à plat (delivery_*), plus d'objets imbriqués order/shipping_address/customer
// - champs renommés : address1→delivery_line1, zip→delivery_postcode,
//   country_code→delivery_country_code, name (destinataire)→delivery_name
// - le nom du client (facturation) n'a plus de champ dédié séparé du
//   destinataire ; on envoie l'email client dans delivery_email
async function sendToCreativehub(session) {
  const { creativehub_variant_id } = session.metadata;
  const shipping = session.shipping_details;

  const orderPayload = {
    items: [
      {
        variant_id: creativehub_variant_id, // ID récupéré depuis catalogue.json
        quantity: 1,
      },
    ],
    delivery_name:         shipping.name,
    delivery_line1:        shipping.address.line1,
    delivery_line2:        shipping.address.line2 || undefined,
    delivery_city:         shipping.address.city,
    delivery_postcode:     shipping.address.postal_code || undefined,
    delivery_country_code: shipping.address.country,
    delivery_email:        session.customer_details.email,
  };

  const response = await fetch('https://escher-v2.creativehub.io/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${process.env.CREATIVEHUB_API_KEY}`,
    },
    body: JSON.stringify(orderPayload),
  });

  if (!response.ok) {
    // Erreurs v2 : { "detail": "raison" } — on affiche le detail si présent,
    // sinon le texte brut (401 token invalide/révoqué, 403 accès API
    // désactivé sur le compte, 404, 429 quota dépassé).
    const errorText = await response.text();
    let detail = errorText;
    try { detail = JSON.parse(errorText).detail || errorText; } catch {}
    throw new Error(`Creativehub API ${response.status}: ${detail}`);
  }

  // { order_id, order_number, currency, total_incl_vat, lines }
  return response.json();
}

// ─── Notification email en cas d'échec ────────────────────────────────────
async function sendErrorNotification(error, session) {
  // Si NOTIFY_EMAIL est défini, on envoie un email via Resend (gratuit jusqu'à 3000/mois)
  // Pour l'instant on log — à connecter à Resend.com si souhaité
  console.error('═══ COMMANDE ÉCHOUÉE — INTERVENTION MANUELLE REQUISE ═══');
  console.error('Session Stripe :', session.id);
  console.error('Photo         :', session.metadata?.photo_id);
  console.error('Format        :', session.metadata?.format_label);
  console.error('Client        :', session.customer_details?.email);
  console.error('Erreur        :', error.message);
  console.error('═══════════════════════════════════════════════════════');

  // TODO : connecter Resend pour email automatique
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({ from: 'noreply@vfimages.com', to: process.env.NOTIFY_EMAIL, ... });
}
