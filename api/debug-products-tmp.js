module.exports = async (req, res) => {
  try {
    const key = process.env.CREATIVEHUB_API_KEY;
    const H = { Authorization: `Bearer ${key}` };
    const base = 'https://escher-v2.creativehub.io/v1';
    let products = [], offset = 0;
    for (;;) {
      const r = await fetch(`${base}/products?limit=50&offset=${offset}`, { headers: H });
      const j = await r.json();
      const arr = j.products || [];
      products = products.concat(arr);
      if (arr.length < 50) break;
      offset += 50;
    }
    const out = [];
    for (const p of products) {
      const vr = await fetch(`${base}/products/${p.id}/variants`, { headers: H });
      const vj = await vr.json();
      out.push({
        id: p.id, name: p.name, created: p.created_at, count: p.variant_count,
        variants: (vj.variants || []).map(v => ({
          id: v.id, sku: v.sku, w: v.print_width_mm, h: v.print_height_mm, size: v.size,
          paper: v.paper_id, edition: v.edition_size, price: v.retail_price, cur: v.price_currency,
          framed: v.is_framed, border: v.border, sig: v.print_signature_on_print, num: v.print_numbering_on_print,
        })),
      });
    }
    return res.status(200).json(out);
  } catch (e) { return res.status(500).json({ error: e.message }); }
};
