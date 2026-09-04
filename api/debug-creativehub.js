// Diagnostic temporaire — à supprimer après usage
module.exports = async (req, res) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 7000);
  try {
    const r = await fetch('https://escher-v2.creativehub.io/v1/drops?limit=1', {
      headers: { 'Authorization': `Bearer ${process.env.CREATIVEHUB_API_KEY}` },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const text = await r.text();
    let body;
    try { body = JSON.parse(text); } catch { body = text; }
    return res.status(200).json({ status: r.status, ok: r.ok, body });
  } catch (err) {
    clearTimeout(timeout);
    return res.status(200).json({ error: err.message || String(err) });
  }
};
