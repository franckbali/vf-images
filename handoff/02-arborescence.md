# 02 — Arborescence complète

URLs telles que déclarées par la balise `<link rel="canonical">` de chaque page (grâce à `cleanUrls: true` dans `vercel.json`, l'extension `.html` n'apparaît jamais en production).

## Nav principale (ordre exact, identique sur toutes les pages)

`Accueil` · `Galerie` · `À propos` · `Boutique` · `Journal` · `Contact`

## Pages publiques indexées (11)

| URL | Rôle | Fichier source |
|---|---|---|
| `/` | Accueil : hero, portfolio (grille dynamique via `accueil.json`), section À propos, CTA | [`index.html`](../index.html) |
| `/galerie-index` | Page listant les galeries disponibles (portes/vignettes), générée dynamiquement depuis `galeries.json` via `fetch()` | [`galerie-index.html`](../galerie-index.html) |
| `/galerie-bali` | Galerie individuelle Bali — 6 photos, texte éditorial | [`galerie-bali.html`](../galerie-bali.html) |
| `/galerie-newyork` | Galerie individuelle New York | [`galerie-newyork.html`](../galerie-newyork.html) |
| `/galerie-portraits` | Galerie individuelle Portraits | [`galerie-portraits.html`](../galerie-portraits.html) |
| `/a-propos` | Biographie du photographe | [`a-propos.html`](../a-propos.html) |
| `/boutique` | Liste des tirages en vente + fiches détail (modales) | [`boutique.html`](../boutique.html) |
| `/contact` | Formulaire de contact (Formspree) | [`contact.html`](../contact.html) |
| `/blog` | Liste des articles du journal + 4 cartes vidéo YouTube/Instagram | [`blog.html`](../blog.html) |
| `/blog-article` | Article "Melasti, ou l'âme rendue à la mer" | [`blog-article.html`](../blog-article.html) |
| `/blog-article-reunion` | Article "Cari feu de bois" (La Réunion) | [`blog-article-reunion.html`](../blog-article-reunion.html) |

## Fiches produit édition limitée (2, système à part)

| URL | Rôle | Fichier source |
|---|---|---|
| `/editions/portrait-bali-012` | Fiche détail édition limitée (100×70cm, 15 ex.) — compteur d'exemplaires restants en JS, appel `/api/edition-status` | [`editions/portrait-bali-012.html`](../editions/portrait-bali-012.html) |
| `/editions/portrait-bali-369` | Idem, autre tirage | [`editions/portrait-bali-369.html`](../editions/portrait-bali-369.html) |

Ces 2 pages ont leur propre système de traduction JS (objet `T` + `applyLang()`) et leur propre CSS autonome — indépendants du reste du site. Détail dans [04-composants.md](04-composants.md).

## Page légale (indexée mais robots = noindex/follow)

| URL | Rôle | Fichier source |
|---|---|---|
| `/mentions-legales` | Mentions légales, CGV, politique de confidentialité RGPD | [`mentions-legales.html`](../mentions-legales.html) |

## Galeries déclarées dans les données mais sans page (routes manquantes)

`galeries.json` liste 6 galeries. 3 ont `"visible": false` et leur `page` cible **n'existe pas** dans le dépôt :

| Slug | Fichier `page` déclaré dans `galeries.json` | Existe ? |
|---|---|---|
| `ceremonies` | `galerie-ceremonies.html` | ❌ |
| `voyages` | `galerie-voyages.html` | ❌ |
| `la-reunion` | `galerie-lareunion.html` | ❌ |

Ces 3 galeries n'apparaissent donc pas sur `/galerie-index` (le fetch filtre sur `visible: true`), mais la structure de données les prévoit.

## Page technique

| URL | Rôle | Fichier source |
|---|---|---|
| `/404` (page d'erreur, non routée explicitement) | Page 404 personnalisée | [`404.html`](../404.html) |

## Interface d'administration (non listée dans la nav)

| URL | Rôle | Fichier source |
|---|---|---|
| `/admin` | Sveltia CMS (édition de `galeries.json`, `accueil.json`, tentative blog/boutique cassée — voir [01-stack.md](01-stack.md)) | [`admin/index.html`](../admin/index.html) |
| `/admin/video` (probable) | Page annexe liée à l'admin, contenu non exploré en détail | [`admin/video.html`](../admin/video.html) |

## Pages présentes dans le dépôt mais hors périmètre public (`noindex, nofollow`, bloquées par `robots.txt`)

| Fichier | Constat |
|---|---|
| [`boutique_backup.html`](../boutique_backup.html) | Ancienne version de la page boutique, structure quasi identique à `boutique.html` mais données différentes (voir [04-composants.md](04-composants.md) pour le doublon) |
| [`propositions-palettes-vf-images.html`](../propositions-palettes-vf-images.html) | Page de travail présentant 3 palettes de couleurs alternatives, jamais adoptées |
| [`raffinements-style-actuel.html`](../raffinements-style-actuel.html) | Page de travail sur des ajustements de style |

## Redirections 301 actives (`vercel.json`)

D'anciennes URLs vers les pages actuelles (nettoyage effectué début septembre 2026 — un dossier `/en/*` dupliquant tout le site en anglais a été supprimé, remplacé par un sélecteur de langue en JS sur chaque page, voir [03-design-tokens.md](03-design-tokens.md) pour le mécanisme) :

`/gallery` → `/galerie-index` · `/shop` → `/boutique` · `/about` → `/a-propos` · `/legal` → `/mentions-legales` · `/en/*` (toutes variantes) → page FR équivalente

## Comptage

- **11** pages de contenu public indexées
- **2** fiches produit édition limitée
- **1** page légale
- **3** galeries prévues dans les données mais sans page construite
- **3** pages de travail/brouillon hors périmètre
- **1** page 404
- **1** interface admin (+ 1 page annexe)
