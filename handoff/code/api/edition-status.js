// ═══════════════════════════════════════════════════════
//  VF Images — Statut d'une édition limitée
//  GET /api/edition-status?id=portrait-bali-012
// ═══════════════════════════════════════════════════════

const catalogue = require('../catalogue.json');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store'); // toujours frais

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Paramètre id manquant' });

  const photo = catalogue.photos.find(p => p.id === id);
  if (!photo) return res.status(404).json({ error: `Photo "${id}" introuvable` });

  // Ne retourne que les formats en édition limitée
  const editions = photo.formats
    .filter(f => f.limited_edition)
    .map(f => ({
      format:    f.label,
      total:     f.limited_edition,
      sold:      f.sold_count || 0,
      available: f.limited_edition - (f.sold_count || 0),
    }));

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
