module.exports = async (req, res) => {
  try {
    const key = process.env.CREATIVEHUB_API_KEY;
    const H = { Authorization: `Bearer ${key}` };
    const base = 'https://escher-v2.creativehub.io/v1';
    const branch = req.query.branch || 'boutique-7-photos';
    const cat = await (await fetch(`https://raw.githubusercontent.com/franckbali/vf-images/${branch}/catalogue.json?x=${Date.now()}`)).json();
    let products = [], offset = 0;
    for (;;) {
      const j = await (await fetch(`${base}/products?limit=50&offset=${offset}`, { headers: H })).json();
      const arr = j.products || []; products = products.concat(arr);
      if (arr.length < 50) break; offset += 50;
    }
    const vmap = {}; const pname = {};
    for (const p of products) {
      const vj = await (await fetch(`${base}/products/${p.id}/variants`, { headers: H })).json();
      for (const v of (vj.variants || [])) { vmap[v.id] = v; pname[v.id] = p.name; }
    }
    const report = [];
    for (const ph of cat.photos) {
      for (const f of ph.formats) {
        const v = vmap[f.creativehub_variant_id];
        const issues = [];
        if (!v) { issues.push('VARIANT_ID INTROUVABLE'); report.push({ photo: ph.id, fmt: f.label, issues }); continue; }
        const [a, b] = f.label.split('×').map(Number);
        if (v.print_width_mm !== a * 10 || v.print_height_mm !== b * 10) issues.push(`taille ${v.print_width_mm}x${v.print_height_mm} != ${f.label}`);
        const wantPaper = /Photo Rag/.test(ph.paper_fr) ? 'photo-rag' : /Baryta/.test(ph.paper_fr) ? 'baryta' : '?';
        if (v.paper_id !== wantPaper) issues.push(`papier CH=${v.paper_id} catalogue=${wantPaper}`);
        if (v.retail_price !== f.price_eur) issues.push(`prix CH=${v.retail_price} catalogue=${f.price_eur}`);
        if (f.limited_edition) { if (v.edition_size !== f.limited_edition) issues.push(`edition CH=${v.edition_size} attendu=${f.limited_edition}`); }
        else if (v.edition_size !== 0) issues.push(`edition CH=${v.edition_size} (attendu 0 = illimité)`);
        if (!v.print_numbering_on_print) issues.push('numérotation OFF');
        if (!v.print_signature_on_print) issues.push('signature OFF');
        if (!pname[f.creativehub_variant_id].startsWith(ph.title_fr.split(' · ')[0]) && !/^(portrait|hummingbird|La Conversation)/.test(pname[f.creativehub_variant_id])) issues.push(`nom produit CH="${pname[f.creativehub_variant_id]}"`);
        report.push({ photo: ph.id, fmt: f.label, issues });
      }
    }
    const bad = report.filter(r => r.issues.length);
    return res.status(200).json({ branch, checked: report.length, problemes: bad.length, detail: bad });
  } catch (e) { return res.status(500).json({ error: e.message }); }
};
