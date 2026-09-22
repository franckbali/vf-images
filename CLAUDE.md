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
- **Paiement** : Stripe (compte production, France/N26) — Stripe Checkout Sessions via `/api/create-checkout.js` (les anciens Payment Links restent pour les photos non encore migrées)
- **Impression** : Creativehub/The Printspace (UK) pour les giclées Europe ; WhiteWall pour les grands formats Collector (manuel)
- **Registrar DNS** : Namecheap
- **Analytics** : Umami (ID `1e9107e5-f1ec-4acc-b2d3-a44932d9fcf1`)
- **Formulaire contact** : Formspree (ID `mwvybbrz`)
- **API Creativehub** : `https://api.creativehub.io` (clé stockée en privé, hors dépôt)

Pages existantes : `index`, `boutique`, `galerie-index`, `galerie-bali`, `galerie-mekotek`, `galerie-newyork`, `galerie-portraits`, `a-propos`, `blog`, `blog-article` (Melasti), `blog-article-mekotek` (Mekotek), `blog-article-cremation` (Ngaben), `contact`, `mentions-legales`.

---

## 3. Structure des galeries

7 galeries configurées dans `galeries.json` (fichier édité par le CMS) :
Bali · Mekotek · Cérémonies · Voyages · Portraits · New York · La Réunion.

`galerie-index.html` lit `galeries.json` dynamiquement et génère les vignettes.
Pages HTML existantes : Bali ✅ · Mekotek ✅ · New York ✅ · Portraits ✅ · Cérémonies ✗ · Voyages ✗ · La Réunion ✗.

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
- `vfimages.com` = domaine primaire · `www` → redirection 308 (vérifié actif le 20 sept. 2026)
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
- Certificats d'authenticité disponibles sur Creativehub
- Signature : `signature-noir.png` + `signature-noir.svg`
- `catalogue.json` : source de vérité prix/papier/variant Creativehub — seul fichier à modifier lors d'un changement tarifaire

**Boutique / Creativehub — nouvelle plateforme `sell.creativehub.io` (28 juil. 2026)**
- 4 produits créés dans Creativehub : `portrait-bali-012`, `portrait-bali-369`, `hummingbird-costa-rica-001`, `offrandes-bali-002` — bordure bottom-weighted (marge de signature), signature reproduite auto (`FrancVinel_Signature.png`), numérotation, certificat design « Clean » (2,44 € + TVA, sur éditions limitées uniquement), logo `VF3-logo-noir.svg`
- `catalogue.json` : **plus aucun placeholder** — vrais SKU Creativehub (`V-XXXX`) par format, prix **95 / 190 / 690 €**, édition limitée **15 exemplaires** (format 100×70)
- `boutique.html` : les 2 nouvelles photos (Colibri · Costa Rica, Offrandes · Bali) intégrées à la grille + fiches détail ; flux Stripe Checkout branché (`handleCheckout` → `/api/create-checkout`) pour ces **4 photos**
- **Compteur « X restants » = FAIT (18 sept. 2026)** : `api/edition-status.js` calcule le sold count en direct via l'API Orders Creativehub (source de vérité — plus de compteur statique à maintenir à la main), avec repli sur `catalogue.json` si l'API est indisponible, cache CDN 5 min. Câblé sur les 2 pages certificat existantes (`editions/portrait-bali-012.html`, `editions/portrait-bali-369.html`) ; générique par photo donc prêt pour de futures pages certificat (offrandes, hummingbird pas encore créées).
- Fix honnêteté : mention « Certificat d'authenticité » retirée des formats en édition ouverte, affichée uniquement sur le format limité
- Papier par défaut des 4 produits : Hahnemühle Photo Rag (choix par-photo à affiner, cf. section 5)

