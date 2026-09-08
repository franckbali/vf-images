# 06 — Audit technique

Constats du 3 septembre 2026, obtenus par lecture du code source, requêtes locales (serveur statique), et un passage navigateur (console + réseau). Classé par gravité décroissante. Aucune solution n'est proposée ci-dessous, uniquement le constat et sa localisation exacte.

---

## Gravité haute — bugs fonctionnels / perte de données

### Le sélecteur de sujet du formulaire de contact ne transmet jamais sa valeur
Fichier : [`contact.html`](../contact.html), lignes 735-741 (boutons) vs ligne 745 (`<form>`) vs lignes 753-759 (`<select name="subject">`).

Il existe **deux éléments d'interface distincts pour choisir un sujet**, visuellement présentés l'un juste après l'autre comme s'il s'agissait d'une seule interaction :
1. Quatre boutons pastille (`.subject-btn` : "Tirage Fine Art", "Commande sur mesure", "Collaboration", "Autre"), placés **avant** l'ouverture de la balise `<form>` — donc hors du formulaire.
2. Un `<select name="subject">` **à l'intérieur** du formulaire, avec des libellés différents ("Commande tirage Fine Art", "Commande personnalisée", "Partenariat / Collaboration", "Question générale"), dont l'option par défaut est `disabled selected` ("Choisir un sujet...").

La fonction appelée au clic sur un bouton pastille :
```js
function selectSubject(btn){
  document.querySelectorAll('.subject-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
}
```
ne fait que déplacer une classe CSS `.active` — elle ne touche jamais au `<select>`. À la soumission, `submitForm()` envoie `new FormData(form)`, qui ne contient que les champs réellement dans le `<form>` : `name`, `email`, `subject` (le `<select>`, resté sur sa valeur par défaut si l'utilisateur ne l'a pas manuellement changé), `message`. **Le sujet visuellement choisi par clic sur une pastille n'est jamais celui envoyé.**

### Compteur d'exemplaires "édition limitée" incohérent avec le catalogue
Fichiers : [`editions/portrait-bali-012.html`](../editions/portrait-bali-012.html) et [`editions/portrait-bali-369.html`](../editions/portrait-bali-369.html), balises `<meta name="description">` et `<meta property="og:description">` — vs [`catalogue.json`](../catalogue.json).

Les deux fiches produit annoncent dans leur description (visible dans les résultats Google et les partages réseaux sociaux) : *"tirage Fine Art en édition limitée à 7 exemplaires"*. Le fichier `catalogue.json`, source de données du catalogue, déclare `"limited_edition": 15` pour ces mêmes tirages (format 100×70cm), à 4 endroits du fichier. Le nombre affiché publiquement et le nombre réel ne correspondent pas.

### Deux collections du CMS pointent vers des fichiers/dossiers inexistants
Fichier : [`admin/config.yml`](../admin/config.yml).
- Collection "Articles de blog" → `folder: "blog"` : **le dossier `blog/` n'existe pas** dans le dépôt.
- Collection "Boutique" → `file: "boutique.json"` : **ce fichier n'existe pas** ; les données boutique réelles sont dans `catalogue.json`, non déclaré dans le CMS.

Détail dans [01-stack.md](01-stack.md).

---

## Gravité moyenne — accessibilité et cohérence

### Contrastes de texte insuffisants (chiffrés)
Plusieurs textes utilisent la couleur crème (`rgb(245,243,239)`) à très faible opacité sur fond quasi noir (`#0a0a0a`/`#0d0b08`). Ratios de contraste calculés (seuil WCAG AA : 4.5:1 pour texte normal, 3:1 pour texte large) :

| Opacité utilisée | Contraste obtenu | Conforme AA (texte normal) ? |
|---|---|---|
| .92 (texte principal) | 15.1:1 | ✅ |
| .55 | 5.75:1 | ✅ |
| .45 | 4.17:1 | ❌ (limite) |
| .35 | 2.94:1 | ❌ |
| .28 | 2.28:1 | ❌ |
| .22 | 1.83:1 | ❌ |

Exemples concrets de texte en `.28` ou `.22` (les plus fortes échecs) :
- [`a-propos.html:627`](../a-propos.html) — "Collections privées en France, États-Unis et Australie."
- [`blog.html:219,261,320`](../blog.html) — dates et labels des cartes vidéo.

### 11 images sans texte alternatif dans les fiches produit boutique
Fichier : [`boutique.html`](../boutique.html), classe `.modal-viz-artwork` (aperçus d'œuvre dans les modales détail produit). Les 11 images produit affichées dans ces modales ont `alt=""` — contrairement au reste du site où les photos portent une description. (À noter : les `alt=""` du carrousel `#lightbox-img` sur d'autres pages sont un cas différent, légitime — l'attribut est rempli dynamiquement en JS au moment de l'ouverture.)

### Traitement du focus clavier incohérent entre les pages
La majorité des pages (`index.html`, `a-propos.html`, `galerie-index.html`, `boutique.html`, `blog.html`) utilisent le motif `:focus:not(:focus-visible){outline:none}`, qui masque l'anneau de focus au clic souris mais le conserve à la navigation clavier — pratique correcte. `contact.html` s'en écarte pour ses champs de formulaire : `.form-textarea{outline:none}` (ligne ~201, non conditionné à `:focus-visible`) et `.form-input:focus{outline:none;border-color:var(--gold)}` (ligne ~463) suppriment l'anneau de focus natif sans condition, le remplaçant uniquement par un changement de couleur de bordure.

