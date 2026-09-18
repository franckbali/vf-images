// ═══════════════════════════════════════════════════════
//  VF Images — Connexion Upstash Redis (intégration Vercel Marketplace)
//  L'intégration Vercel × Upstash injecte KV_REST_API_URL / KV_REST_API_TOKEN
//  (convention héritée de l'ancien "Vercel KV", pas UPSTASH_REDIS_REST_*).
// ═══════════════════════════════════════════════════════

const { Redis } = require('@upstash/redis');

let client = null;

function getKv() {
  if (client) return client;
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) throw new Error('KV_REST_API_URL / KV_REST_API_TOKEN manquantes');
  client = new Redis({ url, token });
  return client;
}

module.exports = { getKv };
