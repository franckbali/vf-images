# 01 — Stack technique

Constaté dans le code au 3 septembre 2026. Pas d'accès à l'hébergement (Vercel) ni aux comptes tiers — tout ce qui suit vient uniquement des fichiers du dépôt.

## Nature du site

Site **HTML statique** — aucun framework JS (pas de React/Vue/etc.), aucune étape de build, aucun bundler. Chaque page est un fichier `.html` autonome servi tel quel. `package.json` ne déclare qu'une seule dépendance :

```json
{
  "name": "vf-images",
  "version": "1.0.0",
  "private": true,
  "dependencies": { "stripe": "^16.0.0" }
}
```
Le SDK Stripe n'est utilisé que côté serveur (dossier `api/`), jamais côté navigateur.

## Hébergement / déploiement

- **Vercel**, configuré via [`vercel.json`](../vercel.json) à la racine.
- `cleanUrls: true` — les fichiers `.html` sont servis sans extension (`/a-propos.html` accessible en `/a-propos`).
- `trailingSlash: false`.
- Le fichier définit aussi des **redirections 301** (anciennes URL `/en/*`, `/gallery`, `/shop`, `/about`, `/legal` → pages actuelles) et des règles de **cache HTTP** par type de fichier (`headers`).
- Pas de fichier `.env` dans le dépôt : les clés (Stripe, Creativehub) sont forcément stockées dans les variables d'environnement Vercel, invisibles depuis le code.

## Backend / API

