// ═══════════════════════════════════════════════════════
//  VF Images — Génération du code de certificat
//  Format : VFC-XXXXXXXX (8 caractères url-safe, alphabet sans 0/O/1/I
//  pour éviter les confusions à la lecture/recopie).
// ═══════════════════════════════════════════════════════

const crypto = require('crypto');

const ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

function generateCertificateCode() {
  const bytes = crypto.randomBytes(8);
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return `VFC-${code}`;
}

module.exports = { generateCertificateCode };
