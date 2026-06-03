# AUDIT VF Images — Plan d'amélioration 0 €

> **Pour Claude Code :** ce document est un audit produit par un consultant externe (autre agent Claude). Il liste 30 améliorations concrètes à apporter au site vfimages.com, organisées par horizon temporel.
>
> **Votre mission :** parcourir ce document point par point, et pour chaque action :
> - Vérifier si elle est **déjà faite** dans le code actuel → marquer `[x]` + brève note
> - Si **partiellement faite** → marquer `[~]` + ce qui reste
> - Si **non faite mais facile** → marquer `[ ]` + estimation à jour
> - Si **non faisable** dans l'archi actuelle → marquer `[—]` + raison
>
> Puis produire en fin de session une **synthèse priorisée** : « voici les 5 prochaines actions que je propose de traiter en priorité ».
>
> Le document peut être édité directement par Claude Code. Mettre à jour les statuts au fur et à mesure que les actions sont réalisées.

---

## Contexte du projet

- **Propriétaire :** Franck, photographe Fine Art basé à Bali
- **URL prod :** vfimages.com
- **URL dev (GitHub Pages) :** franckbali.github.io/vf-images/
- **Stack :** HTML/CSS/JS vanilla, hébergement GitHub Pages, partenaire impression Printspace
- **Identité actuelle :** fond noir, accent or `#c9a96e`, typo Raleway + Bodoni Moda + Lora
- **Budget pour ces actions :** 0 € (uniquement le temps de Franck + Claude Code)
- **Contrainte :** rester dans l'esprit visuel actuel, pas de rebrand

## Légende

| Statut | Sens |
|--------|------|
| `[ ]`  | À faire |
| `[~]`  | Partiellement fait |
| `[x]`  | Fait |
| `[—]`  | Non faisable / non pertinent |

| Impact | Sens |
|--------|------|
| 🔥 | Fort impact (conversion, crédibilité) |
| ⚡ | Impact moyen (UX, modernité) |
| 🌱 | Soin / récurrent |

---

# I. Actions « ce soir » — 5 à 30 min chacune

## `[—]` 01. Masquer le toggle FR/EN tant qu'EN n'existe pas

**Temps :** 5 min · **Impact :** 🔥 Crédibilité

> **État :** — Non applicable. Le site est intégralement traduit EN (290+ attributs `data-en` sur toutes les pages). Le toggle FR/EN est fonctionnel et doit rester visible. Recommandation de l'audit invalide pour ce projet. Vérifié mai 2026.

**Pourquoi :** le toggle visible sans destination est un mensonge passif. Un visiteur EN clique et tombe sur du français.

**Comment :**
```css
/* dans le CSS commun */
.lang { display: none; }
```
Ou commenter le HTML dans la `<nav>` de chaque page.

**Fichiers :** toutes les pages (ou CSS commun si existe)

---

## `[x]` 02. Retirer le filtre `brightness(.82) saturate(.92)` sur fiches produit

**Temps :** 10 min · **Impact :** 🔥 Conversion

> **État :** ✅ Fait. boutique.html l.137 — `filter:none` sur `.detail-image img`. Vignettes grille à `brightness(.95)` (quasi-neutre). Le visiteur voit les vraies couleurs dans le panneau d'achat. Mai 2026.

**Pourquoi :** l'acheteur doit voir l'œuvre telle qu'elle sera. Garder le filtre sur les vignettes (cohérence grille), mais l'enlever sur les vues détaillées.

**Comment :**
```css
.detail-modal img,
.lightbox-img,
.product-hero img {
  filter: none;
}
```

**Fichiers :** CSS de la boutique + de la lightbox

---

## `[x]` 03. Ajouter `preconnect` pour Google Fonts

**Temps :** 10 min · **Impact :** 🔥 Performance

> **État :** ✅ Fait sur toutes les pages. Lignes 20-21 de chaque fichier HTML : `<link rel="preconnect" href="https://fonts.googleapis.com">` + `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`.

