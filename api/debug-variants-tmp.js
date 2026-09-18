// ═══════════════════════════════════════════════════════
//  VF Images — DEBUG TEMPORAIRE — mapping SKU → variant_id Creativehub
//  GET /api/_debug-variants
//  À SUPPRIMER après usage (cf. réponse support Creativehub 18 sept. 2026 :
//  items[].variant_id attend l'id interne, pas le SKU affiché V-XXXX)
// ═══════════════════════════════════════════════════════

const catalogue = require('../catalogue.json');

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');

  const key = process.env.CREATIVEHUB_API_KEY;
  if (!key) return res.status(500).json({ error: 'CREATIVEHUB_API_KEY manquante' });

  const knownSkus = new Set();
  catalogue.photos.forEach(p => p.formats.forEach(f => knownSkus.add(f.creativehub_variant_id)));

  try {
    const prodRes = await fetch('https://escher-v2.creativehub.io/v1/products', {
      headers: { Authorization: `Bearer ${key}` },
    });
    if (!prodRes.ok) {
      const t = await prodRes.text();
      return res.status(prodRes.status).json({ step: 'products', error: t });
    }
    const prodData = await prodRes.json();

    if (req.query.raw !== undefined) {
      return res.status(200).json({ raw_products_response: prodData });
    }

    const products = Array.isArray(prodData) ? prodData
      : Array.isArray(prodData.results) ? prodData.results
      : Array.isArray(prodData.items) ? prodData.items
      : Array.isArray(prodData.data) ? prodData.data
      : Array.isArray(prodData.products) ? prodData.products
      : [];

    if (!products.length) {
      return res.status(200).json({ error: 'products is not iterable', raw_products_response: prodData });
    }

    const matches = [];
    const allVariants = [];

    for (const product of products) {
      const productId = product.id || product.product_id;
      const varRes = await fetch(`https://escher-v2.creativehub.io/v1/products/${productId}/variants`, {
        headers: { Authorization: `Bearer ${key}` },
      });
      if (!varRes.ok) continue;
      const varData = await varRes.json();
      const variants = Array.isArray(varData) ? varData
        : Array.isArray(varData.results) ? varData.results
        : Array.isArray(varData.items) ? varData.items
        : Array.isArray(varData.data) ? varData.data
        : Array.isArray(varData.variants) ? varData.variants
        : [];

      for (const v of variants) {
        const entry = {
          product_id: productId,
          product_name: product.name || product.title,
          variant_id: v.id,
          sku: v.sku,
        };
        allVariants.push(entry);
        if (knownSkus.has(v.sku)) matches.push(entry);
      }
    }

    return res.status(200).json({
      known_skus_in_catalogue: [...knownSkus],
      matches,
      matches_count: matches.length,
      total_variants_found: allVariants.length,
      all_variants: allVariants,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
