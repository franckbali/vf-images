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
    const data = JSON.parse(text);

    if (req.query && req.query.debug !== undefined) {
      return res.status(200).json({ marker: 'v2', query: req.query, url: req.url });
    }

    if (req.query && req.query.variant !== undefined) {
      // teste si un fetch direct d'un variant expose un compteur (sold_count / available / remaining)
      const productId = '731636ec-c7ce-4be3-85c8-c5fa4f368e37'; // offrandes / La Conversation Silencieuse
      const variantId = 'c6efbf7d-cc07-4a81-a0da-d8ce9c3dfb56';
      const vRes = await fetch(`https://escher-v2.creativehub.io/v1/products/${productId}/variants/${variantId}`, {
        headers: { Authorization: `Bearer ${key}` },
      });
      const vText = await vRes.text();
      let vData; try { vData = JSON.parse(vText); } catch { vData = vText; }
      return res.status(200).json({ status: vRes.status, data: vData });
    }

    if (req.query && req.query.detail !== undefined && data.orders && data.orders.length) {
      const orderId = req.query.id || data.orders[0].id;
      const detailRes = await fetch(`https://escher-v2.creativehub.io/v1/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${key}` },
      });
      const detailText = await detailRes.text();
      let detail;
      try { detail = JSON.parse(detailText); } catch { detail = detailText; }
      return res.status(200).json({ order_id: orderId, status: detailRes.status, detail });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