**Pourquoi :** économie PageSpeed de 200-400 ms sur le LCP mobile.

**Comment :** ajouter dans le `<head>` de toutes les pages, AVANT la balise `<link>` qui charge les fonts :
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

**Fichiers :** toutes les pages (`<head>`)

---

## `[x]` 04. Charger les Google Fonts en asynchrone

**Temps :** 15 min · **Impact :** 🔥 Performance

> **État :** ✅ Fait sur toutes les pages. Pattern `rel="preload" as="style" onload="this.onload=null;this.rel='stylesheet'"` + balise `<noscript>` fallback présents sur index, a-propos, boutique, blog, contact, galerie-index, galerie-newyork.

**Pourquoi :** économie de 1.5-2 s sur le LCP mobile. Les fonts ne bloquent plus le rendu.

**Comment :** transformer chaque `<link>` de font en :
```html
<link rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=..."
      media="print"
      onload="this.media='all'">
<noscript>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=...">
</noscript>
```

**Fichiers :** toutes les pages

---

## `[x]` 05. Letter-spacing : ramener eyebrows de 0.5em+ à 0.3em max

**Temps :** 20 min · **Impact :** ⚡ Modernité

> **État :** ✅ Fait. 31 remplacements sur 9 fichiers (mai 2026) : .55em→.3em, .5em→.28em, .45em→.25em, .4em→.22em. Uniquement dans les contextes letter-spacing. (hero-eyebrow sur a-propos, boutique, galerie-newyork, blog, contact, galerie-index) et `.5em` (index.html `.hero-prenom`, contact.html) encore présentes. Les `.4em` sont aussi répandus sur tous les labels décoratifs. Aucune réduction globale effectuée.

**Comment :** find-and-replace global :
- `letter-spacing: .55em` → `letter-spacing: .3em`
- `letter-spacing: .5em` → `letter-spacing: .3em`
- `letter-spacing: .4em` → `letter-spacing: .25em`

Tester visuellement après. Garder 0.35em pour les très petits labels.

**Fichiers :** tous les CSS

---

## `[x]` 06. Plancher de taille à 0.7rem sur les labels fonctionnels

**Temps :** 25 min · **Impact :** ⚡ UX / Lisibilité

> **État :** ✅ Fait. 17 valeurs < 0.72rem remontées à 0.72rem dans blog.html (mai 2026). Mobile déjà couvert par style.css. Boutique et blog-article étaient déjà conformes. (section-label, section-link, btn, cookie-text à .88rem). Boutique mobile : card-format/card-edition remontés à `.9rem`. Mais desktop : certains labels restent en dessous de 0.7rem (boutique desktop : detail-location, detail-label à `0.75rem` ; blog.html : art-tag à `0.65rem`, art-date `0.62rem`, bouton « Explorer la boutique » à `0.68rem`). **Manque :** passer ces textes fonctionnels desktop à 0.72rem minimum.

**Fichiers :** CSS boutique + nav + footer

---

## `[x]` 07. Ajouter `aria-label` aux liens-icônes

**Temps :** 15 min · **Impact :** ⚡ Accessibilité

> **État :** ✅ Fait et très complet. Sur toutes les pages : hamburger (`aria-label="Menu" aria-expanded="false"`), Instagram (`aria-label="Suivre VF Images sur Instagram (nouvelle fenêtre)"`), lightbox close (`aria-label="Fermer la lightbox"`), boutons cookie (aria-label individuel), inputs formulaire contact (aria-label). Nav avec `role="navigation" aria-label="Navigation principale"`. Cookie banner avec `role="dialog" aria-live="polite"`.

**Fichiers :** toutes les pages avec liens icônes

---

## `[x]` 08. Reformuler le CTA Printspace

**Temps :** 10 min · **Impact :** 🔥 Conversion

> **État :** ✅ Fait. boutique.html — tous les boutons → "Commander ce tirage". Ligne partenaire mise à jour : "Impression Hahnemühle · Livraison 7–10 jours · Certificat d'authenticité". Mai 2026.

