// ═══════════════════════════════════════════════════════
//  VF Images — Statut d'une édition limitée
//  GET /api/edition-status?id=portrait-bali-012
//
//  Le nombre vendu (sold) est calculé en direct depuis l'API Creativehub
//  (source de vérité — pas un compteur maintenu à la main dans
//  catalogue.json). Si l'API Creativehub est indisponible, on retombe
//  sur catalogue.json.formats[].sold_count comme repli.
// ═══════════════════════════════════════════════════════

const catalogue = require('../catalogue.json');
const { countSoldByVariant } = require('./_lib/creativehub');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=300'); // 5 min de cache CDN (évite de marteler l'API Creativehub)

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Paramètre id manquant' });

  const photo = catalogue.photos.find(p => p.id === id);
  if (!photo) return res.status(404).json({ error: `Photo "${id}" introuvable` });

  const limitedFormats = photo.formats.filter(f => f.limited_edition);

  let soldByVariant = null;
  const key = process.env.CREATIVEHUB_API_KEY;
  if (key && limitedFormats.length) {
    try {
      soldByVariant = await countSoldByVariant(
        key,
        limitedFormats.map(f => f.creativehub_variant_id)
      );
    } catch (err) {
      console.error('edition-status: Creativehub indisponible, repli sur catalogue.json —', err.message);
    }
  }

  const editions = limitedFormats.map(f => {
    const sold = soldByVariant ? soldByVariant[f.creativehub_variant_id] || 0 : (f.sold_count || 0);
    return {
      format:    f.label,
      total:     f.limited_edition,
      sold,
      available: f.limited_edition - sold,
    };
  });

  return res.status(200).json({
    id:          photo.id,
    title_fr:    photo.title_fr,
    title_en:    photo.title_en,
    location_fr: photo.location_fr,
    location_en: photo.location_en,
    image:       photo.image,
    paper_fr:    photo.paper_fr,
    paper_en:    photo.paper_en,
    editions,
  });
};
