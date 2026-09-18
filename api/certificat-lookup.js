// ═══════════════════════════════════════════════════════
//  VF Images — Retrouve le code certificat juste après paiement
//  GET /api/certificat-lookup?session_id=cs_test_...
//  Utilisé par la page de succès (boutique.html?status=success) pour
//  afficher le lien du certificat dès que le webhook l'a généré
//  (le webhook Stripe est asynchrone, donc pas garanti prêt à l'instant
//  où le client atterrit sur la page — d'où le petit polling côté client).
// ═══════════════════════════════════════════════════════

const { getKv } = require('./_lib/kv');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');

  const { session_id } = req.query;
  if (!session_id) return res.status(400).json({ error: 'Paramètre session_id manquant' });

  try {
    const kv = getKv();
    const code = await kv.get(`session_cert:${session_id}`);
    if (!code) return res.status(202).json({ ready: false });
    return res.status(200).json({ ready: true, code });
  } catch (err) {
    console.error('certificat-lookup:', err.message);
    return res.status(500).json({ error: 'Indisponible' });
  }
};