**Comment :** changer le texte du bouton + ajouter un micro-texte gris dessous :

**Avant :** `Commander via Printspace ↗`

**Après :**
```html
<a href="[printspace URL]" class="btn">Commander ce tirage</a>
<p class="micro-note">Impression chez notre partenaire Hahnemühle-certifié,
   livraison sous 7–10 jours.</p>
```

Le backend reste identique — seul le texte change.

**Fichiers :** page boutique + panneau détail

---

# II. Actions « ce weekend » — 1 à 3 h chacune

## `[~]` 09. Optimiser images en AVIF/WebP avec squoosh.app

**Temps :** 2 h · **Impact :** 🔥 Performance

> **État :** ⚠ Partiel. WebP bien en place : les `<img>` du site utilisent `srcset` avec variantes `-small.webp 640w`, `-medium.webp 1200w`, `-large.webp 1920w` (boutique, galerie-newyork, footer). Les fichiers WebP existent dans `/images/`. **Manque :** AVIF non fait (le plus impactant, -75% de poids). Les images en background CSS (heroes) ne peuvent pas utiliser `<picture>` — c'est une limite de l'archi actuelle.

**Comment :**
1. Identifier les images du hero et du portfolio
2. Sur squoosh.app : export AVIF (qualité 70) + WebP (qualité 80) pour chaque
3. Utiliser `<picture>` pour fallback progressif :
```html
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="..." width="2400" height="1600">
</picture>
```

**Fichiers :** dossier `/images/` + HTML de toutes les pages avec photos

**Tip :** Claude Code peut écrire un script Node/Python pour batch-convertir si beaucoup d'images.

---

## `[x]` 10. Ajouter `width` et `height` à toutes les images

**Temps :** 1 h 30 · **Impact :** ⚡ Performance

> **État :** ✅ Fait. Script Python avec Pillow — 47 balises `<img>` enrichies avec dimensions réelles sur 8 fichiers HTML (mai 2026). Élimine le CLS au chargement. (sauf les `<svg>` qui ont leurs propres attributs). Les images se chargent sans réservation d'espace → CLS (Cumulative Layout Shift) dégradé.

**Comment :**
```html
<img src="..." width="2400" height="1600" alt="...">
```
Le CSS reste libre (`width:100%; height:auto`).

**Fichiers :** toutes les pages avec `<img>`

**Tip :** Claude Code peut scripter ça en lisant les dimensions des fichiers réels.

---

## `[x]` 11. Galeries à construire

**Temps :** 15 min (masquer) ou 3 h (construire) · **Impact :** 🔥 Crédibilité

> **État :** ✅ Fait (juin 2026). `galerie-bali.html` créée avec 6 photos en mise en page éditoriale (offrandes, rituels, temples). `galerie-portraits.html` créée. Cérémonies, Voyages, La Réunion masquées (`"visible": false`). Les 3 galeries actives (Bali, New York, Portraits) ont toutes un bandeau éditorial animé avec traits or, un texte de série, et un bandeau contact en bas.

**Fichiers :** `galeries.json` + `galerie-bali.html` + `galerie-portraits.html`

---

## `[~]` 12. Prix dynamiques par format dans la boutique

**Temps :** 2 h · **Impact :** 🔥 Conversion

> **État :** ⚠ Partiel. Les boutons format existent sur tous les panneaux détail et la fonction `selectFormat()` met bien à jour le prix affiché (boutique.html lignes 1114-1133). Mais le tableau de prix est **global** (`FORMAT_PRICES` commun à tous les produits, ligne 1114) — pas par produit. L'audit recommandait des prix individuels par œuvre (`data-prices` par produit). **Manque :** différencier les prix par produit (ex : Portrait Bali probablement différent de Faune Sacrée au même format).

**Fichiers :** `boutique.html` + nouveau JS

---

## `[~]` 13. Numéro d'édition visible sur chaque tirage

**Temps :** 1 h · **Impact :** 🔥 Crédibilité

