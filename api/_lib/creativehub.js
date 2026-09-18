// ═══════════════════════════════════════════════════════
//  VF Images — Helpers partagés API Creativehub (Escher V2)
// ═══════════════════════════════════════════════════════

const CH_API = 'https://escher-v2.creativehub.io/v1';

// Statuts d'order considérés comme "annulés" — ne comptent pas dans le sold count.
function isCancelled(status) {
  return /cancel|refund/i.test(status || '');
}

// Récupère toutes les commandes (paginées) auprès de Creativehub.
async function fetchAllOrders(key) {
  const orders = [];
  let offset = 0;
  const limit = 50;
  for (;;) {
    const r = await fetch(`${CH_API}/orders?limit=${limit}&offset=${offset}`, {
      headers: { Authorization: `Bearer ${key}` },
    });
    if (!r.ok) throw new Error(`Creativehub /orders ${r.status}`);
    const data = await r.json();
    const batch = data.orders || [];
    orders.push(...batch);
    if (batch.length < limit) break;
    offset += limit;
    if (offset > 2000) break; // garde-fou
  }
  return orders;
}

// Compte, pour chaque variant_id demandé, le nombre d'exemplaires vendus
// (en excluant les commandes annulées).
async function countSoldByVariant(key, variantIds) {
  const wanted = new Set(variantIds);
  const counts = {};
  wanted.forEach(v => (counts[v] = 0));

  const orders = await fetchAllOrders(key);

  for (const order of orders) {
    if (isCancelled(order.status)) continue;
    const r = await fetch(`${CH_API}/orders/${order.id}`, {
      headers: { Authorization: `Bearer ${key}` },
    });
    if (!r.ok) continue;
    const detail = await r.json();
    const items = detail.items || [];
    for (const item of items) {
      if (item.variant_id && wanted.has(item.variant_id)) {
        counts[item.variant_id] += item.quantity || 1;
      }
    }
  }

  return counts;
}

module.exports = { CH_API, isCancelled, fetchAllOrders, countSoldByVariant };
