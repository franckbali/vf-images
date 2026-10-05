const { getKv } = require('./_lib/kv');
const catalogue = require('../catalogue.json');

module.exports = async (req, res) => {
  try {
    const kv = getKv();
    const out = {};
    for (const code of ['VFC-46DCPKVQ', 'VFC-6N9XHANY']) {
      const rec = await kv.get(`cert:${code}`);
      if (!rec) { out[code] = null; continue; }
      const photo = catalogue.photos.find(p => p.id === rec.photo_id);
      const before = { photo_id: rec.photo_id, format: rec.format_label, edition: rec.edition, paper_fr: rec.paper_fr, paper_en: rec.paper_en, issued_at: rec.issued_at };
      let fixed = false;
      if (req.query.apply === '1' && photo && (rec.paper_fr !== photo.paper_fr || rec.paper_en !== photo.paper_en)) {
        rec.paper_fr = photo.paper_fr; rec.paper_en = photo.paper_en;
        await kv.set(`cert:${code}`, rec);
        fixed = true;
      }
      out[code] = { before, catalogue_paper_fr: photo && photo.paper_fr, fixed };
    }
    return res.status(200).json(out);
  } catch (e) { return res.status(500).json({ error: e.message }); }
};
