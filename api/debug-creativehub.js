// ═══════════════════════════════════════════════════════
//  DIAGNOSTIC TEMPORAIRE — à supprimer après usage
//  Teste UN endpoint Creativehub à la fois (timeout court pour
//  ne pas rester bloqué si api.creativehub.io ne répond pas).
//  GET /api/debug-creativehub?endpoint=variant
// ═══════════════════════════════════════════════════════

module.exports = async (req, res) => {
  const key = process.env.CREATIVEHUB_API_KEY;
  if (!key) return res.status(500).json({ error: 'CREATIVEHUB_API_KEY manquante sur Vercel' });

  const variantId = req.query.variant_id || 'V-2DR8I9G2';
  const base = 'https://api.creativehub.io/api/v1';

  const endpoints = {
    variant:  `${base}/variants/${variantId}`,
    editions: `${base}/editions/${variantId}`,
    orders:   `${base}/orders?variant_id=${variantId}`,
    me:       `${base}/me`,
    products: `${base}/products`,
  };

  const which = req.query.endpoint || 'me';
  const url = endpoints[which];
  if (!url) return res.status(400).json({ error: 'endpoint inconnu', options: Object.keys(endpoints) });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 7000);

  try {
    const r = await fetch(url, {
      headers: { Authorization: `Bearer ${key}` },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const text = await r.text();
    let body;
    try { body = JSON.parse(text); } catch { body = text.slice(0, 800); }
    return res.status(200).json({ endpoint: which, url, status: r.status, body });
  } catch (err) {
    clearTimeout(timeout);
    return res.status(200).json({ endpoint: which, url, error: err.name === 'AbortError' ? 'Timeout après 7s (api.creativehub.io ne répond pas)' : err.message });
  }
};