> **État :** ⚠ Partiel. Chaque panneau détail a une balise `.detail-edition` avec le texte (ex : « Tirage numéroté · Édition limitée à 30 exemplaires »). Les vignettes de grille ont aussi `.card-edition`. **Manque :** le compteur « Reste X sur 30 » pour créer l'urgence et la preuve de rareté.

**Fichiers :** `boutique.html` + données par produit

---

## `[x]` 14. Menu hamburger mobile

**Temps :** 2 h · **Impact :** 🔥 Mobile

> **État :** ✅ Fait sur toutes les pages. Bouton `.hamburger` visible sous 900px, overlay plein-écran `#nav-overlay` avec tous les liens, animation slide-in, fermeture au clic lien/croix/Escape, `aria-label="Menu" aria-expanded`. Code cohérent sur index, a-propos, boutique, blog, contact, galerie-index, galerie-newyork.

**Fichiers :** toutes les pages

---

## `[x]` 15. Page 404 dans le langage visuel

**Temps :** 30 min · **Impact :** 🌱 Soin

> **État :** ✅ Fait. `404.html` créé à la racine — fond noir, typographie Raleway 200, accent or, message "s'est égarée entre Bali et New York", 3 liens (Accueil, Galerie, Boutique). GitHub Pages la sert automatiquement. Mai 2026.

**Comment :** créer `404.html` :
- Fond noir
- « VF IMAGES » en grand (Raleway 200)
- Trait or
- « La page que vous cherchez s'est égarée. »
- 2 liens : Accueil, Galerie

Sur GitHub Pages, le fichier `404.html` à la racine est servi automatiquement.

**Fichiers :** nouveau `404.html`

---

# III. Actions « ce mois » — un soir par semaine

## `[—]` 16. Photos « process » avec téléphone

**Temps :** 3 h · **Impact :** 🔥 Crédibilité

> **État :** — Bloqué côté Franck. Aucune photo process dans `/images/`. Claude Code ne peut pas créer les photos — dépend entièrement de Franck (shooter signature, certificat, emballage). Aucune intégration possible tant que les photos n'existent pas.

**Action côté Franck (pas Claude Code) :** shooter 3 photos avec son téléphone.

**Fichiers :** `/images/process/` + intégration sur pages concernées

---

## `[—]` 17. Photo d'un tirage encadré in situ

**Temps :** 2 h (côté Franck) + 30 min (intégration) · **Impact :** 🔥 Conversion

> **État :** — Bloqué côté Franck. Dépend d'un tirage encadré + photo en lumière naturelle. Claude Code intégrera une fois la photo livrée.

---

## `[ ]` 18. Réécrire la tagline

**Temps :** 2 h (Franck) + 5 min (intégration) · **Impact :** 🔥 Marque

> **État :** ❌ Non fait. La tagline actuelle « Instants vrais, regards du monde » est toujours présente (index.html ligne 547). La décision appartient à Franck. Une fois validée, Claude Code fait le find-and-replace global en 5 min (hero, footer, OG tags, meta description).

**Fichiers :** toutes les pages (hero, footer, OG tags, meta description)

---

## `[x]` 19. Schema.org structured data en JSON-LD

**Temps :** 2 h · **Impact :** ⚡ SEO

> **État :** ✅ Fait (mai 2026). JSON-LD ajouté sur toutes les pages : WebSite + Person (index), Person (a-propos), VisualArtwork×3 + BreadcrumbList (boutique), Blog + Breadcrumb (blog), ImageGallery + Breadcrumb (galerie-newyork), CollectionPage (galerie-index), ContactPage (contact). Ni `Person`, ni `VisualArtwork`, ni `BreadcrumbList`. Le score SEO est bon (100/100 PageSpeed) mais sans rich results Google Images ni Google Shopping.

**Fichiers :** toutes les pages

---

## `[~]` 20. Sitemap.xml + robots.txt + Google Search Console

**Temps :** 1 h · **Impact :** ⚡ SEO