### Page 404 non traduite
Fichier : [`404.html`](../404.html) — aucun attribut `data-fr`/`data-en`, contrairement aux 12 autres pages publiques. Le sélecteur de langue n'apparaît même pas sur cette page.

### Élément non traduit sur l'accueil
Fichier : [`index.html`](../index.html), classe `.hero-tagline` — le texte "True moments, world perspectives" reste identique quelle que soit la langue active (pas d'attribut `data-fr`).

### `aria-label` non traduit
Icône Instagram du footer, sur toutes les pages : `aria-label="Suivre VF Images sur Instagram (nouvelle fenêtre)"` — reste en français même en version anglaise du site.

### Deux données structurées JSON-LD manquantes
`blog-article-reunion.html` et `mentions-legales.html` sont les 2 seules pages publiques sans bloc `<script type="application/ld+json">`, alors que leurs pages comparables en ont un (voir [04-composants.md](04-composants.md)).

---

## Gravité moyenne — performance

### Une image de 2,8 Mo servie sans variante responsive
Fichier : [`images/salon-gris-moderne.png`](../images/salon-gris-moderne.png), utilisée en `background-image` dans [`boutique.html`](../boutique.html) (lignes 163 et 229). C'est un fichier `.png` de 2,8 Mo, sans déclinaison `.webp`/`.avif` ni `srcset` (le `background-image` CSS ne permet de toute façon pas de srcset).

### ~8 Mo de fichiers image orphelins dans `images/`
Aucun fichier HTML, JSON ou CSS du dépôt ne référence ces fichiers :
- `images/salon gris moderne.png` (2,8 Mo — doublon du fichier ci-dessus, avec espaces dans le nom)
- `images/logo_white2.png` (1,3 Mo)
- `images/logo-medium.png` (1,3 Mo)
- `images/logo-large.png` (1,3 Mo)
- `images/Logo Blanc.png` (1,3 Mo)

### CSS dupliqué à chaque page plutôt que mutualisé
Détaillé dans [03-design-tokens.md](03-design-tokens.md) : chaque page charge `style.css` (14 Ko) **et** son propre bloc `<style>` inline (de 4 à 24 Ko selon la page). La plupart des pages transportent donc plus de CSS dans leur propre `<head>` que la feuille partagée ne pèse en tout, ce qui empêche ce CSS d'être mis en cache par le navigateur d'une page à l'autre.

---

## Gravité faible — cohérence visuelle / structure

### Pas de système de breakpoints unifié
12 seuils `@media` différents relevés dans le code (900px, 768px, 480px, 1024px, 380px, 720px, 600px, 500px, 1100px…). Détail dans [03-design-tokens.md](03-design-tokens.md).

### Pas de palette de couleurs centralisée
9 valeurs de noir/fond quasi identiques, 2 valeurs différentes pour la couleur "or" de marque (`#c9a96e` sur les pages `editions/`, `#b08c4a` dans `style.css`). Détail dans [03-design-tokens.md](03-design-tokens.md).

### Pas d'échelle typographique
Dizaines de tailles de police fixes proches mais distinctes (ex. dix valeurs différentes entre 0,8rem et 0,95rem), mélange d'unités `rem`/`px`. Détail dans [03-design-tokens.md](03-design-tokens.md).

### Nommage incohérent du composant "titre de page"
7 noms de classe différents pour ce qui est structurellement le même rôle (`.hero-title`, `.intro-title`, `.article-title`, `.page-hero-title`, `.contact-title`, `.page-title`, `.edition-title`). Détail dans [04-composants.md](04-composants.md).

### 3 galeries déclarées dans les données sans page construite
`galeries.json` prévoit "Cérémonies", "Voyages", "La Réunion" (`visible:false`), dont les fichiers `page` cibles (`galerie-ceremonies.html`, `galerie-voyages.html`, `galerie-lareunion.html`) n'existent pas. Détail dans [02-arborescence.md](02-arborescence.md).

### Code mort : composant vidéo avec upload de fichier
Règles CSS pour un composant "zone de dépôt vidéo" (`.video-block`, `.upload-demo`, `#videoFileInput`) présentes dans plusieurs pages sans qu'aucune instance HTML ne soit montée sur les pages publiques actuelles. Détail dans [04-composants.md](04-composants.md).

### Fichier dupliqué en boutique
[`boutique_backup.html`](../boutique_backup.html) reproduit la structure de [`boutique.html`](../boutique.html) avec des données différentes ; `noindex`, non lié depuis aucune page vivante, mais toujours présent dans le dépôt.

---

## Points vérifiés sans anomalie relevée

- **Liens et images cassés** : 0 référence cassée sur les 15 pages publiques testées (scan complet des `href`/`src`, état au 3 septembre 2026).
- **Erreurs console** : aucune erreur JS relevée sur `boutique.html` (page la plus riche en interactions) lors d'un chargement local.
- **Scripts bloquants** : aucun `<script>` sans `async`/`defer` dans le `<head>` des pages testées.
- **Formats d'image responsive** : 559 fichiers dans `images/`, seul 1 fichier `.jpg` n'a aucune déclinaison `.webp`.
