// ═══════════════════════════════════════════════════════
//  VF Images — Webhook Stripe → commande Creativehub
//  POST /api/stripe-webhook
//  Appelé automatiquement par Stripe après chaque paiement
// ═══════════════════════════════════════════════════════

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const catalogue = require('../catalogue.json');
const { countSoldByVariant } = require('./_lib/creativehub');
const { generateCertificateCode } = require('./_lib/certificate');
const { getKv } = require('./_lib/kv');

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

      try {
        const code = await createCertificate(session);
        console.log('Certificat créé:', code);
      } catch (certErr) {
        // Ne bloque jamais la commande — le certificat peut être régénéré/réparé
        // manuellement plus tard si besoin, la commande elle-même est déjà passée.
        console.error('Erreur création certificat (commande OK malgré tout):', certErr.message);
      }
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
  // Stripe a déplacé ce champ : jusqu'à début 2026 c'était `session.shipping_details`,
  // c'est maintenant `session.collected_information.shipping_details` (vérifié sur
  // la doc API le 16 sept. 2026, version de compte 2026-04-22.dahlia). On garde
  // l'ancien chemin en repli au cas où l'API tournerait un jour sur une version
  // antérieure à ce changement.
  const shipping = session.collected_information?.shipping_details || session.shipping_details;
  if (!shipping) {
    throw new Error('Adresse de livraison introuvable sur la session Stripe (ni collected_information.shipping_details, ni shipping_details)');
  }

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

// ─── Crée le certificat d'authenticité numérique ───────────────────────────
// Appelée seulement après succès de la commande Creativehub. Écrit dans
// Upstash Redis : cert:{code} (l'enregistrement complet, lu par
// /api/certificat) et session_cert:{stripe_session_id} (pointeur, pour que
// la page de succès retrouve le code juste après le paiement).
async function createCertificate(session) {
  const { photo_id, format_label, creativehub_variant_id } = session.metadata;
  const shipping = session.collected_information?.shipping_details || session.shipping_details;

  const photo = catalogue.photos.find(p => p.id === photo_id);
  if (!photo) throw new Error(`Photo "${photo_id}" introuvable dans catalogue.json`);
  const format = photo.formats.find(f => f.label === format_label);
  if (!format) throw new Error(`Format "${format_label}" introuvable pour "${photo_id}"`);

  const code = generateCertificateCode();
  const isLimited = !!format.limited_edition;

  let editionNumber = null;
  if (isLimited) {
    // La commande vient d'être créée chez Creativehub : elle est déjà comptée
    // dans ce total, qui devient donc directement le numéro d'exemplaire.
    const counts = await countSoldByVariant(process.env.CREATIVEHUB_API_KEY, [creativehub_variant_id]);
    editionNumber = counts[creativehub_variant_id] || null;
  }

  const record = {
    code,
    issued_at: new Date(session.created * 1000).toISOString(),
    photo_id,
    title_fr: photo.title_fr,
    title_en: photo.title_en,
    location_fr: photo.location_fr,
    location_en: photo.location_en,
    image: photo.image,
    format_label,
    paper_fr: photo.paper_fr,
    paper_en: photo.paper_en,
    edition: isLimited ? 'limited' : 'open',
    edition_number: editionNumber,
    edition_total: isLimited ? format.limited_edition : null,
    buyer_name: shipping?.name || null,
    buyer_email: session.customer_details?.email || null,
    stripe_session_id: session.id,
  };

  const kv = getKv();
  await kv.set(`cert:${code}`, record);
  await kv.set(`session_cert:${session.id}`, code, { ex: 60 * 60 * 24 }); // pointeur temporaire, 24h suffit

  return code;
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
