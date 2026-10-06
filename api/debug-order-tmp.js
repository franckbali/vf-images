module.exports = async (req, res) => {
  try {
    const key = process.env.CREATIVEHUB_API_KEY;
    const r = await fetch('https://escher-v2.creativehub.io/v1/orders/c0d0ab21-5f71-4073-ab0a-500ab8cfc05c', { headers: { Authorization: `Bearer ${key}` } });
    const body = await r.json();
    // on masque les données personnelles du destinataire
    const scrub = o => JSON.parse(JSON.stringify(o, (k, v) => /^delivery_(name|line|email|phone|county|postcode)/.test(k) ? '[masqué]' : v));
    return res.status(200).json({ status: r.status, order: scrub(body) });
  } catch (e) { return res.status(500).json({ error: e.message }); }
};
