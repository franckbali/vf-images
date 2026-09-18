// DEBUG TEMPORAIRE — injecte un faux certificat pour tester le rendu visuel
// GET /api/debug-seed-cert-tmp
// À SUPPRIMER après usage.

const { getKv } = require('./_lib/kv');
const catalogue = require('../catalogue.json');

module.exports = async (req, res) => {
  const photo = catalogue.photos.find(p => p.id === 'offrandes-bali-002');
  const format = photo.formats.find(f => f.label === '60×80');

  const record = {
    code: 'TEST1234',
    issued_at: new Date().toISOString(),
    photo_id: photo.id,
    title_fr: photo.title_fr,
    title_en: photo.title_en,
    location_fr: photo.location_fr,
    location_en: photo.location_en,
    image: photo.image,
    format_label: format.label,
    paper_fr: photo.paper_fr,
    paper_en: photo.paper_en,
    edition: 'limited',
    edition_number: 3,
    edition_total: format.limited_edition,
    buyer_name: 'Test Buyer',
    buyer_email: 'test@example.com',
    stripe_session_id: 'cs_test_fake',
  };

  const openRecord = {
    ...record,
    code: 'TESTOPEN',
    format_label: '30×40',
    edition: 'open',
    edition_number: null,
    edition_total: null,
  };

  try {
    const kv = getKv();
    await kv.set('cert:TEST1234', record);
    await kv.set('cert:TESTOPEN', openRecord);
    await kv.set('session_cert:cs_test_fake', 'TEST1234', { ex: 600 });
    return res.status(200).json({ ok: true, urls: ['/certificat/TEST1234', '/certificat/TESTOPEN'] });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