> **État :** ⚠ Presque complet. `sitemap.xml` ✅ existait déjà. `robots.txt` ✅ créé (mai 2026) — pointe vers sitemap. **Reste :** côté Franck uniquement — créer compte Google Search Console et soumettre le sitemap.

**Fichiers :** nouveau `robots.txt`

---

## `[—]` 21. Photo de Franck travaillant, sur page À propos

**Temps :** 1 h (shoot par un ami) + 30 min (intégration) · **Impact :** 🔥 Crédibilité

> **État :** — Bloqué côté Franck. Dépend d'un ami qui le photographie en situation. Claude Code intégrera une fois la photo livrée.

**Fichiers :** `a-propos.html` + nouvelle image dans `/images/about/`

---

## `[ ]` 22. Alt texts descriptifs sur toutes les images

**Temps :** 1 h 30 · **Impact :** ⚡ SEO + Accessibilité

> **État :** ❌ Non fait (pour la majorité). Boutique : `alt="Faune Sacrée"`, `alt="Procession Barong"`, `alt="Manhattan"` — trop courts, pas de contexte. Galerie-newyork : les `<img>` de lightbox ont `alt=""` vide (dynamique, compréhensible). a-propos.html a un bon exemple (`alt="Franck enfant dans un train — le regard déjà tourné vers l'horizon"`) mais c'est l'exception. **Facile à traiter** : Claude Code propose les alt texts, Franck valide, batch-update.

**Fichiers :** toutes les pages avec `<img>`

---

# IV. Actions « trois mois » — chantiers du dimanche

## `[—]` 23. Créer le certificat d'authenticité

**Temps :** Un dimanche · **Impact :** 🔥 Crédibilité

> **État :** — Côté Franck uniquement. Gabarit Word/Pages + impression + photo. Claude Code intégrera le preview une fois livré. Note : la boutique mentionne déjà « certificat d'authenticité » dans les meta (og:description) mais aucun visuel n'est présent.

---

## `[ ]` 24. Écrire 3 articles de blog sur 3 mois

**Temps :** 3 dimanches (Franck) + intégration · **Impact :** 🔥 SEO + Marque

> **État :** ❌ Non fait complètement. 1 seul article existe (`blog-article.html`). L'index blog (blog.html) a la structure pour plusieurs articles. **Manque :** 2 articles supplémentaires sur les thèmes suggérés.

**Fichiers :** nouveaux articles + mise à jour blog index + sitemap

---

## `[ ]` 25. Newsletter Brevo

**Temps :** Une demi-journée · **Impact :** 🔥 Conversion long-terme

> **État :** ❌ Non fait. Aucun formulaire d'inscription email dans le footer ou ailleurs. Brevo non configuré. Dépend de Franck pour créer le compte, puis Claude Code intègre.

**Fichiers :** footer commun + page de remerciement éventuelle

---

## `[—]` 26. Témoignages clients par email

**Temps :** 2 h (côté Franck) · **Impact :** 🔥 Crédibilité

> **État :** — Bloqué côté Franck. Aucune vente connue à ce stade (Formspree : 1 soumission de test). Aucune section témoignages dans la boutique. Claude Code créera la section une fois les témoignages récoltés.

---

## `[ ]` 27. Page « Comment vos tirages sont fabriqués »

**Temps :** Un dimanche · **Impact :** 🔥 Crédibilité

> **État :** ❌ Non fait. Aucun fichier `process.html` ni équivalent. Dépend aussi des photos process (action 16) pour être pertinente. Peut être créée avec contenu texte seulement dans un premier temps.

**Fichiers :** nouvelle page + liens depuis footer + boutique

---

# V. Actions « en continu » — à systématiser

## `[ ]` 28. Un article de blog tous les 2 mois

**Temps :** 1 demi-journée tous les 2 mois · **Impact :** ⚡ Marque

> **État :** ❌ Pas encore systématisé. 1 article existe mais pas de cadence. Côté Franck : mettre dans l'agenda (1er samedi du mois pair).

