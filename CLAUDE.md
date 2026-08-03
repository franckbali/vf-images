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

Pages existantes : `index`, `boutique`, `galerie-index`, `galerie-bali`, `galerie-newyork`, `galerie-portraits`, `a-propos`, `blog`, `blog-article` (Melasti), `blog-article-reunion` (La Réunion), `contact`, `mentions-legales`.

---

## 3. Structure des galeries

6 galeries configurées dans `galeries.json` (fichier édité par le CMS) :
Bali · New York · Cérémonies · Voyages · Portraits · La Réunion.

`galerie-index.html` lit `galeries.json` dynamiquement et génère les vignettes.
Pages HTML existantes : Bali ✅ · New York ✅ · Portraits ✅ · Cérémonies ✗ · Voyages ✗ · La Réunion ✗.

Sous-titres actuels dans `galeries.json` :
- Bali : « Temples, rites et offrandes »
- New York : « Le tumulte et l'instant »
- Portraits : « Visages du monde »

---

## 4. ÉTAT — Ce qui est FAIT

**Site & SEO**
- SEO complet sur 28 pages HTML : canonical sans `.html`, `author`, `robots index/follow`, Open Graph complet (`og:title`, `og:description`, `og:image` absolue, `og:url`, `og:site_name`, `og:locale`), Twitter Cards (`summary_large_image`), `hreflang` fr/en/x-default sur toutes les paires bilingues
- JSON-LD : URLs corrigées (www supprimé, `.html` retiré) sur toutes les pages ; VisualArtwork ajouté sur `editions/portrait-bali-012` et `editions/portrait-bali-369` (titres et descriptions différenciés N°12 vs N°369)
- `sitemap.xml` : réécriture complète — 22 URLs, domaine `https://vfimages.com`, zéro `.html`, `xhtml:link` hreflang
- `robots.txt` : Sitemap corrigé, 3 `Disallow` ajoutés pour fichiers de travail
- `vercel.json` : 8 redirects 301 — `/gallery`, `/shop`, `/about`, `/legal` (et variantes `.html`) → cibles canoniques correctes
- `noindex` ajouté sur `boutique_backup`, `propositions-palettes`, `raffinements-style`, `en/legal`, `404`
- `en/contact.html` : `<h1>` traduit en anglais ; URLs formulaire corrigées (FR et EN)
- Image OG fallback `assets/og-vf-images.jpg` (1200×630 px, 194 Ko) — vérifiée présente dans le repo
- `vfimages.com` = domaine primaire · `www` → redirection 308 (à configurer dans Vercel dashboard)
- Google Search Console vérifié (propriété Domaine, TXT via Namecheap) — **sitemap à resoumettre** : `https://vfimages.com/sitemap.xml`
- Refonte CSS : `style.css` global partagé (nav, menu hamburger, boutons langue FR/EN, footer, bandeau cookies)
- Pinterest Business (`pinterest.com/vfimages`), 8 tableaux thématiques, site revendiqué (TXT)

**CMS & workflow photo**
- Sveltia CMS configuré, 3 collections : Galeries (`galeries.json`), Blog (`/blog/` markdown), Boutique (`boutique.json`)
- Script `traiter-photos.py` — optimise les photos (WebP, miniatures, versions medium), met à jour `galeries.json`
- Raccourci `Lancer-VFImages.command` — lance le script sans Terminal
- Préréglages Lightroom : "VF Images — Site Web" et "VF Images — Printspace"
- Chaîne : Lightroom → `photos-originales/` → script → `images/` → git push → Vercel

**Impression & commerce**
- Compte Creativehub (Franck Vinel, plan Basic) : clé API générée, branding configuré
- Stripe production : Payment Links créés pour les photos disponibles
- Certificats d'authenticité disponibles sur Creativehub
- Signature : `signature-noir.png` + `signature-noir.svg`
- `catalogue.json` : source de vérité prix/papier/variant Creativehub — seul fichier à modifier lors d'un changement tarifaire

**Flux de commande actuel = 100% MANUEL**
Client paie via Stripe → Franck reçoit la notif → Franck passe la commande manuellement dans Creativehub → Printspace expédie directement au client.

**Galeries**
- `galerie-bali.html` : 6 photos au format naturel (no crop, height:auto), système `.block.nat.lg/md/full`
- `galerie-newyork.html` : galerie complète, lightbox crossfade
- `galerie-portraits.html` : galerie complète avec texte éditorial
- Toutes les galeries : lightbox corrigée (plus de scroll-jump iOS — suppression totale de `position:fixed` sur le body)
- Panneau « La série » supprimé des 3 galeries (Bali, New York, Portraits)
- Bandeaux éditoriaux (`.serie-bandeau`) : traits animés au scroll + texte Raleway 200 italic dans les 3 galeries
- Bandeau contact bilingue FR/EN ajouté en bas des 3 galeries
- Accueil (`index.html`) : masonry desktop (CSS column-count:3) + flex 2 colonnes alternées mobile, CLS prévenu (w/h dans `accueil.json`)

