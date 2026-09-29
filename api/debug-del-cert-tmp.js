const { getKv } = require('./_lib/kv');

module.exports = async (req, res) => {
  try {
    const kv = getKv();
    const deleted = await kv.del('cert:TEST1234', 'cert:TESTOPEN');
    return res.status(200).json({ deleted });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
