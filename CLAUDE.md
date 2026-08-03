# VF Images — Mémoire projet (CLAUDE.md)

> Fichier lu automatiquement par Claude Code au début de chaque session.
> Emplacement : racine du dépôt `~/Desktop/vf-images/CLAUDE.md`.
> Mettre à jour les sections **ÉTAT** au fur et à mesure de l'avancement.

---

## 1. Projet

Site de vente de tirages fine art en édition limitée, galerie bilingue FR/EN.
Photographe : Franck Vinel (Fra), basé à Ubud (Bali). Clients cibles : Europe + Asie.
Esthétique : fond noir (`#0a0a0a`), accents or (`#c9a96e`), minimaliste, haut de gamme.
Tagline : « Ce que je vois » / « What I see ».

**Objectif** : vendre les tirages en ligne avec un minimum d'intervention manuelle, une qualité visuelle maximale, et un site que Franck gère seul pour le contenu.

Type : **site HTML statique** (pas de framework JS, pas de build step, fichiers HTML servis directement).

---

## 2. Stack & services

- **Repo GitHub** : `franckbali/vf-images`
- **Site en ligne** : `vfimages.com`
- **Hébergement** : Vercel (auto-déploiement depuis GitHub `main`) — déploiement ~1–2 min après `git push`
- **CMS** : Sveltia CMS sur `vfimages.com/admin` (OAuth GitHub, compte `franckbali`)
- **Paiement** : Stripe (compte production, France/N26) — via Payment Links
- **Impression** : Creativehub/The Printspace (UK) pour les giclées Europe ; WhiteWall pour les grands formats Collector (manuel)
- **Registrar DNS** : Namecheap
- **Analytics** : Umami (ID `1e9107e5-f1ec-4acc-b2d3-a44932d9fcf1`)
- **Formulaire contact** : Formspree (ID `mwvybbrz`)
- **API Creativehub** : `https://api.creativehub.io` (clé stockée en privé, hors dépôt)

Pages : `index`, `boutique`, `galerie-index`, `galerie-newyork`, `a-propos`, `blog`, `blog-article`, `contact`, `mentions-legales`.

---

## 3. Structure des galeries

6 galeries configurées dans `galeries.json` (fichier édité par le CMS) :
Bali · New York · Cérémonies · Voyages · Portraits · La Réunion.

`galerie-index.html` lit `galeries.json` dynamiquement et génère les vignettes.

---

## 4. ÉTAT — Ce qui est FAIT

**Site & SEO**
- SEO complet : canonical, OG/Twitter Cards, hreflang FR/EN, JSON-LD, `sitemap.xml` (21 URLs), `robots.txt`
- `vfimages.com` = domaine primaire ; `www` → redirection 308
- Google Search Console vérifié (propriété Domaine, TXT via Namecheap), sitemap soumis
- Refonte CSS : `style.css` global partagé (nav, menu hamburger, boutons langue FR/EN, footer, bandeau cookies)
- Pinterest Business (`pinterest.com/vfimages`), 8 tableaux thématiques, site revendiqué (TXT)

**CMS & workflow photo**
- Sveltia CMS configuré, 3 collections : Galeries (`galeries.json`), Blog (`/blog/` markdown), Boutique (`boutique.json`)
- Script `traiter-photos.py` — optimise les photos (WebP, miniatures, versions medium), met à jour `galeries.json`
- Raccourci `Lancer-VFImages.command` — lance le script sans Terminal
- Préréglages Lightroom : "VF Images — Site Web" (JPEG 82%, 2000px, sRGB, 72ppi → `photos-originales/`) et "VF Images — Printspace" (TIFF 16-bit, Adobe RGB 1998, 300ppi → `printspace/`)
- Chaîne : Lightroom → `photos-originales/` → script → `images/` → git push → Vercel

**Impression & commerce**
- Compte Creativehub (Franck Vinel, plan Basic) : clé API générée, branding configuré
- 2 photos en ligne (dont `portrait-bali-012`), 3 formats chacune : 30×45 cm 95€ / 40×60 cm 135€ / 70×100 cm 390€ (édition limitée à 7). Papier Hahnemühle Pearl giclée avec bordure
- Stripe production : 3 Payment Links créés pour `portrait-bali-012` (livraison Europe)
- Certificats d'authenticité : 6 designs dispo sur Creativehub (Classic gratuit), A4 135g/m² Diamond White Fine Linen
- Signature : `signature-noir.png` (3162px transparent) + `signature-noir.svg` (vectorisée)

**Flux de commande actuel = 100% MANUEL**
Client paie via Stripe → Franck reçoit la notif → Franck passe la commande manuellement dans Creativehub → Printspace expédie directement au client.

---

## 5. ÉTAT — Ce qu'il RESTE à faire