**Blog / Journal**
- `blog-article.html` : article Melasti (texte complet, hero, police unifiée, section vidéo retirée)
- `blog-article-reunion.html` : article « Cari feu de bois » créé de zéro
- Page `blog.html` : 2 articles en grand format featured, alternance gauche/droite
- Article « Réflexion » retiré

---

## 5. ÉTAT — Ce qu'il RESTE à faire

### Front-end / galeries
1. **Créer les pages galeries manquantes** : Cérémonies, Voyages/Bolivie, La Réunion (actuellement `visible:false` dans `galeries.json`)
2. **Vérifier les visuels covers** dans `galeries.json` : confirmer que `image_cover` pointe sur les bonnes vraies photos

### Commerce / print
3. Uploader les photos restantes sur Creativehub + créer les Payment Links Stripe correspondants
4. Remplir les `PLACEHOLDER_A_REMPLIR` dans `catalogue.json` (variant IDs Creativehub manquants)
5. Ajouter le flux Stripe Checkout aux 5 autres produits boutique (Barong, Offrandes, Manhattan, Fenêtre, Faune Sacrée)
6. Créer le PDF certificat d'authenticité + QR codes éditions limitées
7. Générer la version or (`#c9a96e`) de la signature pour les certificats

### SEO / contenu
8. **Alt texts** descriptifs sur toutes les images des galeries (SEO + accessibilité)
9. **Images OG dédiées** par galerie : `og-bali.jpg`, `og-newyork.jpg`, `og-portraits.jpg`, `og-blog.jpg` (actuellement fallback `og-vf-images.jpg`)
10. **Vérifier www → vfimages.com** dans Vercel dashboard (Settings → Domains → redirect "www")
11. **Resoumettre le sitemap** dans Google Search Console : `https://vfimages.com/sitemap.xml`
12. Compléter les traductions EN des textes longs (tagline contact, messages erreur formulaire)
13. Écrire d'autres articles de blog

### Automatisation (décision ouverte)
11. **Webhook Vercel Serverless** (`/api/stripe-webhook.js` + `catalogue.json`) pour automatiser Stripe → Creativehub. **À trancher** : construire maintenant, ou rester manuel jusqu'à approcher les 50 photos ?

### Décisions déjà tranchées
- Migration Shopify : **rejetée** (abandonnerait le site custom, le SEO, Sveltia CMS, le design noir & or)
- Panneau « La série » : **supprimé**, remplacé par les bandeaux éditoriaux toujours visibles

---

## 6. Conventions & workflow

- **Changements site** : structurel/visuel via Claude Code (description en français) ; contenu (photos, galeries, blog, boutique) via Sveltia CMS
- **Corriger toutes les pages d'un coup**, pas page par page
- **Images dans le CMS** : toujours référencées en JPG de base (ex. `images/ma-photo.jpg`) ; les variantes WebP srcset sont gérées automatiquement
- Les images vont dans `images/` (générées par le script), **pas** dans `photos-originales/`
- **Nommage photos** : minuscules, tirets, sans accents, descriptif (ex. `ceremonie-offrandes-bali.jpg`)
- **`printspace/`** exclu de Git via `.gitignore`
- **Lancement Claude Code** (nvm requis à chaque nouvelle session terminal) :
  `export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"` puis `claude`

---

## 7. Règles de travail Claude Code

- Toujours travailler sur `main` sauf si Franck demande une branche séparée
- Montrer le diff avant de modifier des fichiers
- Demander confirmation avant toute suppression de fichier
- Franck est **direct et minimal** : des actions, pas de longues explications ; pas de questions inutiles (les confirmations de sécurité ci-dessus restent)
- Priorité : site **ultra-performant sur mobile**, très lisible, cohérent visuellement, gérable en autonomie

**Par où commencer chaque session** : lire `galeries.json` et `accueil.json` pour l'état actuel, puis demander à Franck quelle priorité traiter.

---

## 8. Pièges à éviter (leçons)

- **`noindex` + canonical** sur pages dupliquées = signaux contradictoires pour Google → utiliser des redirections 301 via `vercel.json`
- **`vf-images.com` (avec tiret)** est FAUX — le domaine correct est `vfimages.com` partout
- L'écran d'onboarding Creativehub (connexion Shopify/Etsy/etc.) est **hors sujet** pour ce site custom → l'ignorer
- Ventes Europe : livraison absorbée dans le prix ; USA/international géré manuellement (Payment Links custom)
- Coûts livraison Printspace (€) : UK/Allemagne ~6,95 · UE ~14,63 · USA ~28,67 · Canada ~40,95 · Australie/ROW ~76,97
- WhiteWall = labo préféré pour les Collector (Hahnemühle Platinum Studio), commandes manuelles
- **Lightbox iOS** : ne jamais modifier `body.style.position/top/overflow` dans openLightbox/closeLightbox — cause un scroll-jump. La lightbox `position:fixed;inset:0;pointer-events:all` suffit à bloquer le scroll
- **`accueil.json`** : toujours inclure `w` et `h` (dimensions px) pour prévenir le CLS
- **Images manquantes dans git** : vérifier `git status --short | grep images/` avant chaque push