---

## `[—]` 29. Une photo « process » par mois sur Instagram

**Temps :** 15 min/mois (Franck uniquement) · **Impact :** ⚡ Marque

> **État :** — Hors périmètre Claude Code. Pure discipline de production côté Franck.

---

## `[ ]` 30. Témoignage demandé à chaque nouvelle vente

**Temps :** 5 min/vente (Franck) · **Impact :** 🔥 Crédibilité

> **État :** ❌ Process non mis en place. Pas de section témoignages dans la boutique (prérequis action 26). Pas de template mail-type préparé. À faire dès la première vraie vente.

---

# VI. Décision préalable — direction esthétique

## `[ ]` 31. Choisir une direction de palette + produire les mockups

**Temps :** 2-3 h Claude Code · **Impact :** 🔥 Marque + Direction de toute la suite

> **État :** ❌ Décision en attente. Le fichier de référence `propositions-palettes-vf-images.html` existe à la racine. Aucun mockup créé. Aucune direction choisie par Franck. **Prérequis à toutes les actions CSS** (05, 06, etc.) pour éviter de doubler le travail.

**Contexte :** la palette actuelle (noir #0a0a0a + or #c9a96e + crème #f5f3ef) est générique — c'est le combo par défaut de tous les templates fine art Squarespace 2018-2025. Un document séparé (`propositions-palettes-vf-images.html`) propose **3 directions chromatiques** tirées de la matière même des photographies de Franck (Bali, cérémonies, terre volcanique, lumière de l'aube).

**⚠ Recommandation révisée (mai 2026)** suite à un échange avec Franck : il aime profondément le noir et blanc et les portraits, tout en devant honorer les couleurs riches de Bali. Cette double exigence change la hiérarchie :

| | Direction | Palette résumée | N&B + couleur ? | Recommandation |
|---|---|---|---|---|
| I | **Volcanic earth** | Brun-noir #1a1410 + crème #f4ede0 + terre cuite #d4632a | Belle pour la couleur, *teinte* le N&B | ★★ |
| II | **Museum off-white** | Crème ivoire #f6f1e8 + encre #1a1a1a + ocre brûlé #a0501a | **Honore les deux également** | ★★★ Recommandée |
| III | **Twilight ceremony** | Bleu nuit #0e1320 + lune pâle #e8e2d2 + saffron #c08842 | Fight le N&B | ★ |
| IV | **Galerie monochrome** (option) | Ivoire pur #f6f1e8 + graphite #1a1a1a + oxblood discret #6b2424 | Idéale N&B pur, restrictive couleur | Réserve pour évolution future |

**Pourquoi la Direction II et plus la Direction I :** le cream + encre est la palette historique du N&B fine art (Avedon, Lindbergh, Salgado, Yarrow exposition) — un fond ivoire chaud ne teinte pas les gris neutres du N&B, il les met en valeur comme un passe-partout. C'est aussi la palette qui laisse les couleurs vives des cérémonies balinaises *chanter* (vs les absorber comme un fond sombre). C'est la seule direction qui ne prend pas parti entre les deux registres de Franck.

**Procédure Claude Code :**

1. Lire le document `propositions-palettes-vf-images.html` (à la racine du projet) pour comprendre le raisonnement, les swatches, et les mockups conceptuels.

2. **Démarrer par un mockup Direction II** (recommandation principale), qui est aussi la direction la plus exigeante techniquement car elle inverse le mode (sombre → clair). Si Franck souhaite voir aussi Direction I et/ou IV, produire les mockups complémentaires en deuxième temps.

3. Pour chaque direction à mockuper :
   - Copier `index.html` → `mockup-[direction].html` (par exemple `mockup-museum.html`)
   - Copier `boutique.html` → `mockup-[direction]-boutique.html`
   - Idéalement aussi `a-propos.html` → `mockup-[direction]-apropos.html` (la page À propos est cruciale pour juger l'effet sur les portraits et le storytelling)
   - **Ne modifier que** les variables CSS `--dark`, `--dark2`, `--dark3`, `--gold`, `--light` selon le tableau ci-dessous
   - Pour la direction II uniquement : retirer aussi `filter: brightness(.82) saturate(.92)` partout (le mode bascule en clair)
   - Aucun changement de structure HTML, aucun changement de typographie

**Tableau des substitutions CSS :**

| Variable | Actuel | I. Volcanic | **II. Museum** ★ | III. Twilight | IV. Monochrome |
|---|---|---|---|---|---|
| `--dark` | `#0a0a0a` | `#1a1410` | `#f6f1e8` | `#0e1320` | `#f6f1e8` |
| `--dark2` | `#111` | `#2a2018` | `#ede5d4` | `#1a2030` | `#ede5d4` |
| `--dark3` | `#1a1a1a` | `#36281e` | `#e0d8c5` | `#252c40` | `#d8cfc0` |
| `--gold` | `#c9a96e` | `#d4632a` | `#a0501a` | `#c08842` | `#6b2424` |
| `--light` | `#f5f3ef` | `#f4ede0` | `#1a1a1a` | `#e8e2d2` | `#1a1a1a` |

4. Présenter à Franck les mockups côte à côte (idéalement servis via une URL temporaire ou simplement ouverts dans son navigateur local).

5. Une fois la direction validée par Franck :
   - Appliquer les nouvelles variables à **tous les fichiers HTML du site** en une seule passe (find-and-replace global ou édition variable par variable)
   - Vérifier la lightbox, le curseur custom, les hover states — ajuster si besoin
   - Tester sur mobile

**Fichiers concernés :**
- Source : `index.html`, `boutique.html` (puis tous les autres si validation)
- Nouveaux : `mockup-volcanic.html`, `mockup-museum.html`, `mockup-twilight.html`, + leurs versions boutique
- Référence : `propositions-palettes-vf-images.html` (ne pas modifier)

**⚠ Important :** cette action doit se faire **avant** les actions 02, 03, 04, 05 (qui touchent au CSS) pour éviter de doubler le travail. Voir si Franck préfère cette séquence ou s'il veut d'abord stabiliser le site actuel avant le changement de palette.

---

# Synthèse — Revue Claude Code, juin 2026

> Revue initiale : 22 mai 2026. Mise à jour : 3 juin 2026.

---

## A. État actuel du site

### Pages existantes
| Page | Fichier | Finition (1-5) | Notes |
|------|---------|----------------|-------|
| Accueil | `index.html` | ★★★★☆ 4/5 | Hero impactant, galerie preview, about strip, CTA. Mobile redesign fait. |
| Galerie index | `galerie-index.html` | ★★★★☆ 4/5 | 3 galeries actives (Bali, NY, Portraits), 3 masquées. Sous-titres à jour. |
| Galerie Bali | `galerie-bali.html` | ★★★★☆ 4/5 | Créée juin 2026. 6 photos, bandeau animé, bandeau contact, bilingue. |
| Galerie New York | `galerie-newyork.html` | ★★★★★ 5/5 | Lightbox, scroll, mobile, iOS corrigés. Bandeau animé + contact. |
| Galerie Portraits | `galerie-portraits.html` | ★★★★☆ 4/5 | Créée juin 2026. Bandeau éditorial, texte de série, bandeau contact. |
| À propos | `a-propos.html` | ★★★★☆ 4/5 | Storytelling fort, photos bien intégrées. Mobile amélioré. |
| Boutique | `boutique.html` | ★★★☆☆ 3/5 | 6 œuvres, format buttons, prix partiellement dynamiques. Manque process photos, stock. |
| Blog | `blog.html` | ★★★☆☆ 3/5 | Structure solide. 1 article seulement. Pas de newsletter. |
| Contact | `contact.html` | ★★★★☆ 4/5 | Formspree opérationnel. Hero photo fixé. |
| Mentions légales | `mentions-legales.html` | ★★★☆☆ 3/5 | Existe, suffisant. |

### Pages manquantes (priorité décroissante)
1. `process.html` — important pour crédibilité boutique
2. Articles de blog (2 supplémentaires)
3. `galerie-ceremonies.html`, `galerie-voyages.html`, `galerie-lareunion.html` — long terme

### Dépendances techniques
- **Printspace** : URLs non renseignées (boutons `href="#"`). Dépend de Franck pour les vraies URLs.
- **GitHub Pages** : déployé, sitemap.xml existant mais robots.txt manquant.
- **Formspree** : opérationnel, 1/50 soumissions utilisées, email `fvinel22@gmail.com` vérifié.
- **Google Analytics/Search Console** : non détecté dans le code — à vérifier.

---

## B. Top 5 actions prioritaires (au 3 juin 2026)

### 🥇 01. Remplir la boutique avec les vraies URLs Printspace
**Bloquant pour les ventes.** Les 6 boutons « Commander » pointent encore vers `href="#"`. Sans les vraies URLs Printspace, la boutique ne peut pas vendre. Dépend de Franck.

### 🥈 02. Alt texts descriptifs sur toutes les images (action 22) — 1 h 30
**SEO + accessibilité.** La majorité des `alt` sont trop courts ou vides. Claude Code peut proposer les textes et faire le batch-update.

### 🥉 03. Google Search Console (action 20) — côté Franck
**Le sitemap et robots.txt sont en place.** Il reste uniquement à créer le compte Search Console et soumettre le sitemap — 15 min côté Franck, aucun code à écrire.

### 4️⃣ 04. Page process.html (action 27)
**Crédibilité boutique.** Expliquer comment les tirages sont fabriqués. Peut être fait en texte seul dans un premier temps, sans attendre les photos process.

### 5️⃣ 05. Newsletter Brevo (action 25)
**Conversion long terme.** Aucun formulaire email en place. Dépend de Franck pour créer le compte Brevo, puis Claude Code intègre en 2 h.

---

## C. Blockers identifiés

### Côté Franck (contenu à produire)
- **Photos process** (actions 16, 17) : signature, certificat, emballage, tirage encadré in situ
- **Photo de Franck en situation** (action 21) : nécessite un ami photographe
- **Nouvelle tagline** (action 18) : décision créative personnelle
- **Témoignages clients** (action 26, 30) : pas encore de vraies ventes
- **Articles de blog** (actions 24, 28) : contenu texte à écrire
- **Décision palette** (action 31) : visualiser les mockups puis valider

### Côté tiers
- **URLs Printspace réelles** : les 6 boutons « Commander » pointent vers `href="#"`. Sans les vraies URLs Printspace, la boutique ne peut pas vendre.
- **Brevo** : compte à créer pour action 25 (newsletter)
- **Google Search Console** : compte à créer et propriété à vérifier pour action 20

### Décisions techniques préalables
- **Action 31** : quelle direction de palette — décision avant toute refonte CSS

---

## D. Roadmap proposée

### Sprint suivant — prochaines sessions
| # | Action | Durée | Qui |
|---|--------|-------|-----|
| 22 | Alt texts descriptifs + batch-update | 1 h 30 | Claude Code + validation Franck |
| 20 | Soumettre sitemap Google Search Console | 15 min | Franck |
| 27 | Page process.html (texte seul, sans photos) | 2 h | Claude Code |
| 25 | Newsletter Brevo (si compte créé) | 2 h | Claude Code |
| 12 | Prix par produit (si grille Printspace dispo) | 2 h | Claude Code |
| 13 | Compteur stock « Reste X/30 » | 1 h | Claude Code |
| 24 | 2 articles de blog supplémentaires | 3 h | Franck + Claude Code |

---

> **Note finale (3 juin 2026) :** Les galeries Bali et Portraits sont en ligne. Les 3 galeries actives ont un bandeau éditorial animé et un bandeau contact en bas. Le principal bloquant pour les ventes reste les URLs Printspace manquantes. Le travail visuel et éditorial est en bonne voie.