Trois fonctions serverless dans [`api/`](../api/), format Vercel (un fichier = une route) :
- [`api/create-checkout.js`](../api/create-checkout.js) — crée une session Stripe Checkout.
- [`api/stripe-webhook.js`](../api/stripe-webhook.js) — reçoit l'événement `checkout.session.completed` de Stripe, transmet la commande à l'API Creativehub (impression à la demande).
- [`api/edition-status.js`](../api/edition-status.js) — endpoint interrogé par les pages `editions/*.html` (compteur d'exemplaires restants).

Aucun serveur applicatif classique (pas de Node/Express persistant) : uniquement des fonctions à la demande.

## CMS

**Sveltia CMS**, une interface d'admin qui écrit directement dans le dépôt GitHub (backend `github`, pas de base de données séparée). Configuré dans [`admin/config.yml`](../admin/config.yml) :

```yaml
backend:
  name: github
  repo: franckbali/vf-images
  branch: main
media_folder: "images"
```

Interface accessible sur `/admin` ([`admin/index.html`](../admin/index.html), 291 octets — charge le script Sveltia CMS en CDN, aucune logique custom).

**4 collections déclarées, mais 1 est cassée :**
| Collection | Fichier cible déclaré | Existe réellement ? |
|---|---|---|
| Galeries photos | `galeries.json` | ✅ |
| Articles de blog | dossier `blog/` (fichiers `.md`) | ❌ **le dossier `blog/` n'existe pas dans le dépôt** |
| Accueil | `accueil.json` | ✅ |
| Boutique | `boutique.json` | ❌ **`boutique.json` n'existe pas** — le vrai fichier de données boutique s'appelle [`catalogue.json`](../catalogue.json), non déclaré dans le CMS |

Conséquence factuelle : dans l'interface `/admin`, les onglets "Articles de blog" et "Boutique" ne peuvent pas fonctionner tels que configurés (fichier/dossier cible absent). Les 3 articles de blog existants ([`blog-article.html`](../blog-article.html), [`blog-article-reunion.html`](../blog-article-reunion.html), et la page liste [`blog.html`](../blog.html)) sont du HTML écrit à la main, pas généré depuis des fichiers `.md`.

## Où vit chaque type de contenu

| Contenu | Emplacement | Édité via |
|---|---|---|
| Liste des 6 galeries (titres, sous-titres, cover, visibilité) | [`galeries.json`](../galeries.json) | CMS (collection "Galeries") |
| Photos de la page d'accueil (portfolio, section À propos, fond CTA) | [`accueil.json`](../accueil.json) | CMS (collection "Accueil") |
| Catalogue boutique (titres, prix, formats, SKU Creativehub) | [`catalogue.json`](../catalogue.json) | **Édition manuelle du fichier** (pas de collection CMS fonctionnelle) |
| Contenu des 3 galeries individuelles (photos, texte éditorial) | codé en dur dans [`galerie-bali.html`](../galerie-bali.html), [`galerie-newyork.html`](../galerie-newyork.html), [`galerie-portraits.html`](../galerie-portraits.html) | Édition manuelle du HTML — voir [06-problemes.md](06-problemes.md) |
| Articles de blog | codés en dur dans [`blog-article.html`](../blog-article.html) et [`blog-article-reunion.html`](../blog-article-reunion.html) | Édition manuelle du HTML |
| Textes fixes de chaque page (nav, hero, CTA, footer, mentions légales…) | codés en dur dans chaque `.html` | Édition manuelle du HTML |
| Traductions FR/EN | attributs `data-fr` / `data-en` sur les éléments HTML concernés, voir [03-design-tokens.md](03-design-tokens.md) et [04-composants.md](04-composants.md) | Édition manuelle du HTML |
| Photos sources | dossier `images/` (559 fichiers, 130 Mo), formats mélangés : 386 `.webp`, 120 `.jpg`, 41 `.avif`, 9 `.png`, 3 `.svg` | Script Python externe (`traiter-photos.py`, hors dépôt HTML) |

## CSS

- **1 feuille de style partagée** : [`style.css`](../style.css) (223 lignes), chargée par 17 des 19 pages HTML.
- **Beaucoup de CSS dupliqué en `<style>` inline** dans le `<head>` de chaque page, en plus de `style.css` — voir [03-design-tokens.md](03-design-tokens.md) pour l'ampleur de la duplication.
- Les 2 pages `editions/portrait-bali-012.html` et `editions/portrait-bali-369.html` **ne chargent pas `style.css`** — CSS entièrement autonome, redéfinissant ses propres variables de couleur avec des valeurs différentes du reste du site (voir [03-design-tokens.md](03-design-tokens.md)).
- La page `propositions-palettes-vf-images.html` (brouillon, `noindex`) ne charge pas non plus `style.css`.

## JavaScript

- Aucun framework. JS vanilla, un `<script>` par page (souvent dupliqué presque à l'identique d'une page à l'autre : IIFE de gestion de langue, lightbox, animations au scroll).
- [`nav-scroll.js`](../nav-scroll.js) — seul fichier JS externe partagé, chargé par plusieurs pages (comportement de la nav au scroll).
- Script tiers externe unique : `https://analytics.umami.is/script.js` (Umami Analytics), chargé conditionnellement après consentement cookies.

## Polices

Google Fonts, chargées en `<link>` (pas de self-hosting), avec un `preload` + fallback `noscript`. Familles réellement utilisées sur les pages en ligne : **Raleway, Bodoni Moda, Lora**, plus **Cormorant Garamond** (un seul usage, dans `index.html`). Détail dans [03-design-tokens.md](03-design-tokens.md).

## Fichiers de configuration SEO / plateforme

- [`sitemap.xml`](../sitemap.xml) — 13 URLs, `hreflang` fr/x-default.
- [`robots.txt`](../robots.txt) — bloque `/admin/`, `/boutique_backup`, `/propositions-palettes-vf-images`, `/raffinements-style-actuel`.
- [`manifest.json`](../manifest.json) — PWA manifest.

## Pages/fichiers hors périmètre du site public

Présents dans le dépôt mais non listés dans la nav ni le sitemap :
- `boutique_backup.html`, `propositions-palettes-vf-images.html`, `raffinements-style-actuel.html` — brouillons/anciennes versions, `noindex, nofollow`, bloqués dans `robots.txt`.
- `404.html` — page d'erreur.
- Dossiers `input/`, `photos-originales/`, `printspace/`, `galeries/` (contient un seul fichier `essai.md`) — matière de travail, pas servis en HTML.
