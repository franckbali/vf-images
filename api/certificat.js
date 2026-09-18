// ═══════════════════════════════════════════════════════
//  VF Images — Page publique de vérification d'un certificat
//  GET /certificat/:code  (rewrite vercel.json → /api/certificat?code=:code)
//
//  Page rendue côté serveur (pas de JS nécessaire), design clair/imprimable,
//  volontairement différent du reste du site (fond noir). N'affiche jamais
//  le nom/email de l'acheteur — uniquement les faits vérifiables sur l'œuvre.
// ═══════════════════════════════════════════════════════

const { getKv } = require('./_lib/kv');

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

const T = {
  fr: {
    docTitle: c => `Certificat d'authenticité — ${c.title_fr} | VF Images`,
    eyebrow: 'Certificat d\'authenticité numérique',
    lblLocation: 'Lieu',
    lblFormat: 'Format',
    lblPaper: 'Papier',
    lblEdition: 'Édition',
    lblIssued: 'Émis le',
    lblCode: 'Code de vérification',
    editionOpen: 'Tirage numéroté',
    editionLimited: (n, total) => `Exemplaire N° ${n} / ${total}`,
    signedBy: 'Signature reproduite de l\'artiste',
    artist: 'Franck Vinel — VF Images',
    verify: 'Ce certificat est vérifiable en permanence à cette adresse :',
    print: 'Imprimer / Télécharger',
    lang: 'EN',
    langHref: l => `?lang=en`,
    notFoundTitle: 'Certificat introuvable',
    notFoundBody: 'Ce code de certificat n\'existe pas ou n\'est plus valide.',
    backHome: 'Retour à l\'accueil',
  },
  en: {
    docTitle: c => `Certificate of Authenticity — ${c.title_en} | VF Images`,
    eyebrow: 'Digital Certificate of Authenticity',
    lblLocation: 'Location',
    lblFormat: 'Format',
    lblPaper: 'Paper',
    lblEdition: 'Edition',
    lblIssued: 'Issued on',
    lblCode: 'Verification code',
    editionOpen: 'Numbered print',
    editionLimited: (n, total) => `Print N° ${n} / ${total}`,
    signedBy: 'Artist\'s reproduced signature',
    artist: 'Franck Vinel — VF Images',
    verify: 'This certificate can always be verified at:',
    print: 'Print / Download',
    lang: 'FR',
    langHref: l => `?lang=fr`,
    notFoundTitle: 'Certificate not found',
    notFoundBody: 'This certificate code does not exist or is no longer valid.',
    backHome: 'Back to homepage',
  },
};

const BASE_STYLE = `
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:#f5f3ef;color:#1a1a1a;font-family:'Raleway',sans-serif;min-height:100svh;display:flex;flex-direction:column;align-items:center;padding:5vh 5vw}
  .cert{max-width:640px;width:100%;background:#fff;border:1px solid #e4ddd0;padding:4rem 4.5rem;box-shadow:0 20px 60px rgba(0,0,0,.06)}
  .logo{height:34px;width:auto;display:block;margin:0 auto 2.5rem}
  .eyebrow{text-align:center;font-size:.72rem;letter-spacing:.28em;text-transform:uppercase;color:#9a9282;margin-bottom:2.5rem}
  .photo{width:100%;height:auto;display:block;margin-bottom:2.5rem;border:1px solid #eee}
  h1{font-family:'Cormorant Garamond',serif;font-weight:400;font-size:clamp(1.8rem,4vw,2.6rem);text-align:center;letter-spacing:.02em;line-height:1.2;margin-bottom:.5rem}
  .location{text-align:center;font-size:.85rem;color:#7a7266;font-style:italic;font-family:'Lora',serif;margin-bottom:2.5rem}
  .facts{border-top:1px solid #e4ddd0;border-bottom:1px solid #e4ddd0;padding:2rem 0;margin-bottom:2.5rem}
  .fact{display:flex;justify-content:space-between;gap:1.5rem;padding:.55rem 0;font-size:.92rem}
  .fact-label{color:#9a9282;font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;flex-shrink:0;padding-top:.15rem}
  .fact-value{text-align:right;font-family:'Lora',serif;font-style:italic}
  .signature-block{text-align:center;margin-bottom:2.5rem}
  .signature-cap{font-size:.68rem;letter-spacing:.1em;color:#9a9282;text-transform:uppercase}
  .artist{font-family:'Cormorant Garamond',serif;font-size:1.05rem;margin-top:.3rem}
  .verify{text-align:center;font-size:.72rem;color:#9a9282;line-height:1.7}
  .verify code{display:block;margin-top:.4rem;font-family:'Raleway',sans-serif;font-size:.78rem;letter-spacing:.04em;color:#1a1a1a;word-break:break-all}
  .actions{display:flex;justify-content:center;gap:1.2rem;margin-top:2.5rem}
  .btn{font-family:'Raleway',sans-serif;font-size:.72rem;letter-spacing:.18em;text-transform:uppercase;text-decoration:none;padding:.8rem 1.8rem;border:1px solid #c9a96e;color:#8a7038;background:none;cursor:pointer}
  .btn:hover{background:#f7f2e6}
  .btn-ghost{border-color:#ddd;color:#9a9282}
  @media(max-width:600px){.cert{padding:2.5rem 1.8rem}}
  @media print{
    body{padding:0;background:#fff}
    .cert{box-shadow:none;border:none;max-width:100%}
    .actions{display:none}
  }
`;

