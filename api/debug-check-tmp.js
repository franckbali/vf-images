module.exports = async (req, res) => {
  try {
    const key = process.env.CREATIVEHUB_API_KEY;
    const H = { Authorization: `Bearer ${key}` };
    const base = 'https://escher-v2.creativehub.io/v1';
    const wanted = ['Le Souffle des Dieux','Le Geste de l\'Aube','Voile de Fumée','L\'Offrande Dorée','Le Gardien de Pierre','Le Seuil du Temple','Les Mains Jointes'];
    let products = [], offset = 0;
    for (;;) {
      const j = await (await fetch(`${base}/products?limit=50&offset=${offset}`, { headers: H })).json();
      const arr = j.products || []; products = products.concat(arr);
      if (arr.length < 50) break; offset += 50;
    }
    const out = [];
    for (const p of products.filter(p => wanted.some(w => p.name.startsWith(w)))) {
      const vj = await (await fetch(`${base}/products/${p.id}/variants`, { headers: H })).json();
      out.push({
        name: p.name, id: p.id,
        v: (vj.variants || []).map(v => ({ id: v.id, sku: v.sku, size: v.size, w: v.print_width_mm, h: v.print_height_mm, paper: v.paper_id, ed: v.edition_size, num: v.print_numbering_on_print, sig: v.print_signature_on_print, price: v.retail_price }))
          .sort((a, b) => a.w * a.h - b.w * b.h),
      });
    }
    return res.status(200).json(out);
  } catch (e) { return res.status(500).json({ error: e.message }); }
};
