const { getKv } = require('./_lib/kv');

module.exports = async (req, res) => {
  try {
    const kv = getKv();
    const keys = await kv.keys('cert:*');
    return res.status(200).json({ keys });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