function renderNotFound(lang) {
  const t = T[lang];
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<title>${escapeHtml(t.notFoundTitle)} | VF Images</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Raleway:wght@300;400&family=Cormorant+Garamond:wght@400&display=swap">
<style>${BASE_STYLE}</style>
</head>
<body>
  <div class="cert" style="text-align:center">
    <h1>${escapeHtml(t.notFoundTitle)}</h1>
    <p class="location" style="margin-top:1rem">${escapeHtml(t.notFoundBody)}</p>
    <div class="actions"><a class="btn" href="https://vfimages.com/">${escapeHtml(t.backHome)}</a></div>
  </div>
</body>
</html>`;
}

function renderCertificate(c, lang) {
  const t = T[lang];
  const title = lang === 'en' ? c.title_en : c.title_fr;
  const location = lang === 'en' ? c.location_en : c.location_fr;
  const paper = lang === 'en' ? c.paper_en : c.paper_fr;
  const editionText = c.edition === 'limited'
    ? t.editionLimited(c.edition_number, c.edition_total)
    : t.editionOpen;
  const issuedDate = new Date(c.issued_at).toLocaleDateString(lang === 'en' ? 'en-GB' : 'fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
  const verifyUrl = `https://vfimages.com/certificat/${c.code}`;

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<title>${escapeHtml(t.docTitle(c))}</title>
<link rel="canonical" href="${verifyUrl}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500&family=Cormorant+Garamond:wght@400;500&family=Lora:ital@1&display=swap">
<style>${BASE_STYLE}</style>
</head>
<body>
  <div class="cert">
    <img class="logo" src="https://vfimages.com/images/logo-vf3-noir-v2.svg" alt="VF Images">
    <p class="eyebrow">${escapeHtml(t.eyebrow)}</p>
    <img class="photo" src="https://vfimages.com/${escapeHtml(c.image)}" alt="${escapeHtml(title)}">
    <h1>${escapeHtml(title)}</h1>
    <p class="location">${escapeHtml(location)}</p>
    <div class="facts">
      <div class="fact"><span class="fact-label">${escapeHtml(t.lblFormat)}</span><span class="fact-value">${escapeHtml(c.format_label)} cm</span></div>
      <div class="fact"><span class="fact-label">${escapeHtml(t.lblPaper)}</span><span class="fact-value">${escapeHtml(paper)}</span></div>
      <div class="fact"><span class="fact-label">${escapeHtml(t.lblEdition)}</span><span class="fact-value">${escapeHtml(editionText)}</span></div>
      <div class="fact"><span class="fact-label">${escapeHtml(t.lblIssued)}</span><span class="fact-value">${escapeHtml(issuedDate)}</span></div>
    </div>
    <div class="signature-block">
      <p class="signature-cap">${escapeHtml(t.signedBy)}</p>
      <p class="artist">${escapeHtml(t.artist)}</p>
    </div>
    <p class="verify">${escapeHtml(t.verify)}<code>${escapeHtml(verifyUrl)}</code></p>
    <div class="actions">
      <button class="btn" onclick="window.print()">${escapeHtml(t.print)}</button>
      <a class="btn btn-ghost" href="${t.langHref(lang)}">${t.lang}</a>
    </div>
  </div>
</body>
</html>`;
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600');

  const { code, lang: langParam } = req.query;
  const lang = langParam === 'en' ? 'en' : 'fr';

  if (!code) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(400).send(renderNotFound(lang));
  }

  try {
    const kv = getKv();
    const record = await kv.get(`cert:${code}`);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    if (!record) return res.status(404).send(renderNotFound(lang));
    return res.status(200).send(renderCertificate(record, lang));
  } catch (err) {
    console.error('certificat:', err.message);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(500).send(renderNotFound(lang));
  }
};
