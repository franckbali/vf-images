// ═══════════════════════════════════════════════════════
//  VF Images — DEBUG TEMPORAIRE — vrai réglage édition (pas la description)
//  GET /api/debug-editions-tmp
//  À SUPPRIMER après usage.
// ═══════════════════════════════════════════════════════

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');

  const key = process.env.CREATIVEHUB_API_KEY;
  if (!key) return res.status(500).json({ error: 'CREATIVEHUB_API_KEY manquante' });

  const targetNames = new Set([
    'portrait-bali-012',
    'portrait-bali-369',
    'hummingbird-costa-rica-001',
    'La Conversation Silencieuse · Bali',
  ]);

  try {
    const prodRes = await fetch('https://escher-v2.creativehub.io/v1/products', {
      headers: { Authorization: `Bearer ${key}` },
    });
    if (!prodRes.ok) return res.status(prodRes.status).json({ step: 'products', error: await prodRes.text() });
    const prodData = await prodRes.json();
    const products = prodData.products.filter(p => targetNames.has(p.name));

    const out = [];
    for (const product of products) {
      const varRes = await fetch(`https://escher-v2.creativehub.io/v1/products/${product.id}/variants`, {
        headers: { Authorization: `Bearer ${key}` },
      });
      if (!varRes.ok) { out.push({ product: product.name, error: await varRes.text() }); continue; }
      const varData = await varRes.json();
      const variants = varData.variants || varData.results || varData.items || varData.data || [];
      out.push({ product: product.name, product_id: product.id, variants });
    }

    return res.status(200).json(out);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
