// DEBUG TEMPORAIRE — comprendre où se règle le COA (certificat) : produit ou variante
// GET /api/debug-coa-tmp
// À SUPPRIMER après usage.

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const key = process.env.CREATIVEHUB_API_KEY;
  if (!key) return res.status(500).json({ error: 'CREATIVEHUB_API_KEY manquante' });

  const productId = '731636ec-c7ce-4be3-85c8-c5fa4f368e37'; // La Conversation Silencieuse · Bali

  try {
    const prodRes = await fetch(`https://escher-v2.creativehub.io/v1/products/${productId}`, {
      headers: { Authorization: `Bearer ${key}` },
    });
    const prodText = await prodRes.text();
    let prodData; try { prodData = JSON.parse(prodText); } catch { prodData = prodText; }

    const varRes = await fetch(`https://escher-v2.creativehub.io/v1/products/${productId}/variants`, {
      headers: { Authorization: `Bearer ${key}` },
    });
    const varData = await varRes.json();

    return res.status(200).json({
      product_status: prodRes.status,
      product: prodData,
      variants_status: varRes.status,
      variants: varData,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