**Flux de commande = AUTOMATISÉ ET VALIDÉ (18 sept. 2026) pour les 4 photos connectées**
Client paie via Stripe Checkout → `api/stripe-webhook.js` (event `checkout.session.completed`) transmet la commande à l'API Creativehub → Printspace imprime et expédie. **Test d'achat réel réussi le 18 sept.** : commande Creativehub `EC-AA98978` créée automatiquement (origine `api`) suite à un vrai paiement Stripe. Chaîne complète validée de bout en bout. Les autres photos restent en flux manuel.
- Bug corrigé au passage (18 sept.) : `catalogue.json` stockait le SKU Creativehub (`V-XXXX`, affiché dans leur UI) au lieu du vrai `variant_id` (UUID interne) attendu par `items[].variant_id` de leur API — confirmé par leur support. Les 12 formats corrigés, l'ancien SKU gardé dans un champ `creativehub_sku` pour référence.

**Galeries**
- `galerie-bali.html` : 9 photos au format naturel (no crop, height:auto), système `.block.nat.lg/md/full`. Titres EN ajoutés sur les 9 (data-title-en, géré par setCaption() + la légende sous chaque photo — pattern à répliquer si une autre galerie a le même souci). 3 photos ajoutées le 21 sept. (temple-bali-005/006, bali-dupa-001) avec des titres distincts pour ne pas ajouter d'homonymes ; l'un des 2 anciens "Temple · Bali" (temple-bali-004) retitré "La Source Sacrée · Bali" — reste "Rituels · Bali" ×3 en homonymes non tranchés.
- `galerie-portraits.html` : titres EN ajoutés sur les 12 photos (même pattern data-title-en).
- `galerie-newyork.html` : galerie complète, lightbox crossfade
- `galerie-portraits.html` : galerie complète avec texte éditorial
- Toutes les galeries : lightbox corrigée (plus de scroll-jump iOS — suppression totale de `position:fixed` sur le body)
- Panneau « La série » supprimé des 3 galeries (Bali, New York, Portraits)
- Bandeaux éditoriaux (`.serie-bandeau`) : traits animés au scroll + texte Raleway 200 italic dans les 3 galeries
- Bandeau contact bilingue FR/EN ajouté en bas des 3 galeries
- Accueil (`index.html`) : masonry desktop (CSS column-count:3) + flex 2 colonnes alternées mobile, CLS prévenu (w/h dans `accueil.json`)

**Blog / Journal**
- `blog-article.html` : article Melasti (texte complet, hero, police unifiée, section vidéo retirée)
- `blog-article-mekotek.html` (17 sept. 2026) : remplace « Cari feu de bois »/La Réunion, supprimé. Récit intact (texte de Fra, FR **et EN**, traduit intégralement), 16 photos `bali-mekotek-0XX`, bloc factuel « En pratique » bilingue, galerie dédiée `galerie-mekotek.html` (pas le slot « Cérémonies », resté dormant). 301 `/blog-article-reunion` → nouvelle URL dans `vercel.json`.
- `blog-article-cremation.html` (21 sept. 2026) : article Ngaben (crémation hindoue-balinaise), texte de Fra traduit FR/EN, 16 photos `bali-cremation-0XX` intégrées dans le corps (solo plein cadre + 1 diptyque de 2 photos au même format — éviter de marier portrait+paysage dans un diptyque, ça force un recadrage moche via `object-fit:cover`). Mis en avant comme dernier article sur `blog.html` (hero + carte featured), Mekotek passe en 2e position. Pas de lien boutique (photos non connectées à un produit).
- Page `blog.html` : 3 articles en grand format featured (Ngaben, Mekotek, Melasti), alternance gauche/droite
- Article « Réflexion » retiré

