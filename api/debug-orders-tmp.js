// ═══════════════════════════════════════════════════════
//  VF Images — DEBUG TEMPORAIRE — explorer l'API Orders Creativehub
//  GET /api/debug-orders-tmp
//  Pour préparer le compteur "X restants" (sold count = source Creativehub)
//  À SUPPRIMER après usage.
// ═══════════════════════════════════════════════════════

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');

  const key = process.env.CREATIVEHUB_API_KEY;
  if (!key) return res.status(500).json({ error: 'CREATIVEHUB_API_KEY manquante' });

  try {
    const ordersRes = await fetch('https://escher-v2.creativehub.io/v1/orders', {
      headers: { Authorization: `Bearer ${key}` },
    });
    const text = await ordersRes.text();
    if (!ordersRes.ok) {
      return res.status(ordersRes.status).json({ step: 'orders', error: text });
    }
    let data;
    try { data = JSON.parse(text); } catch { data = text; }
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
