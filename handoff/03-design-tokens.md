# 03 — Design tokens

Toutes les valeurs ci-dessous sont extraites du code (`style.css` + les `<style>` inline de chaque page HTML publique). Rien n'est inventé ou arrondi pour faire joli — les incohérences listées sont réelles et mesurées.

## Constat structurel préalable

`style.css` (13 963 octets) est chargé par 17 des 19 pages, **mais chaque page ajoute en plus son propre bloc `<style>` inline dans le `<head>`**, qui redéfinit une bonne partie des styles plutôt que de s'appuyer uniquement sur la feuille partagée. Poids de CSS inline par page :

| Page | CSS inline (octets) |
|---|---|
| `boutique.html` | 23 924 |
| `galerie-newyork.html` | 23 225 |
| `index.html` | 20 770 |
| `blog.html` | 19 027 |
| `galerie-bali.html` | 18 870 |
| `contact.html` | 16 884 |
| `blog-article.html` | 15 656 |
| `galerie-index.html` | 15 010 |
| `galerie-portraits.html` | 14 794 |
| `a-propos.html` | 14 508 |
| `mentions-legales.html` | 10 406 |
| `blog-article-reunion.html` | 4 078 |

**La plupart des pages chargent donc plus de CSS inline que la feuille partagée elle-même ne pèse en tout.** Les 2 pages `editions/*.html` ne chargent même pas `style.css` : leur CSS est 100 % autonome, avec ses propres définitions de variables (voir plus bas, elles divergent des valeurs de `style.css`).

## Couleurs

### Variables CSS custom properties trouvées

Deux définitions différentes coexistent pour les mêmes noms de variable :

**Dans `style.css` (utilisée par 17 pages) :**
```css
--gold:#b08c4a;
--dark:#0d0b08;
--dark2:#14110d;
--dark3:#1c1812;
--light:#f5f3ef;
--text:rgba(245,243,239,.92);
--cream-warm:#dcd4c0;
--cream-soft:rgba(220,212,192,.65)
```

**Dans `editions/portrait-bali-012.html` et `editions/portrait-bali-369.html` (système autonome) :**
```css
--dark: #0a0a0a;
--gold: #c9a96e;
```
→ **`--gold` et `--dark` n'ont pas la même valeur selon qu'on est sur une fiche produit édition limitée ou sur le reste du site.**

### Toutes les couleurs hexadécimales utilisées (pages publiques + `style.css`, brouillons exclus)

15 couleurs distinctes recensées :

| Couleur | Occurrences | Usage apparent |
|---|---|---|
| `#c9a96e` | 14 | Or (accent), version "editions" |
| `#111` | 11 | Noir/fond |
| `#f5f3ef` | 3 | Crème clair (texte sur fond sombre) |
| `#0d0b08` | 3 | Noir/fond, version `style.css` |
| `#0a0a0a` | 3 | Noir/fond, version "editions" |
| `#fff` | 2 | Blanc |
| `#f0ede6` | 2 | Crème clair variante |
| `#000` | 2 | Noir pur |
| `#dcd4c0` | 1 | Crème chaud |
| `#b08c4a` | 1 | Or, version `style.css` |
| `#1c1812` | 1 | Noir variante |
| `#1a1410` | 1 | Noir variante |
| `#161616` | 1 | Noir variante |
| `#14110d` | 1 | Noir variante |
| `#0d0d0d` | 1 | Noir variante |

**Constat : 9 valeurs de noir/fond quasi identiques** (`#111`, `#0d0b08`, `#0a0a0a`, `#000`, `#1c1812`, `#1a1410`, `#161616`, `#14110d`, `#0d0d0d`) au lieu d'une palette de fond unifiée, et **2 valeurs différentes pour "l'or"** (`#c9a96e` vs `#b08c4a`), qui est pourtant la couleur signature de la marque d'après le fichier projet.