### Front-end / galeries / CMS
1. **Vérifier CMS ↔ pages individuelles** (priorité) : les pages individuelles (`galerie-bali.html`, etc.) lisent-elles `galeries.json` ou sont-elles encore statiques ? À confirmer et corriger. Le CMS crée des `.md`/JSON mais toutes les pages HTML ne les lisent pas encore.
2. **Vérifier les visuels** : confirmer que tous les hero et covers de collections sont bien les vraies photos de Franck et non des placeholders (statut ambigu — à contrôler).
3. **Cohérence visuelle** : aligner la hauteur du hero de `galerie-index.html` sur celui d'`a-propos.html`.
4. **Créer les pages galeries manquantes** : Bali, Réunion, Bolivie.
5. **Blog & Boutique** : collections CMS créées mais vides — aucun article ni produit. Écrire de vrais articles de blog.

### Dossiers Mac & sauvegardes
6. Clarifier le rôle de `photos-originales/`, `traiter-photos.py`, `Lancer-VFImages.command` dans le workflow.
7. Tester `sauvegarder-vfimages.command` et `sauvegarder-site-local.command` → vérifier la sauvegarde vers le disque externe « pics ».

### Commerce / print
8. Uploader les ~48 photos restantes sur Creativehub + créer les Payment Links Stripe correspondants.
9. Intégrer les Payment Links comme boutons d'achat dans la boutique (`shop.html`).
10. Générer la version or (`#c9a96e`) de la signature pour les certificats.
11. Compléter les traductions EN des textes longs.

### Automatisation (décision ouverte)
12. **Webhook Vercel Serverless** (`/api/stripe-webhook.js` + `catalogue.json`) pour automatiser Stripe → Creativehub (prévu avant le lancement des 50 photos). **À trancher** : le construire maintenant, ou rester manuel jusqu'à approcher les 50 photos ?

### Décisions déjà tranchées
- Migration Shopify : **rejetée** (abandonnerait le site custom, le SEO, Sveltia CMS, le design noir & or).

---

## 6. ⚠️ Worktree à vérifier (session du 1er juin 2026)

Une branche `claude/wizardly-montalcini-0056ce` a été créée dans
`.claude/worktrees/wizardly-montalcini-0056ce/` et n'était **pas encore mergée sur main** à l'époque.
**Action** : vérifier si elle a été mergée depuis ; sinon, décider de la merger ou de l'abandonner.

Contenu de cette worktree :
- Palette affinée : or plus sombre, fonds plus chauds ; nouvelles variables `--cream-warm` et `--cream-soft`
- Grain argentique SVG sur `body::before` (désactivé sur mobile)
- Split-tone overlay cinématique sur les photos
- Hero redessiné, lightbox crossfade, galerie masonry
- Responsive complet sur `index.html`, `boutique.html`, `galerie-newyork.html`

---

## 7. Conventions & workflow

- **Changements site** : structurel/visuel via Claude Code (description en français) ; contenu (photos, galeries, blog, boutique) via Sveltia CMS
- **Corriger toutes les pages d'un coup**, pas page par page
- **Images dans le CMS** : toujours référencées en JPG de base (ex. `images/ma-photo.jpg`) ; les variantes WebP srcset sont gérées automatiquement
- Les images vont dans `images/` (générées par le script), **pas** dans `photos-originales/`
- **Nommage photos** : minuscules, tirets, sans accents, descriptif (ex. `ceremonie-offrandes-bali.jpg`)
- **Édition de fichiers** : préférer les one-liners Python plutôt que `sed`
- **Lancement Claude Code** (nvm requis à chaque nouvelle session terminal) :
  `export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"` puis `claude`
- **`printspace/`** exclu de Git via `.gitignore`

---

## 8. Règles de travail Claude Code

- Toujours travailler sur `main` sauf si Franck demande une branche séparée
- Montrer le diff avant de modifier des fichiers
- Demander confirmation avant toute suppression de fichier
- Franck est **direct et minimal** : des actions, pas de longues explications ; pas de questions inutiles (les confirmations de sécurité ci-dessus restent)
- Priorité : site **ultra-performant sur mobile**, très lisible, cohérent visuellement, gérable en autonomie

**Par où commencer chaque session** : lire `galeries.json` et la structure de `galerie-index.html` pour comprendre l'état actuel, puis demander à Franck quelle priorité traiter.

---

## 9. Pièges à éviter (leçons)

- **`noindex` + canonical** sur pages dupliquées = signaux contradictoires pour Google → utiliser des redirections 301 via `vercel.json`
- **`vf-images.com` (avec tiret)** est FAUX — le domaine correct est `vfimages.com` partout
- L'écran d'onboarding Creativehub (connexion Shopify/Etsy/etc.) est **hors sujet** pour ce site custom → l'ignorer, les Payment Links Stripe existants ne sont pas affectés
- Ventes Europe : livraison absorbée dans le prix ; USA/international géré manuellement (Payment Links custom)
- Coûts livraison Printspace (€) : UK/Allemagne ~6,95 · UE ~14,63 · USA ~28,67 · Canada ~40,95 · Australie/ROW ~76,97
- WhiteWall = labo préféré pour les Collector (Hahnemühle Platinum Studio), commandes manuelles
