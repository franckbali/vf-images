// DEBUG TEMPORAIRE — vérifie le vrai paper_id par variante pour les 4 produits connectés
// GET /api/debug-papers-tmp
// À SUPPRIMER après usage.

const catalogue = require('../catalogue.json');

module.exports = async (req, res) => {
  const key = process.env.CREATIVEHUB_API_KEY;
  if (!key) return res.status(500).json({ error: 'CREATIVEHUB_API_KEY manquante' });

  try {
    const prodRes = await fetch('https://escher-v2.creativehub.io/v1/products', {
      headers: { Authorization: `Bearer ${key}` },
    });
    const prodData = await prodRes.json();
    const targetIds = new Set(catalogue.photos.flatMap(p => p.formats.map(f => f.creativehub_variant_id)));

    const out = [];
    for (const product of prodData.products) {
      const varRes = await fetch(`https://escher-v2.creativehub.io/v1/products/${product.id}/variants`, {
        headers: { Authorization: `Bearer ${key}` },
      });
      if (!varRes.ok) continue;
      const varData = await varRes.json();
      const variants = varData.variants || [];
      const matched = variants.filter(v => targetIds.has(v.id));
      if (matched.length) {
        out.push({
          product_name: product.name,
          description_excerpt: (product.description || '').split('\n')[0],
          variants: matched.map(v => ({ size: v.size, paper_id: v.paper_id, sku: v.sku })),
        });
      }
    }

    return res.status(200).json(out);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