Les brouillons `propositions-palettes-vf-images.html` et `raffinements-style-actuel.html` ajoutent plus de 20 couleurs supplémentaires (palettes alternatives jamais adoptées) — non comptées ci-dessus car ces pages sont hors périmètre public (`noindex`).

## Typographie

### Polices chargées (Google Fonts, non self-hosted)

| Police | Pages qui la chargent |
|---|---|
| Raleway | Les 12 pages publiques (+ editions) |
| Lora | Les 12 pages publiques (+ editions) |
| Bodoni Moda | 10 pages (toutes sauf `galerie-index`, `galerie-bali`, `galerie-newyork`, `galerie-portraits`, `editions/*`) |
| Cormorant Garamond | **`index.html` uniquement**, un seul usage : `.hero-name` (titre "VF Images" du hero) |
| Fraunces, JetBrains Mono | Chargées uniquement par les 2 pages brouillon hors périmètre — absentes du site public |

### Tailles de police (`font-size`)

Deux systèmes coexistent :
- **92 déclarations `font-size: clamp(...)`** (responsive fluide) réparties dans le code.
- **Des dizaines de valeurs fixes** en `rem` (et quelques-unes en `px`, mélange d'unités). Échantillon de valeurs proches mais distinctes trouvées dans le même corpus : `.8rem`, `0.80rem`, `.82rem`, `.85rem`, `0.85rem`, `.88rem`, `.90rem`, `0.90rem`, `.92rem`, `.95rem` — dix valeurs différentes toutes comprises entre 0,8 et 0,95rem, sans qu'on distingue de système d'échelle (pas de suite type 12/14/16/18/24px).
- Mélange d'unités : la majorité du texte est en `rem`, mais certaines déclarations utilisent `px` (`14px`, `16px`, `18px`, `20px` relevés).

Aucun fichier de variables typographiques centralisé (pas de `--font-size-sm/md/lg` etc.) — chaque bloc de style redéfinit ses tailles localement.

## Breakpoints (`@media`)

12 seuils différents relevés dans le code, sans logique de système visible :

| Breakpoint | Occurrences |
|---|---|
| `max-width:900px` | 56 |
| `max-width:768px` | 28 |
| `max-width:480px` | 23 |
| `max-width:380px` | 6 |
| `max-width:1024px` | 6 |
| `max-width:500px` | 3 |
| `max-width:900px, (pointer:coarse)` | 3 |
| `max-width:600px` | 2 |
| `max-width:1100px` | 2 |
| `max-width: 720px` | 2 |
| `prefers-reduced-motion: reduce` | 11 (deux syntaxes différentes : avec et sans espace après les deux-points) |
| `pointer:coarse` | 1 |

900px et 768px dominent largement mais 10 autres valeurs ponctuelles s'y ajoutent, propres à telle ou telle page.

## Espacement (`gap`)

Valeurs de `gap` relevées dans `style.css` : `.3rem`, `.6rem`, `1rem`, `1.5rem`, `2rem`, `2.5rem`, `3rem`, `5px` — pas de grille d'espacement cohérente identifiée (pas de suite 4/8/16/24/32px ou équivalent rem), et une valeur en `px` (`5px`) au milieu de valeurs en `rem`.

## Rayons de bordure (`border-radius`)

Seulement 4 valeurs relevées dans tout le code : `2px`, `4px`, `50%` (deux fois, syntaxes `border-radius:50%` et `border-radius: 50%`). C'est la propriété la plus cohérente du système.

## Ce que ça signifie concrètement pour un audit

Il n'existe pas de fichier de tokens centralisé (pas de `:root` unique faisant autorité, pas de fichier `tokens.css`/`tokens.json`). `style.css` définit une base, mais elle est systématiquement contournée ou redéfinie dans le `<style>` inline de chaque page, et les 2 pages `editions/*.html` vivent avec leurs propres valeurs pour les couleurs de marque elles-mêmes.
