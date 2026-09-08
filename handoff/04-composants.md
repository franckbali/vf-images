# 04 — Composants réutilisables et doublons

Aucun de ces "composants" n'est un vrai composant réutilisable au sens technique (pas de partial, pas d'include, pas de template) : chaque page est un fichier HTML autonome, donc chaque bloc ci-dessous est **copié-collé indépendamment dans chaque fichier** qui l'utilise, avec des variations.

## 1. Navigation (header)

Présente sur les 12 pages publiques + les 2 pages `editions/`. Structure de base identique (logo SVG + `<ul>` de 6 liens + sélecteur de langue FR/EN + menu hamburger mobile), mais le HTML est dupliqué intégralement dans chaque fichier plutôt que factorisé. Les 2 pages `editions/*.html` ont une nav visuellement différente (plus minimale, un seul bouton "EN"/"FR" au lieu du sélecteur à deux boutons du reste du site).

## 2. Footer

Même situation que la nav : logo, copyright, lien mentions légales, icône Instagram — dupliqué sur chaque page avec de légères variations de markup relevées (attribut `loading="eager"` vs `loading="lazy"` selon les pages, incohérent d'une page à l'autre).

## 3. Bandeau consentement cookies — 2 implémentations CSS différentes pour le même composant

12 pages utilisent des classes définies en **CSS inline propre à chaque page** :
`.cookie-actions`, `.cookie-btn-accept`, `.cookie-btn-refuse`
→ `a-propos.html`, `blog.html`, `blog-article.html`, `boutique.html`, `boutique_backup.html`, `contact.html`, `galerie-bali.html`, `galerie-index.html`, `galerie-newyork.html`, `galerie-portraits.html`, `index.html`, `mentions-legales.html`

1 page (`blog-article-reunion.html`) utilise des classes **différentes, définies dans `style.css`** :
`.cookie-btns`, `.cookie-btn` (classe de base = état "refuser"), `.cookie-btn.accept` (modificateur)

Le comportement JS (apparition après 800ms si aucun consentement stocké, clé `localStorage` `vf_analytics_consent`, chargement conditionnel du script Umami) est le même partout, mais recodé indépendamment dans chaque page plutôt que factorisé.

## 4. Sélecteur de langue FR/EN — 2 systèmes complètement différents

**Système A** (12 pages publiques + `boutique_backup.html`) : bascule en place, sans rechargement. Chaque élément traduisible porte deux attributs `data-fr="..."` et `data-en="..."`, et une fonction JS `setLang(lang)` (répétée indépendamment dans chaque page, quasi identique à chaque fois) fait `el.textContent = el.getAttribute('data-'+lang)` sur tous les éléments concernés. Préférence retenue dans `localStorage` (clé `vf_lang`).

**Système B** (2 pages `editions/portrait-bali-012.html` et `editions/portrait-bali-369.html`) : un objet JS `const T = { fr: {...}, en: {...} }` contenant les chaînes, et une fonction `applyLang(l)` qui fait `document.getElementById(id).textContent = T[l].clé` pour une liste fixe d'identifiants. Aucun rapport avec le système A — pas de `data-fr`/`data-en` sur ces 2 pages.

*(Contexte : jusqu'au 3 septembre 2026, il existait un troisième système — un dossier `/en/*.html` entier dupliquant chaque page en anglais. Il a été supprimé ; seuls les systèmes A et B décrits ci-dessus subsistent.)*

## 5. Lightbox (visionneuse plein écran)

Présente sur 4 pages : `index.html`, `galerie-bali.html`, `galerie-newyork.html`, `galerie-portraits.html`. Marquage identique (`id="lightbox"`, `.lightbox-close`, `.lightbox-img`, `.lightbox-caption`), dupliqué sur chacune plutôt que factorisé. Absente de `galerie-index.html` alors que cette page affiche aussi des vignettes photo.

## 6. Titre de page (hero H1) — 7 noms de classe différents pour un rôle identique

Chaque page nomme différemment son titre principal, sans convention commune :

| Classe | Pages |
|---|---|
| `.hero-title` | `a-propos.html`, `boutique.html`, `blog.html`, `boutique_backup.html` |
| `.intro-title` | `galerie-bali.html`, `galerie-newyork.html`, `galerie-portraits.html` |
| `.article-title` | `blog-article.html`, `blog-article-reunion.html` |
| `.page-hero-title` | `galerie-index.html` |
| `.contact-title` | `contact.html` |
| `.page-title` | `mentions-legales.html` |
| `.hero-name` | `index.html` (cas particulier : "VF Images" en Cormorant Garamond) |
| `.edition-title` | `editions/portrait-bali-012.html`, `editions/portrait-bali-369.html` |

## 7. Cartes produit / grille — doublon direct

`boutique.html` et `boutique_backup.html` contiennent chacune leur propre grille de cartes produit, avec un markup très proche mais des données différentes (voir [02-arborescence.md](02-arborescence.md) — `boutique_backup.html` est `noindex`, hors périmètre public, mais toujours présente dans le dépôt et non liée depuis aucune page vivante).

## 8. Bloc vidéo avec zone d'upload — code mort constaté

Un composant "lecteur vidéo + zone de dépôt de fichier" (`class="video-block"`, bouton "Choisir un fichier", `input[type=file]` avec `onchange="handleVideoUpload(event)"`) existe dans le CSS partagé (règles `.video-block`, `.upload-demo`, `.upload-demo-icon`, `#videoFileInput`, présentes dans les `<style>` de plusieurs pages) mais n'est monté en HTML sur aucune des pages publiques actuelles — c'est un vestige d'une version antérieure d'un article de blog (l'instance HTML correspondante a été retirée de `blog-article.html`, mais les règles CSS associées restent présentes dans le code).

## 9. JSON-LD (données structurées) — schémas non uniformes

Chaque page publique définit son propre bloc `<script type="application/ld+json">`, avec des `@type` différents selon la page (`Person`, `WebSite`, `BreadcrumbList`, `ImageGallery`, `Place`, `PostalAddress`, `CollectionPage`, `ContactPage`, `Blog`, `VisualArtwork`, `AggregateOffer`) — cohérent avec le rôle de chaque page, mais **2 pages n'ont aucun JSON-LD** : `blog-article-reunion.html` et `mentions-legales.html`, alors que leurs pages sœurs respectives (`blog-article.html`, autres pages légales potentielles) ou pages comparables (`blog.html`) en ont.
