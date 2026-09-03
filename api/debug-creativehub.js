// ═══════════════════════════════════════════════════════
//  DIAGNOSTIC TEMPORAIRE — à supprimer après usage
//  Teste plusieurs endpoints Creativehub pour voir lequel
//  expose le nombre d'exemplaires vendus d'une édition limitée.
//  GET /api/_debug-creativehub?variant_id=V-2DR8I9G2
// ═══════════════════════════════════════════════════════

module.exports = async (req, res) => {
  const key = process.env.CREATIVEHUB_API_KEY;
  if (!key) return res.status(500).json({ error: 'CREATIVEHUB_API_KEY manquante sur Vercel' });

  // Par défaut : portrait-bali-369, format 100×70, édition limitée à 15
  const variantId = req.query.variant_id || 'V-2DR8I9G2';
  const base = 'https://api.creativehub.io/api/v1';

  const candidates = [
    { label: 'variant',           url: `${base}/variants/${variantId}` },
    { label: 'editions',          url: `${base}/editions/${variantId}` },
    { label: 'orders?variant_id', url: `${base}/orders?variant_id=${variantId}` },
    { label: 'me',                url: `${base}/me` },
    { label: 'products',          url: `${base}/products` },
  ];

  const results = [];
  for (const c of candidates) {
    try {
      const r = await fetch(c.url, { headers: { Authorization: `Bearer ${key}` } });
      const text = await r.text();
      let body;
      try { body = JSON.parse(text); } catch { body = text.slice(0, 500); }
      results.push({ label: c.label, url: c.url, status: r.status, body });
    } catch (err) {
      results.push({ label: c.label, url: c.url, error: err.message });
    }
  }

  return res.status(200).json({ variantId, results });
};