**Design / refonte visuelle (sept. 2026)** — cf. mémoire `hero-refonte-ouvertures-page`, `systeme-or-cream-rarete-cta-nav`, `nettoyage-mensonges-passifs`
- **Système or** : l'or (`#c9a96e`) réservé à 3 rôles (rareté / CTA-intention d'achat / navigation+accessibilité) ; tout le décoratif → `--cream-warm` (#dcd4c0) / `--cream-soft`. Appliqué sur les 13 pages + `style.css`.
- **Heros par fonction de page** — 5 ouvertures /6 faites : accueil (photo plein cadre + [VF Images / Franck Vinel] centré bas + bandeau verre fumé « Tirages Fine Art · Éditions limitées · Bali & le monde » + « Voir les tirages → » flush au bas), boutique (bandeau court + compteur), 3 galeries (diptyque texte/photo, « Collection · 0X », 1 mot du titre en or), à-propos (typo seule, « Bali, depuis 2022»), journal (éditorial : titre + vignette du dernier article). **Reste : Contact** (Fra aime la page telle quelle, ne pas y toucher sans redemander).
- **Fix `vh` → `svh`** sur toutes les hauteurs de viewport des 13 pages (bug Safari iOS barre d'adresse). `style.css?v=14`.
- `mentions-legales.html` : réécrite pour refléter la réalité (société indonésienne, pas d'entité française) + **version anglaise complète** ajoutée (data-fr/data-en + setLang mis à niveau pour gérer le HTML). Reste à Fra : raison sociale + adresse + NIB de la société.
- **Corrections audit (10 sept.)** : cohérence édition « 15 exemplaires » (editions/ twitter:desc + 4 labels boutique), bandeau qualité boutique « Certificat d'authenticité » → « Tirage numéroté » (le certificat n'existe que sur le format limité). `vercel.json` : le bloc `headers` ciblait `/(.*).html` → ne matchait AUCUNE URL cleanUrls (aucun en-tête de sécurité ni cache en prod) — corrigé : sécurité sur `/(.*)`, cache HTML sur `source` sans point. Liens internes : 211 `href="*.html"` → extensionless sur les 13 pages + editions/ (cohérence canonical/sitemap, plus de saut 301).

---

## 5. ÉTAT — Ce qu'il RESTE à faire

### Front-end / galeries
1. **Créer les pages galeries manquantes** : Cérémonies, Voyages/Bolivie, La Réunion (actuellement `visible:false` dans `galeries.json`)
2. **Vérifier les visuels covers** dans `galeries.json` : confirmer que `image_cover` pointe sur les bonnes vraies photos

### Commerce / print
0. **Certificat d'authenticité numérique — FAIT ET VALIDÉ (18 sept. 2026).** Upstash Redis (Vercel Marketplace, plan Free). Le webhook Stripe génère un code `VFC-XXXXXXXX` après chaque commande Creativehub réussie ; page publique `/certificat/[code]` (`api/certificat.js`, rendue serveur, design clair imprimable, bilingue via `?lang=`) ; lien affiché sur la page de succès de la boutique (`api/certificat-lookup.js`, polling ~20s). Validé avec les vraies données de la commande EC-AA98978 (nom acheteur, papier, format tous corrects). Textes du site mis à jour (boutique + mentions légales) pour l'annoncer officiellement. **Reste, non bloquant** : email Resend automatique avec le lien (pour l'instant affiché seulement sur la page de succès) ; PDF joint ; QR code sur l'encart Creativehub.
7. **Changer le papier par photo** dans Creativehub — Offrandes/"La Conversation Silencieuse" est **fait** : papier réglé sur Canson Baryta côté Creativehub, `catalogue.json` et `boutique.html` corrigés en conséquence le 18 sept. (ils affichaient encore l'ancien Hahnemühle générique). Reste les 2 portraits N&B et Colibri (toujours Hahnemühle Photo Rag par défaut — à confirmer si Fra veut les différencier).
8. **Boutique = 4 produits connectés** (portrait-012, portrait-369, hummingbird, offrandes-002). Les 5 fiches à bouton mort (Faune Sacrée, Barong, Rituels/Offrandes, Manhattan, Fenêtre) ont été **retirées** le 10 sept. (commit boutique « petite mais prête »). Pour réintégrer une photo : Fra crée le produit Creativehub (dupliquer un existant pour garder les réglages) → me passe fichier JPG + SKU par format + papier + titre/lieu → je refais carte + fiche détail + `catalogue.json` + `handleCheckout`. Images encore dans `images/` (faune-sacree, procession-barong, rituels-offrandes, manhattan, fenetre-sur-locean).
9. **Éditions Collector via Whitewall** (EN PAUSE) : toggle Fine Art/Collector dans la fiche détail, bouton = formulaire contact pré-rempli (pas d'API Whitewall), badge sur la vignette. Prérequis : compte Whitewall Pro, liste des œuvres, specs (ex. bali-369)
10. **Suivi de commande après paiement — idée, à affiner plus tard.** Aujourd'hui le client ne voit que le reçu Stripe + le lien du certificat numérique ; aucune visibilité sur la production/expédition Creativehub. Leur doc API confirme que les webhooks de statut de commande ne sont **pas encore actifs** côté Creativehub (`GET /v1/orders/{order_id}` existe pour interroger le statut, mais rien ne nous notifie automatiquement). Piste : script qui poll cette API et alerte Fra (ou le client via Resend) au changement de statut. Non bloquant, faible volume actuellement.
11. Créer le PDF certificat d'authenticité + QR codes éditions limitées
12. Générer la version or (`#c9a96e`) de la signature pour les certificats

### Structure / cohérence
13. **Galeries** : les 3 pages galerie (bali/newyork/portraits) lisent maintenant `galeries.json` au chargement pour synchroniser **le titre h1** (fetch ajouté 2 sept.). ⚠️ Le script reconstruit le titre via DOM (`createElement`) pour préserver le `<span class="title-accent">` de l'or — **si une 4e page galerie est créée, appliquer le même pattern**. Le texte éditorial (`.serie-bandeau`) reste volontairement statique par page.

### Contenu — décisions en attente de Fra
- **Titres des photos de galeries EN — FAIT (20 sept. 2026)** : `data-title-en` ajouté sur `galerie-bali` (9 photos) et `galerie-portraits` (12 photos), le toggle FR/EN traduit maintenant aussi les légendes et le titre de la lightbox. New York n'avait pas le problème (titres déjà en anglais).
- **Œuvres homonymes** : `galerie-bali` "Temple · Bali" réduit de ×2 à ×1 (20 sept., l'autre retitré "La Source Sacrée · Bali"). Reste : "Rituels · Bali" ×3 dans `galerie-bali`, et `boutique` deux "Portrait · Bali" (012 & 369) — non tranchés.
- **`mentions-legales.html`** : raison sociale + adresse + NIB **FAIT (18 sept.)** — PT Happy Sunrise Family, Jalan Bidadari IIA, Kerobokan Kelod, Kuta Utara, Badung, Bali, NIB 2306220091801. Reste à vérifier : le compte Stripe marqué « France » vs société indonésienne.
- **Prix en hero d'accueil** (« À partir de 95 € ») : positionnement valeur vs désirabilité — non tranché, non implémenté.
- **Champ société à la commande — FAIT (18 sept.)** : `api/create-checkout.js` ajoute un `custom_field` Stripe optionnel « Société (pour facture, optionnel) » — capté pour une future facturation pro, pas de génération de facture automatique pour l'instant.

### SEO / contenu
18. **www → vfimages.com — vérifié FAIT (20 sept.)** : redirection 308 confirmée active, rien à faire côté Vercel dashboard.
19. **Resoumettre le sitemap** dans Google Search Console : `https://vfimages.com/sitemap.xml` — nécessite la connexion de Fra à son compte Google, je ne peux pas le faire à sa place.
21. Écrire d'autres articles de blog (le hero du Journal met en avant le dernier automatiquement) — Ngaben publié le 21 sept., prochain sujet non défini.

### Décisions déjà tranchées
- Migration Shopify : **rejetée** (abandonnerait le site custom, le SEO, Sveltia CMS, le design noir & or)
- Panneau « La série » : **supprimé**, remplacé par les bandeaux éditoriaux toujours visibles
- **Automatisation Stripe → Creativehub : FAITE ET VALIDÉE** — le webhook `api/stripe-webhook.js` existe, est branché pour 4 photos, et a été testé avec un vrai achat le 18 sept. 2026 (commande Creativehub `EC-AA98978` créée automatiquement)

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
- **Agir directement, sans demander confirmation à chaque modification** (édits, suppressions de fichiers trackés git, commits, push sur `main`) — décidé le 3 sept. 2026 : "je ne vais jamais refuser, fais les changements de toi-même". Rendre compte après coup plutôt que de demander avant.
- Ne s'arrêter pour demander que si ça mérite vraiment son avis : une vraie décision (contenu éditorial, choix entre options concurrentes), ou quelque chose d'irréversible hors git / touchant à l'argent ou aux identifiants.
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
- **Worktree `.claude/worktrees/wizardly-montalcini-0056ce`** : branche à ~270 commits DERRIÈRE `main` (dernier commit mai 2026) — **rien à merger**, `main` l'a dépassée. Ne jamais relancer ce merge.
- **Signature « reproduite », pas « manuscrite »** : Fra est à Bali, l'impression se fait en Europe → il ne signe jamais physiquement. La signature est incrustée à l'impression par Creativehub. Ne pas laisser croire à une signature à l'encre dans les textes légaux/marketing.
- **`perl -i` sur les fichiers du repo = INTERDIT si le remplacement contient de l'accentué / des échappements Unicode** — a corrompu l'encodage UTF-8 de boutique.html (× → Ã, é → Ã©, ligne perdue). Utiliser Python avec `encoding='utf-8'` explicite ou l'outil Edit, et vérifier `'Ã' not in content` avant de commit.
- **Règles hero mobile dans `style.css` PARTAGÉ** : avant de retoucher un hero, chercher le nom de classe dans `style.css` (pas seulement le `<style>` inline de la page) — il y a des règles `@media(max-width:900px) .hero-home ... !important` qui écrasent silencieusement. Idem `.hero-tagline/.hero-fineart/.hero-eyebrow/.hero-prenom` (partagées entre a-propos/blog/boutique).
- **`animation:fadeUp` + `transform:translateY(-50%)`** sur le même élément = centrage cassé (fadeUp finit sur `translateY(0)`). Centrer via flex du parent, pas via transform sur un élément animé.
- **Statut juridique** : Fra n'a AUCUNE entité française (société indonésienne, fiscalité en Indonésie). Le droit FR/UE ne le lie pas — ne pas remettre « droit français / SIRET / CNIL » dans les pages légales. Cf. mémoire `statut-juridique-fiscal-fra`.
- **Captures d'écran navigateur (outil Browser)** peuvent montrer un rendu figé/obsolète (image absente, ancienne position) alors que le code est bon — vérifier via mesures DOM (`getBoundingClientRect`, `getComputedStyle`) et/ou une tab fraîche avant de conclure à un bug.
- **Logo : ne pas confondre les variantes de couleur.** `images/logo-vf3.svg` = clair (`#f5f3ef`, pour fond sombre nav/footer du site). `images/logo-vf3-noir.svg` = noir (`#1a1a1a`, pour les certificats Creativehub sur papier blanc, hors site). Le fichier nav/footer avait été régénéré par erreur (10 sept.) depuis la variante noire → logo quasi invisible sur fond sombre pendant plusieurs jours, corrigé ensuite en repartant de `logo-vf3.svg`. Fichier actuel sur le site : `images/logo-vf3-v3.svg` (allégé, `#f5f3ef`). Avant toute regénération : vérifier la couleur `fill:` du .svg source.
