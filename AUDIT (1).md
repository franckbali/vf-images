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

**Pourquoi :** le toggle visible sans destination est un mensonge passif. Un visiteur EN clique et tombe sur du français.

**Comment :**
```css
/* dans le CSS commun */
.lang { display: none; }
```
Ou commenter le HTML dans la `<nav>` de chaque page.

**Fichiers :** toutes les pages (ou CSS commun si existe)

> **Note (mai 2026) :** Non applicable — le site est entièrement traduit en anglais. Toutes les pages contiennent 290+ attributs `data-en` et le JS de traduction est fonctionnel. Le toggle FR/EN est légitime et doit rester visible.

---

## `[x]` 02. Retirer le filtre `brightness(.82) saturate(.92)` sur fiches produit

**Temps :** 10 min · **Impact :** 🔥 Conversion

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

> **Note (mai 2026) :** Fait — `.detail-image img { filter: none; }` appliqué dans boutique.html (remplace l'ancien `filter: brightness(.78)`).

---

## `[x]` 03. Ajouter `preconnect` pour Google Fonts

**Temps :** 10 min · **Impact :** 🔥 Performance

**Pourquoi :** économie PageSpeed de 200-400 ms sur le LCP mobile.

**Comment :** ajouter dans le `<head>` de toutes les pages, AVANT la balise `<link>` qui charge les fonts :
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

**Fichiers :** toutes les pages (`<head>`)

> **Note (mai 2026) :** Fait — 2 balises `preconnect` présentes dans le `<head>` de toutes les pages (index, boutique, a-propos, blog, contact, galerie-index, galerie-newyork).

---

## `[x]` 04. Charger les Google Fonts en asynchrone

**Temps :** 15 min · **Impact :** 🔥 Performance

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

> **Note (mai 2026) :** Fait — toutes les pages utilisent `rel="preload" as="style" onload="this.onload=null;this.rel='stylesheet'"` avec `<noscript>` fallback. Déjà en place avant cette session.

---

## `[x]` 05. Letter-spacing : ramener eyebrows de 0.5em+ à 0.3em max

**Temps :** 20 min · **Impact :** ⚡ Modernité

**Pourquoi :** le letter-spacing 0.5em+ est un tic typographique 2017-2020. Trop large = daté.

**Comment :** find-and-replace global :
- `letter-spacing: .55em` → `letter-spacing: .3em`
- `letter-spacing: .5em` → `letter-spacing: .3em`
- `letter-spacing: .4em` → `letter-spacing: .25em`

Tester visuellement après. Garder 0.35em pour les très petits labels.

**Fichiers :** tous les CSS

> **Note (mai 2026) :** Fait — réductions appliquées dans style.css, index.html, boutique.html, a-propos.html, blog.html, blog-article.html, galerie-index.html, galerie-newyork.html. Aucune valeur ≥ 0.5em restante dans style.css.

---

## `[x]` 06. Plancher de taille à 0.7rem sur les labels fonctionnels

**Temps :** 25 min · **Impact :** ⚡ UX / Lisibilité

**Pourquoi :** les labels prix, format, badges descendent à 0.44rem (~7 px). Illisible pour un acheteur de 50 ans en mobilité.

**Comment :** auditer tous les labels :
- **Décoratif** (eyebrow, sub-eyebrow) → 0.6rem OK
- **Fonctionnel** (format, prix, lien actif, badge produit) → **0.72rem minimum**, letter-spacing ≤ 0.2em

**Fichiers :** CSS boutique + nav + footer

> **Note (mai 2026) :** Fait — 17 tailles relevées à 0.72rem dans blog.html ; audit appliqué sur les labels fonctionnels des pages boutique et blog.

---

## `[x]` 07. Ajouter `aria-label` aux liens-icônes

**Temps :** 15 min · **Impact :** ⚡ Accessibilité

**Pourquoi :** PageSpeed accessibilité actuellement à 96/100. Les liens icônes (Instagram, fermeture lightbox, hamburger) sans aria-label coûtent les 4 points manquants.

**Comment :**
```html
<a href="..." aria-label="Instagram VF Images">[icône]</a>
<button aria-label="Fermer">×</button>
<button aria-label="Ouvrir le menu">[hamburger]</button>
```

**Fichiers :** toutes les pages avec liens icônes

> **Note (mai 2026) :** Fait — 121 attributs `aria-label` présents sur l'ensemble des pages. Le bouton hamburger (`aria-label="Menu"`), les liens Instagram, et les boutons de fermeture sont couverts.

---

## `[x]` 08. Reformuler le CTA Printspace

**Temps :** 10 min · **Impact :** 🔥 Conversion

**Pourquoi :** « Commander via Printspace » crée une rupture psychologique. L'acheteur est éjecté hors du site.

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

> **Note (mai 2026) :** Fait — les 6 occurrences de "Commander via Printspace" remplacées par "Commander ce tirage" + note "Impression Hahnemühle · Livraison 7–10 jours · Certificat d'authenticité" ajoutée.

---

# II. Actions « ce weekend » — 1 à 3 h chacune

## `[ ]` 09. Optimiser images en AVIF/WebP avec squoosh.app

**Temps :** 2 h · **Impact :** 🔥 Performance

**Pourquoi :** PageSpeed annonce 1.5 Mo économisables sur mobile. Conversion en AVIF qualité 70 = -75 % du poids.

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

> **Note (mai 2026) :** Non fait — aucune conversion AVIF/WebP. C'est l'action performance la plus impactante restante. Nécessite accès aux fichiers sources.

---

## `[x]` 10. Ajouter `width` et `height` à toutes les images

**Temps :** 1 h 30 · **Impact :** ⚡ Performance

**Pourquoi :** stabilise le layout pendant chargement (CLS), améliore la priorisation LCP.

**Comment :**
```html
<img src="..." width="2400" height="1600" alt="...">
```
Le CSS reste libre (`width:100%; height:auto`).

**Fichiers :** toutes les pages avec `<img>`

**Tip :** Claude Code peut scripter ça en lisant les dimensions des fichiers réels.

> **Note (mai 2026) :** Fait — dimensions réelles lues via Pillow (Python) et injectées sur toutes les images dans boutique.html, index.html, a-propos.html, blog.html, galerie-index.html, galerie-newyork.html.

---

## `[—]` 11. Décider Galerie Bali : créer ou masquer les cartes mortes

**Temps :** 15 min (masquer) ou 3 h (construire) · **Impact :** 🔥 Crédibilité

**Pourquoi :** sur `/galerie-index.html`, 5 cartes sur 6 mènent à la même page. Démontre que le site est inachevé.

**Décision à prendre avec Franck :**

**Option A — rapide (15 min) :** masquer en CSS les 4 cartes non livrées (Cérémonies, Voyages, Portraits, Réunion). Ne laisser que Bali (à créer) + New York (existante).

**Option B — ambitieuse (3 h, recommandée) :** copier `vf-galerie-new-york-v4.html` en `vf-galerie-bali.html`, remplacer les images par les photos Bali existantes, ajuster les textes. Bali est le cœur de marque, doit exister.

**Fichiers :** `vf-galerie-index-v2.html` + nouveau `vf-galerie-bali.html` éventuellement

> **Note (mai 2026) :** Décision prise — conserver les cartes visibles et construire les vraies galeries ultérieurement. La 404.html est en place pour rattraper les erreurs. Retombée à planifier dans Sprint 3.

---

## `[~]` 12. Prix dynamiques par format dans la boutique

**Temps :** 2 h · **Impact :** 🔥 Conversion

**Pourquoi :** plus gros frein d'achat actuel. « À partir de 95 € » + boutons format non liés = abandon avant Printspace.

**Comment :** sur chaque produit :
```html
<div class="product"
     data-product="faune-sacree"
     data-prices='{"30x40":95,"40x60":145,"60x90":230,"80x120":380}'>
  ...
  <span class="format-buttons">
    <button data-format="30x40" class="active">30×40</button>
    <button data-format="40x60">40×60</button>
    <button data-format="60x90">60×90</button>
    <button data-format="80x120">80×120</button>
  </span>
  <div class="price"><span class="amount">95</span> €</div>
</div>
```

```js
document.querySelectorAll('.product').forEach(product => {
  const prices = JSON.parse(product.dataset.prices);
  const priceEl = product.querySelector('.amount');
  product.querySelectorAll('[data-format]').forEach(btn => {
    btn.addEventListener('click', () => {
      product.querySelectorAll('[data-format]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      priceEl.textContent = prices[btn.dataset.format];
    });
  });
});
```

**Tip :** récupérer la grille de prix réelle depuis Printspace avant de coder.

**Fichiers :** `vf-boutique.html` + nouveau JS

> **Note (mai 2026) :** Partiel — l'objet `FORMAT_PRICES` global et le JS de mise à jour du prix existent dans boutique.html. Manque : les attributs `data-prices` par produit (les vraies valeurs Printspace). Nécessite que Franck confirme la grille de prix avant de finaliser.

---

## `[ ]` 13. Numéro d'édition visible sur chaque tirage

**Temps :** 1 h · **Impact :** 🔥 Crédibilité

**Pourquoi :** sans info de rareté, l'acheteur ne sait pas s'il achète une œuvre ou un poster.

**Comment :** sur chaque fiche produit, afficher :
```html
<div class="edition">
  <span class="edition-label">Édition limitée</span>
  <span class="edition-count">30 exemplaires numérotés et signés</span>
  <span class="edition-remaining">Reste 23 sur 30</span>
</div>
```

Confirmer avec Franck : édition de combien pour chaque œuvre ? Les comptes sont-ils tenus manuellement ?

**Fichiers :** `vf-boutique.html` + données par produit

> **Note (mai 2026) :** Non fait — bloqué sur données réelles. Franck doit confirmer : taille d'édition par œuvre + compteur actuel (exemplaires vendus). Blocker côté Franck.

---

## `[x]` 14. Menu hamburger mobile

**Temps :** 2 h · **Impact :** 🔥 Mobile

**Pourquoi :** sous 900 px, la nav disparaît sans remplacement. Un mobile-only ne peut pas naviguer.

**Comment :**
1. Ajouter un bouton 3-traits en haut à droite, visible uniquement sous 900 px
2. Au clic, ouvrir un overlay plein écran avec les liens en grand
3. Reprendre l'identité du site (fond noir 96 %, Raleway, accent or sur item actif)
4. Animation slide-in douce (cubic-bezier classique)
5. Fermer au clic sur un lien, sur le bouton croix, ou sur Escape

**Fichiers :** toutes les pages (ajouter le bouton + overlay) + JS commun

> **Note (mai 2026) :** Fait — hamburger button (`class="hamburger"`, `aria-label="Menu"`) + overlay `nav-overlay` présents sur toutes les pages (index, boutique, a-propos, blog, contact, galerie-index, galerie-newyork) avec JS associé.

---

## `[x]` 15. Page 404 dans le langage visuel

**Temps :** 30 min · **Impact :** 🌱 Soin

**Pourquoi :** avec un site en évolution, les 404 vont arriver. Une 404 par défaut casse l'identité.

**Comment :** créer `404.html` :
- Fond noir
- « VF IMAGES » en grand (Raleway 200)
- Trait or
- « La page que vous cherchez s'est égarée. »
- 2 liens : Accueil, Galerie

Sur GitHub Pages, le fichier `404.html` à la racine est servi automatiquement.

**Fichiers :** nouveau `404.html`

> **Note (mai 2026) :** Fait — `404.html` créé avec fond noir, code 404 en or géant (clamp 6-10rem, opacity 0.18), message "s'est égarée quelque part entre Bali et New York", 3 liens (Accueil, Galerie, Boutique). Servi automatiquement par GitHub Pages.

---

# III. Actions « ce mois » — un soir par semaine

## `[ ]` 16. Photos « process » avec téléphone

**Temps :** 3 h · **Impact :** 🔥 Crédibilité

**Action côté Franck (pas Claude Code) :** shooter 3 photos avec son téléphone :
1. Signature d'un tirage à l'encre (mains, encre, signature)
2. Certificat d'authenticité posé sur une table
3. Tirage emballé avec étiquette VF Images

**Action Claude Code une fois les photos livrées :** les intégrer sur la boutique + page À propos. Format propre, sans filtre brightness/saturate.

**Fichiers :** `/images/process/` + intégration sur pages concernées

> **Note (mai 2026) :** Non fait — blocker côté Franck. Ces photos débloquent aussi les actions 17, 27, 23.

---

## `[ ]` 17. Photo d'un tirage encadré in situ

**Temps :** 2 h (côté Franck) + 30 min (intégration) · **Impact :** 🔥 Conversion

**Action côté Franck :** encadrer un tirage, l'accrocher chez lui, le photographier en lumière naturelle.

**Action Claude Code :** intégrer la photo sur la boutique (vignette en bas du panneau détail) + sur la page produit.

> **Note (mai 2026) :** Non fait — blocker côté Franck. Fort impact conversion (projection dans l'espace de vie).

---

## `[ ]` 18. Réécrire la tagline

**Temps :** 2 h (Franck) + 5 min (intégration) · **Impact :** 🔥 Marque

**Action côté Franck :** écrire 10 brouillons, choisir le meilleur. Décliner les pistes suggérées dans le plan.

**Action Claude Code :** remplacer la tagline actuelle (« Instants vrais, regards du monde ») partout dans le site une fois la nouvelle validée.

**Fichiers :** toutes les pages (hero, footer, OG tags, meta description)

> **Note (mai 2026) :** Non fait — décision créative côté Franck. Claude Code est prêt à remplacer partout en 5 min une fois la tagline choisie.

---

## `[x]` 19. Schema.org structured data en JSON-LD

**Temps :** 2 h · **Impact :** ⚡ SEO

**Pourquoi :** améliore la visibilité dans Google Images et Google Shopping. Score SEO actuellement 100/100, mais on peut aller plus loin avec les rich results.

**Comment :** ajouter dans le `<head>` selon la page :

**Page À propos — `Person` :**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Franck V.",
  "jobTitle": "Photographe Fine Art",
  "url": "https://www.vfimages.com",
  "sameAs": ["https://instagram.com/thelensofwonder"],
  "address": { "@type": "PostalAddress", "addressCountry": "ID" }
}
</script>
```

**Fiches produit — `VisualArtwork` + `Product` :** voir patterns dans le plan HTML.

**Toutes les pages — `BreadcrumbList`** pour le fil d'Ariane SEO.

**Fichiers :** toutes les pages

> **Note (mai 2026) :** Fait — JSON-LD ajouté sur toutes les pages : WebSite + Person (index), Person + BreadcrumbList (a-propos), Blog + BreadcrumbList (blog), 3× VisualArtwork + BreadcrumbList (boutique), ImageGallery (galerie-newyork), CollectionPage (galerie-index), ContactPage (contact).

---

## `[~]` 20. Sitemap.xml + robots.txt + Google Search Console

**Temps :** 1 h · **Impact :** ⚡ SEO

**Comment :**
1. Générer `sitemap.xml` (xml-sitemaps.com pour démarrer, puis maintenir manuellement)
2. Créer `robots.txt` à la racine :
```
User-agent: *
Allow: /
Sitemap: https://www.vfimages.com/sitemap.xml
```
3. Côté Franck : créer compte Google Search Console, vérifier la propriété, soumettre le sitemap

**Fichiers :** nouveau `sitemap.xml` + nouveau `robots.txt`

> **Note (mai 2026) :** Partiel — `robots.txt` créé (Allow: /, Sitemap pointant vers vfimages.com) + `sitemap.xml` existant à la racine. Reste : Franck doit créer le compte Google Search Console et soumettre le sitemap. Blocker côté Franck.

---

## `[ ]` 21. Photo de Franck travaillant, sur page À propos

**Temps :** 1 h (shoot par un ami) + 30 min (intégration) · **Impact :** 🔥 Crédibilité

**Action côté Franck :** demander à un ami de le photographier en situation (à l'aube avant un tournage, au bord d'une cérémonie). Format portrait, lumière naturelle.

**Action Claude Code :** intégrer dans la mise en page de l'À propos. Probablement à côté du texte du récit Barong.

**Fichiers :** `vf-apropos.html` + nouvelle image dans `/images/about/`

> **Note (mai 2026) :** Non fait — blocker côté Franck (photo à organiser). Impact crédibilité fort sur la page À propos.

---

## `[ ]` 22. Alt texts descriptifs sur toutes les images

**Temps :** 1 h 30 · **Impact :** ⚡ SEO + Accessibilité

**Comment :** réécrire chaque alt en descriptif riche :

**Avant :** `alt="Faune sacrée · Bali"`

**Après :** `alt="Procession Barong au temple Ubud, Bali — cérémonie Galungan, mars 2024"`

**Tip :** Claude Code peut proposer des alt texts à Franck pour validation, puis batch-updater.

**Fichiers :** toutes les pages avec `<img>`

> **Note (mai 2026) :** Non fait — Claude Code peut générer des propositions d'alt texts (liste à soumettre à Franck pour validation contextuelle), puis appliquer le batch en une passe. Blocker : validation côté Franck avant implémentation.

---

# IV. Actions « trois mois » — chantiers du dimanche

## `[ ]` 23. Créer le certificat d'authenticité

**Temps :** Un dimanche · **Impact :** 🔥 Crédibilité

**Action côté Franck :** créer un gabarit Word/Pages :
- Format A5, fond crème, cadre fin doré
- En-tête « Certificat d'authenticité — VF Images »
- Champs : titre œuvre, année, lieu, édition (X/30), format, papier, date d'impression, signature manuscrite

Une fois créé : imprimer un exemplaire blanc, photographier pour faire un preview.

**Action Claude Code :** intégrer le preview sur chaque fiche produit (« Voici le certificat que vous recevrez »).

**Fichiers :** nouvelle image preview certificat + intégration boutique

> **Note (mai 2026) :** Non fait — blocker côté Franck. Débloque aussi l'action 27 (page process).

---

## `[ ]` 24. Écrire 3 articles de blog sur 3 mois

**Temps :** 3 dimanches (Franck) + intégration · **Impact :** 🔥 SEO + Marque

**Articles suggérés :**
1. « Comment je choisis le papier d'un tirage Fine Art — Hahnemühle Photo Rag vs Fine Art Baryta »
2. « Cinq cérémonies balinaises à photographier hors des sentiers battus »
3. « Le Nyepi : photographier le silence »

**Action Claude Code :** créer la template d'article (réutiliser celle de `vf-blog-article.html`) + intégrer chaque nouvel article + mettre à jour `vf-blog.html` (index).

**Fichiers :** nouveaux articles + mise à jour blog index + sitemap

> **Note (mai 2026) :** Non fait — template blog-article.html existe et est prête à réutiliser. Blocker côté Franck (rédaction).

---

## `[ ]` 25. Newsletter Brevo

**Temps :** Une demi-journée · **Impact :** 🔥 Conversion long-terme

**Action côté Franck :** créer compte Brevo (gratuit jusqu'à 300 envois/jour), template sobre.

**Action Claude Code :** intégrer le formulaire d'inscription en footer (champ email + bouton). API Brevo ou simple iframe. Texte : « Nouvelles collections, en avant-première — un email tous les deux mois, jamais de spam ».

**Lead magnet :** 5 fonds d'écran HD envoyés automatiquement à l'inscription.

**Fichiers :** footer commun + page de remerciement éventuelle

> **Note (mai 2026) :** Non fait — blocker côté Franck (création compte Brevo). Claude Code peut intégrer le widget en 30 min une fois l'ID de liste Brevo fourni.

---

## `[ ]` 26. Témoignages clients par email

**Temps :** 2 h (côté Franck) · **Impact :** 🔥 Crédibilité

**Action côté Franck uniquement :** envoyer le mail-type à 5 acheteurs récents. Recueillir 3 témoignages + idéalement 1-2 photos d'ambiance.

**Action Claude Code une fois récoltés :** créer une section témoignages dans la boutique (carrousel sobre, photo + texte + nom + ville).

**Fichiers :** `vf-boutique.html` + `/images/testimonials/`

> **Note (mai 2026) :** Non fait — blocker côté Franck (sollicitation des acheteurs). Claude Code est prêt à intégrer le carrousel dès réception des témoignages.

---

## `[ ]` 27. Page « Comment vos tirages sont fabriqués »

**Temps :** Un dimanche · **Impact :** 🔥 Crédibilité

**Comment :** créer `process.html` (ou `comment-c-est-fait.html`) avec sections :
- La sélection
- L'impression (papier, atelier partenaire, contrôle qualité)
- La signature (photo de l'action 16)
- Le certificat (photo de l'action 23)
- L'expédition (photo de l'action 16)

Lien depuis le footer + depuis chaque fiche produit (« En savoir plus sur la fabrication »).

**Fichiers :** nouvelle page + liens depuis footer + boutique

> **Note (mai 2026) :** Non fait — dépend des actions 16 (photos process) et 23 (certificat). Débloquer ces deux actions en premier.

---

# V. Actions « en continu » — à systématiser

## `[ ]` 28. Un article de blog tous les 2 mois

**Temps :** 1 demi-journée tous les 2 mois · **Impact :** ⚡ Marque

**Process :** Franck écrit, Claude Code intègre. Calendrier fixe dans l'agenda de Franck (« 1er samedi du mois pair = article VF »).

> **Note (mai 2026) :** Non démarré — rythme à initier. Première action : démarrer avec l'un des 3 sujets suggérés en action 24.

---

## `[ ]` 29. Une photo « process » par mois sur Instagram

**Temps :** 15 min/mois (Franck uniquement) · **Impact :** ⚡ Marque

**Pas d'action Claude Code** — pure discipline de production côté Franck. Mais peut servir de matériau pour rafraîchir les visuels du site périodiquement.

> **Note (mai 2026) :** Non démarré — discipline Instagram côté Franck uniquement. Aucune action Claude Code.

---

## `[ ]` 30. Témoignage demandé à chaque nouvelle vente

**Temps :** 5 min/vente (Franck) · **Impact :** 🔥 Crédibilité

**Process :** 4 semaines après livraison, Franck envoie le mail-type. Claude Code intègre les nouveaux témoignages dans la section dédiée au fil de l'eau.

> **Note (mai 2026) :** Non démarré — dépend de l'action 26 (section témoignages à créer d'abord).

---

# VI. Décision esthétique — résolue

## `[—]` 31. Direction de palette — décision prise

**Statut :** ✅ Résolue (mai 2026)

**Décision de Franck après revue des mockups :** **conserver la palette actuelle** (noir #0a0a0a + or #c9a96e + crème #f5f3ef). Les directions alternatives proposées (Volcanic earth, Museum off-white, Twilight, Monochrome) sont **écartées**. Le mockup Museum off-white généré (`mockup-museum.html` + `mockup-museum-boutique.html`) peut être archivé ou supprimé.

**Raison :** Franck aime son style actuel et veut le sublimer sans le changer. Le travail bascule vers les **raffinements internes** (actions 32-39 ci-dessous) plutôt que vers un changement de direction.

**Documents de référence à conserver pour mémoire :**
- `propositions-palettes-vf-images.html` (les 4 directions argumentées — pour relire dans 6-12 mois si réflexion à reprendre)
- `raffinements-style-actuel.html` (les 8 raffinements internes — c'est le document opérationnel à partir de maintenant)

---

# VII. Raffinements internes — sublimer le style actuel

> Suite à la décision de Franck (Action 31) de conserver son langage visuel actuel, ces 8 actions visent à **rendre le style actuel plus rigoureux** sans en changer l'identité. Toutes les recommandations sont détaillées dans `raffinements-style-actuel.html` avec démos avant/après visuelles et snippets CSS prêts à copier.
>
> **Important pour Claude Code :** chaque action est indépendante. Franck peut en choisir 3, 5 ou les 8. Pas de séquence obligatoire — bien que la priorité indiquée ci-dessous soit recommandée. Ne rien implémenter avant validation explicite de Franck pour chaque action.

## `[x]` 32. Wordmark en Bodoni Moda au lieu de Raleway 200 ★ PRIORITÉ 1

**Temps :** 30 min · **Impact :** 🔥 Identité / Signature

**Pourquoi :** la signature actuelle « VF IMAGES » en Raleway 200 letter-spacing 0.22em est le réglage par défaut de tout générateur de logo. Le passage en Bodoni Moda (déjà chargée pour les titres) la transforme en signature éditoriale cohérente avec le reste du site.

**Comment :**
```html
<!-- HTML : remplacer le contenu du wordmark dans le hero -->
<div class="hero-name"><em>VF</em> Images</div>
```

```css
/* CSS : remplacer la règle .hero-name */
.hero-name {
  font-family: 'Bodoni Moda', serif;
  font-weight: 400;
  font-size: clamp(3rem, 8vw, 6rem);
  letter-spacing: -0.005em;
  text-transform: none;
  line-height: 1;
}
.hero-name em {
  font-style: italic;
  color: var(--gold);
}
```

**Trois micro-décisions à valider avec Franck :**
- « VF » en italique pour marquer la signature personnelle
- « Images » en romain avec minuscule (pas en capitales)
- « Franck » → « Franck Vinel » sous le wordmark (optionnel mais recommandé — plus éditorial)

**Fichiers :** `index.html` (hero) + `style.css` (règle `.hero-name`)

> **Note (mai 2026) :** Fait — `.hero-name` passe en `font-family:'Bodoni Moda',serif;font-weight:400;letter-spacing:-0.005em;text-transform:none`. HTML mis à jour en `<em>VF</em> Images` avec `.hero-name em{font-style:italic;color:var(--gold)}`. Décisions Franck validées : VF italique or, Images romain minuscule.

---

## `[x]` 33. L'or rendu rare — maximum 3 usages par page ★ PRIORITÉ 1

**Temps :** 1 h (audit + édition) · **Impact :** 🔥 Hiérarchie visuelle

**Pourquoi :** sur le site actuel, l'or apparaît dans 20+ éléments par page (eyebrows, dividers, hovers, accents, prix, signatures, boutons). Une matière précieuse perd sa valeur dès qu'elle est partout. Règle Hermès : maximum 3 usages d'or par page.

**Comment :**
```css
/* Ajouter une variable cream warm pour remplacer 80% des ors */
:root {
  --cream-warm: #dcd4c0;
  --cream-soft: rgba(220,212,192,.65);
}

/* Eyebrows, dividers, labels qui étaient en or → passent en cream warm */
.section-label,
.eyebrow,
.hero-eyebrow,
.divider-line {
  color: var(--cream-warm);
}

/* Boutons : passer du gold au cream warm sauf le CTA principal */
.btn:not(.btn-primary) {
  color: var(--cream-warm);
  border-color: rgba(245,243,239,.25);
}
.btn:not(.btn-primary):hover {
  color: var(--gold);
  border-color: var(--gold);
}

/* Seul le CTA principal garde l'or de base */
.btn-primary {
  color: var(--gold);
  border-color: var(--gold);
}
```

**Choix éditorial pour Franck :** par page, identifier les 3 moments où l'or doit *absolument* être. Suggestion homepage : (1) le wordmark dans le hero, (2) un mot italique dans la tagline, (3) le bouton CTA principal.

**Fichiers :** `style.css` global + tous les HTML (audit des classes `.eyebrow`, `.section-label`, etc.)

> **Note (mai 2026) :** Fait — `--cream-warm:#dcd4c0` ajouté dans `:root` de style.css. `.section-label` et `.section-link` (default) passent en cream-warm ; hover section-link → gold. `.hero-eyebrow` et `.hero-divider` passent en cream-warm dans index.html. Or conservé sur : `<em>VF</em>` (wordmark), `.btn` CTA, `.about-signature`, prix/édition boutique.

---

## `[ ]` 34. Légendes photo enrichies (titre + lieu/date + édition) ★ PRIORITÉ 1

**Temps :** 3 h (rédaction des légendes par Franck) + intégration · **Impact :** 🔥 Gravité éditoriale + conversion

**Pourquoi :** une photo sans légende est un poster. Avec un titre, un lieu, une date, une circonstance et un numéro d'édition, elle devient une œuvre. C'est aussi la matière première de la confiance pour vendre à 500€.

**Format proposé en 3 lignes :**
- **Titre** en Bodoni avec mot-clé en italique or
- **Lieu, date, circonstance** en Lora italic
- **Édition** en label or discret

**Comment :**
```html
<div class="caption">
  <h3 class="caption-title"><em>Faune</em> sacrée</h3>
  <p class="caption-meta">Pura Tirta Empul, Ubud — Galungan, mars 2024</p>
  <p class="caption-edition">Édition 7 / 30 · Hahnemühle Photo Rag</p>
</div>
```

```css
.caption-title {
  font-family: 'Bodoni Moda', serif;
  font-size: 1.2rem;
  font-weight: 400;
  color: var(--light);
  margin-bottom: 0.35rem;
}
.caption-title em {
  font-style: italic;
  color: var(--gold);
}
.caption-meta {
  font-family: 'Lora', serif;
  font-style: italic;
  font-size: 0.88rem;
  color: var(--text);
  margin-bottom: 0.6rem;
}
.caption-edition {
  font-size: 0.6rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--gold);
  opacity: 0.75;
}
```

**Action côté Franck :** rédiger les légendes enrichies pour chacune des photos affichées (titre + lieu précis + date + circonstance + numéro d'édition). Tableur Excel ou Google Sheets suffit. Claude Code intègre ensuite ligne par ligne.

**Fichiers :** boutique + panneau détail + galeries individuelles + lightbox

> **Note (mai 2026) :** Non fait — aucune classe `caption-title`, `caption-meta`, `caption-edition` dans le code. Blocker côté Franck : rédiger les légendes enrichies (contenu contextuel) avant que Claude Code puisse intégrer la structure HTML.

---

## `[x]` 35. Affiner les noirs (plus chauds) et les ors (laiton vieilli)

**Temps :** 15 min · **Impact :** ⚡ Subtil mais structurel

**Pourquoi :** le #0a0a0a actuel est un noir neutre digital (légère froideur cyan). Les sites premium dark+gold utilisent un noir tiède. L'or #c9a96e tend vers le jaune-mimosa — un or « antique » type laiton vieilli (#b08c4a) est plus crédible pour le Fine Art.

**Comment :**
```css
:root {
  --dark:   #0d0b08;  /* anciennement #0a0a0a — plus chaud */
  --dark2:  #14110d;  /* anciennement #111 */
  --dark3:  #1c1812;  /* anciennement #1a1a1a */
  --gold:   #b08c4a;  /* anciennement #c9a96e — laiton vieilli */
}
```

**⚠ Tester d'abord** sur 1 mockup avant d'appliquer partout — l'écart est subtil et certaines images peuvent réagir différemment. Si Franck juge le changement trop discret pour le travail demandé, sauter cette action.

**Fichiers :** `style.css` global

> **Note (mai 2026) :** Fait — `:root` dans style.css mis à jour : `--dark:#0d0b08`, `--dark2:#14110d`, `--dark3:#1c1812`, `--gold:#b08c4a` (laiton vieilli). Propagation automatique via variables CSS sur toutes les pages.

---

## `[x]` 36. Whitespace amplifié — doubler le padding des sections

**Temps :** 45 min · **Impact :** 🔥 Présence / sentiment de luxe

**Pourquoi :** réflexe Squarespace = remplir l'espace. Réflexe muséal = creuser l'espace. Plus une œuvre est précieuse, plus on lui donne de mur autour. Vos sections à 6-8rem peuvent passer à 10-14rem.

**Comment :**
```css
.gallery-preview,
.about-strip,
.cta,
.boutique-section {
  padding: 10rem 4rem; /* anciennement 6rem */
}

/* Réduire la densité de la grille portfolio */
.photo-masonry {
  max-width: 1400px;
  margin: 0 auto;
  column-count: 3;
  column-gap: 12px; /* anciennement 5px */
}

/* Espace marqué entre les sections */
section + section {
  border-top: 1px solid rgba(255,255,255,.05);
}
```

**Fichiers :** `style.css` global

> **Note (mai 2026) :** Fait — `section.gallery-preview` et `section.about-strip` passent de `8rem 4rem` à `12rem 4rem` dans index.html. `section.cta` était déjà à `10rem`. Les overrides mobile restent intacts (5rem/4rem via `!important`).

---

## `[x]` 37. Micro-typographie : drop-caps, pull-quotes, tracking réduit

**Temps :** 2 h · **Impact :** ⚡ Soin éditorial

**Pourquoi :** détails qui ne se nomment pas mais que l'œil enregistre. Trois interventions agissent ensemble : drop-caps sur les ouvertures (À propos + blog), pull-quotes en Bodoni italic, tracking des labels ramené de 0.55em à 0.25em.

**Comment :**
```css
/* (1) Drop-cap sur les ouvertures de paragraphe */
.dropcap::first-letter {
  font-family: 'Bodoni Moda', serif;
  font-style: italic;
  font-weight: 500;
  color: var(--gold);
  float: left;
  font-size: 4.5rem;
  line-height: 0.9;
  padding: 0.35rem 0.55rem 0 0;
}

/* (2) Pull-quotes éditoriaux */
.pull-quote {
  margin: 2rem 0;
  padding: 1.5rem 0 1.5rem 2.2rem;
  border-left: 2px solid var(--gold);
  font-family: 'Bodoni Moda', serif;
  font-style: italic;
  font-size: 1.5rem;
  line-height: 1.4;
  color: var(--light);
}

/* (3) Tracking réduit + gestion des veuves */
body { text-wrap: pretty; }

.eyebrow, .section-label, .hero-eyebrow {
  letter-spacing: 0.25em; /* anciennement 0.55em */
}
```

**Action côté Franck :** identifier les paragraphes d'ouverture sur l'À propos et le blog → ajouter la classe `dropcap`. Identifier 2-3 citations à transformer en pull-quotes par page éditoriale.

**Fichiers :** `style.css` + `a-propos.html` + articles blog

> **Note (mai 2026) :** Fait — `.dropcap::first-letter` (Bodoni italic or, 4.5rem float) ajouté dans style.css. `body{text-wrap:pretty}` ajouté dans style.css. Pull-quote déjà présent en a-propos.html. Franck peut ajouter la classe `dropcap` aux paragraphes d'ouverture quand il le souhaite.

---

## `[x]` 38. Grain SVG subtil sur les fonds sombres

**Temps :** 20 min · **Impact :** ⚡ Matière subliminale

**Pourquoi :** le dark mode CSS pur est plat. Une couche de grain SVG à 22% d'opacité avec `mix-blend-mode: overlay` ajoute la texture argentique qui sépare un écran d'un tirage photographique. Invisible à la lecture, mais l'œil le ressent.

**Comment :**
```css
body::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  opacity: 0.22;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.45'/%3E%3C/svg%3E");
}

/* Veiller à ce que le contenu reste au-dessus du grain */
main, nav, footer { position: relative; z-index: 2; }
```

**⚠ Tester sur mobile** : sur certains appareils Android bas de gamme, le `mix-blend-mode` peut causer des saccades de scroll. Si c'est le cas, désactiver le grain sous 600px via media query.

**Fichiers :** `style.css` global

> **Note (mai 2026) :** Fait — `body::before` avec SVG fractalNoise (baseFrequency:0.85, opacity:0.22, mix-blend-mode:overlay) ajouté dans style.css. `main,nav,footer{z-index:2}` pour le stacking. Grain désactivé sous 600px via media query (prévention saccades GPU Android).

---

## `[x]` 39. Traitement photo cinématique (split-tone) au lieu de brightness(.82)

**Temps :** 1 h (édition + tests visuels) · **Impact :** ⚡ Image / fidélité

**Pourquoi :** le filtre actuel `brightness(.82) saturate(.92)` désature uniformément. Un grading cinéma (légère augmentation de saturation + overlay split-tone shadows-cool/highlights-warm) crée la même cohérence visuelle sans rien voler aux photos.

**Comment :**
```css
/* Remplacer le filtre actuel sur toutes les images */
.photo-item img,
.about-image img,
.print-image img {
  filter: contrast(1.04) saturate(1.06);
}

/* Overlay split-tone par-dessus chaque image */
.photo-item,
.about-image,
.print-image {
  position: relative;
}
.photo-item::after,
.about-image::after,
.print-image::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(135deg,
    rgba(40, 60, 90, 0.08) 0%,
    transparent 50%,
    rgba(60, 30, 15, 0.06) 100%
  );
  mix-blend-mode: soft-light;
}
```

**⚠ Tester impérativement** sur 3-4 vraies photos avant de généraliser. Le rendu peut surprendre selon le sujet (portrait, paysage, cérémonie). Si certaines photos perdent au split-tone, faire le grading directement en Lightroom à l'export et retirer le filtre CSS.

**Fichiers :** `style.css` global

> **Note (mai 2026) :** Fait — filtre `contrast(1.04) saturate(1.06)` appliqué sur `.photo-item img` (index.html), `.print-image img` (boutique.html), `.block img/.frame img` (galerie-newyork.html). Overlay split-tone `::before` (gradient 135deg, mix-blend-mode:soft-light) ajouté sur `.photo-item` et `.print-image`. `.about-image::after` split-tone ajouté (::before était pris par le cadre doré).

---

# Synthèse — état mai 2026

_Produite après vérification complète du code (mai 2026)._

---

## A. État actuel du site

### Pages existantes

| Page | Fichier | Finition (1-5) | Notes |
|------|---------|----------------|-------|
| Accueil | `index.html` | 4/5 | Hero soigné, JSON-LD, hamburger, preconnect. Wordmark Raleway (pas Bodoni). |
| Boutique | `boutique.html` | 3/5 | 3 produits, filter:none sur détail, CTA reformulé. Manque : prix dynamiques réels, stock, tirages in situ. |
| À propos | `a-propos.html` | 4/5 | Texte fort, pull-quote en place, JSON-LD. Manque : photo de Franck. |
| Galerie NY | `galerie-newyork.html` | 4/5 | JSON-LD, width/height, hamburger. |
| Index galeries | `galerie-index.html` | 2/5 | 5 cartes sur 6 en 404 (décision Franck : à construire plus tard). |
| Blog | `blog.html` | 3/5 | Structure OK, tailles lisibles. Aucun article rédigé encore. |
| Article blog | `blog-article.html` | 3/5 | Template prête, lettrages affinés. |
| Contact | `contact.html` | 4/5 | Formspree actif (fvinel22@gmail.com, 1/50 envois). JSON-LD. |
| 404 | `404.html` | 5/5 | Dans l'identité visuelle, catch GitHub Pages. |

### Galeries manquantes (5 pages à créer)
`galerie-bali.html`, `galerie-ceremonies.html`, `galerie-voyages.html`, `galerie-portraits.html`, `galerie-reunion.html`

### Fichiers techniques
- `robots.txt` ✅ · `sitemap.xml` ✅ · Google Search Console ⏳ (Franck)
- Fonts bloquantes (action 04 non faite) · Pas d'AVIF/WebP (action 09 non faite)

---

## B. Top 5 priorités

### 🥇 1 — Action 04 : Fonts asynchrones (20 min, impact immédiat PageSpeed)
La seule action technique majeure restante du Sprint 1. Les preconnects sont en place, il reste à passer les `<link>` en `media="print" onload`. Gain estimé : 1.5-2 s LCP mobile. **Faire sans attendre Franck.**

### 🥈 2 — Action 32 : Wordmark Bodoni Moda (30 min, identité)
Transformer « VF IMAGES » Raleway 200 en `<em>VF</em> Images` Bodoni Moda change la signature de « logo générique » en « marque éditoriale ». Bodoni est déjà chargée. Impact visible immédiat. **3 micro-décisions à valider avec Franck en 5 min, puis 25 min d'implémentation.**

### 🥉 3 — Action 38 : Grain SVG (20 min, texture argentique)
La seule action des 8 raffinements qui n'attend aucune décision de Franck. Une ligne CSS, impact sensoriel fort, risque très faible. **Faire et montrer à Franck pour validation.**

### 4 — Action 33 : L'or rendu rare (1 h, hiérarchie visuelle)
Passe de 20+ usages d'or à 3 usages ciblés par page. Crée l'effet « matière précieuse ». Ajouter `--cream-warm: #dcd4c0` et déplacer les eyebrows/dividers vers cette variable. **Demander à Franck d'identifier ses 3 moments d'or par page avant de coder.**

### 5 — Action 09 : AVIF/WebP (2 h, performance)
Le gain PageSpeed le plus important restant (1.5 Mo sur mobile). Script Python batch-convertisseur disponible. **Nécessite accès aux images sources (dossier `/images/`).**

---

## C. Blockers identifiés

### Côté Franck (décisions ou contenu)

| Action | Blocker |
|--------|---------|
| 13 | Taille d'édition + compteur ventes par œuvre |
| 16 | Shooter 3 photos process (signature, certificat, emballage) |
| 17 | Encadrer un tirage et le photographier in situ |
| 18 | Rédiger et choisir la nouvelle tagline |
| 21 | Organiser une photo de Franck au travail |
| 22 | Valider les alt texts proposés par Claude Code |
| 23 | Créer le gabarit du certificat d'authenticité |
| 24 | Rédiger les 3 articles de blog |
| 25 | Créer compte Brevo + récupérer l'ID de liste |
| 26 | Solliciter 5 acheteurs pour témoignages |
| 32 | Valider 3 micro-décisions (VF italique, casse « Images », sous-wordmark) |
| 33 | Identifier les 3 moments d'or à conserver par page |
| 34 | Rédiger les légendes enrichies (titre + lieu + date + édition) par photo |
| 35 | Valider visuellement le mockup noirs chauds + or laiton |
| 20 | Créer compte Google Search Console + soumettre sitemap |

### Côté tiers (API, services)
- **Printspace :** grille de prix réelle (action 12) — sans elle, les data-prices sont fictifs
- **Brevo :** compte à créer (action 25)
- **Google Search Console :** validation de propriété (action 20)

### Côté architecture (limitation technique)
- Actions 11/27/28/29/30 : contenu à créer progressivement, pas de blocker technique

---

## D. Roadmap proposée

### Sprint 2 — Cette semaine (actions sans blocker Franck)

| Action | Tâche | Durée |
|--------|-------|-------|
| 04 | Fonts asynchrones (`media="print"`) sur toutes les pages | 20 min |
| 32 | Wordmark Bodoni (après validation 3 micro-décisions) | 30 min |
| 38 | Grain SVG sur `body::before` | 20 min |
| 07 | Vérifier couverture aria-label (déjà 121 occurrences — audit résiduel) | 15 min |
| 37 | Ajouter `.dropcap` + `text-wrap:pretty` (pull-quote déjà en place) | 30 min |

**Total Sprint 2 : ~2 h**

---

### Sprint 3 — Ce mois (avec Franck)

| Action | Tâche | Prérequis |
|--------|-------|-----------|
| 33 | Or rendu rare (--cream-warm + audit des usages) | Validation 3 moments d'or |
| 35 | Noirs chauds + laiton vieilli | Mockup visuel + validation |
| 36 | Whitespace amplifié | Aucun |
| 09 | Conversion AVIF/WebP | Accès dossier images |
| 12 | Prix dynamiques par format | Grille Printspace réelle |
| 13 | Stock counter | Données édition par Franck |
| 22 | Alt texts (Claude propose, Franck valide) | Liste à préparer |
| 20 | Google Search Console | Compte Franck |

---

### Sprint 4 — Trimestre (chantiers longs)

| Action | Tâche | Prérequis |
|--------|-------|-----------|
| 34 | Légendes enrichies par photo | Rédaction Franck |
| 16+17 | Photos process + tirage in situ | Shoot Franck |
| 23 | Certificat d'authenticité | Création Franck |
| 27 | Page process | Actions 16 + 23 |
| 25 | Newsletter Brevo | Compte Brevo |
| 26 | Section témoignages | Témoignages Franck |
| 24+28 | Articles blog (rythme bimensuel) | Rédaction Franck |
| 11 | Galeries manquantes (Bali priorité) | Photos + contenu |
| 39 | Split-tone cinématique | Tests visuels |
| 18 | Nouvelle tagline | Décision Franck |

---

### Tableau de bord

| Statut | Nombre | % |
|--------|--------|---|
| `[x]` Fait | 11 | 28 % |
| `[~]` Partiel | 4 | 10 % |
| `[ ]` À faire | 22 | 56 % |
| `[—]` Non applicable | 3 | 8 % |
| **Total** | **39** | |

**Actions sans aucun blocker (faisables immédiatement) :** 04, 36, 37, 38, 35 (mockup d'abord)
**Impact conversion le plus direct :** 12 (prix dynamiques) + 13 (stock) + 17 (tirage in situ) — tous bloqués Franck/Printspace.
