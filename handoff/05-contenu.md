# 05 — Contenu de l'interface

Textes d'interface extraits tels quels du code (attributs `data-fr`/`data-en` quand ils existent). Le texte long des articles de blog et des mentions légales n'est pas reproduit ici (voir directement les fichiers sources listés dans [02-arborescence.md](02-arborescence.md)) — ce document couvre nav, boutons, formulaires, messages, footer et métadonnées, comme demandé.

## Navigation principale (identique sur toutes les pages publiques)

| FR | EN |
|---|---|
| Accueil | Home |
| Galerie | Gallery |
| À propos | About |
| Boutique | Shop |
| Journal | Journal |
| Contact | Contact |

Sélecteur de langue : boutons `FR` / `EN` (texte identique dans les deux langues, sert de bascule).

## Footer (identique sur toutes les pages publiques)

| FR | EN |
|---|---|
| © 2026 Franck Vinel — VF Images. Tous droits réservés. | © 2026 Franck Vinel — VF Images. All rights reserved. |
| Mentions légales | Legal notice |

Icône Instagram : `aria-label="Suivre VF Images sur Instagram (nouvelle fenêtre)"` (pas de version EN de ce label — voir [06-problemes.md](06-problemes.md)).

## Bandeau consentement cookies (RGPD)

Sur 12 pages (classes `.cookie-btn-accept`/`.cookie-btn-refuse`) :

| FR | EN |
|---|---|
| Ce site utilise des cookies analytiques anonymes (Umami) pour comprendre comment vous naviguez, sans stocker de données personnelles. Aucune publicité, aucun partage tiers. | This site uses anonymous analytics cookies (Umami) to understand how you browse, without storing personal data. No advertising, no third-party sharing. |
| En savoir plus | Learn more |
| Refuser | Decline |
| Accepter | Accept |

Sur `blog-article-reunion.html` (classes `.cookie-btns`/`.cookie-btn.accept`, définies dans `style.css`) : mêmes textes, markup différent (voir [04-composants.md](04-composants.md)).

## Formulaire de contact (`contact.html`)

| Élément | FR | EN |
|---|---|---|
| Intro | Votre message | Your message |
| Boutons sujet | Tirage Fine Art / Commande sur mesure / Collaboration / Autre | Fine Art Print / Custom order / Collaboration / Other |
| Label | Votre nom | Your name |
| Placeholder nom | Prénom Nom | First Last |
| Label | Sujet | Subject |
| Label | Email | Email |
| Placeholder email | votre@email.com | *(identique, pas de variante EN)* |
| Label | Message | Message |
| Placeholder message | Décrivez votre projet, la photo qui vous intéresse, le format souhaité... | Describe your project, the photo you're interested in, the desired format... |
| Bouton d'envoi | Envoyer | Send |
| Titre succès | Message envoyé | Message sent |
| Texte succès | Merci pour votre message. Je vous réponds dans les meilleurs délais depuis Bali. | Thank you for your message. I will reply as soon as possible from Bali. |

Aucun message d'erreur de validation personnalisé trouvé dans le HTML (`required` HTML natif sur les champs nom/email/message — les messages d'erreur affichés dépendent donc du navigateur, pas de texte custom défini côté site).

## Page 404 (`404.html`)

**Cette page n'a aucun attribut `data-fr`/`data-en` — elle n'est disponible qu'en français**, contrairement au reste du site :

> 404
> VF Images
> La page que vous cherchez s'est égarée quelque part entre Bali et New York.
> [Accueil] [Galerie] [Boutique]

## Boutons / CTA relevés sur `boutique.html`

Échantillon de libellés `data-fr` trouvés (liste non exhaustive, un par variante distincte) :
`Commander ce tirage` · `En savoir plus` · `Certificat d'authenticité` · `Chaque tirage imprimé pour vous` · `Format` · `Livraison en Europe offerte` · `Livraison hors Europe · Me contacter` · `Livraison mondiale` · `Fine Art Baryta · Fuji Crystal` · `Hahnemühle Photo Rag · Fine Art Baryta` · `Hahnemühle Photo Rag · Fuji Crystal` · `Hahnemühle · Fuji Crystal · Baryta`

Noms de photos (titres produits) : `Colibri · Costa Rica` · `Cérémonie · Bali` · `Faune Sacrée` · `Fenêtre sur l'Océan` · `Forêt des singes · Bali` · `Manhattan` · `Offrandes · Bali`

## Fiches édition limitée (`editions/portrait-bali-012.html`, `editions/portrait-bali-369.html`)

Textes définis dans l'objet JS `T` (voir [04-composants.md](04-composants.md)) :

| Clé | FR | EN |
|---|---|---|
| eyebrow | Édition Limitée · 100 × 70 cm | Limited Edition · 100 × 70 cm |
| sub | exemplaires disponibles | prints available |
| subSoldOut | Édition épuisée | Edition sold out |
| lblPaper | Papier | Paper |
| lblFormat | Format | Size |
| lblArtist | Photographe | Photographer |
| auth | Chaque exemplaire est accompagné d'un certificat d'authenticité numéroté et signé en fac-similé par l'artiste. | Each print comes with a numbered certificate of authenticity, bearing the artist's facsimile signature. |
| back | ← Retour à la boutique | ← Back to shop |
| footer | © VF Images · Tous droits réservés | © VF Images · All rights reserved |

## Métadonnées SEO (title + description) par page

| Page | `<title>` | `<meta name="description">` |
|---|---|---|
| `/` | Photographies de Bali — Tirages Fine Art \| VF Images | Photographies Fine Art de Bali et du monde par Franck. Tirages en édition limitée, livraison mondiale. Capturez l'âme de Bali dans votre intérieur. |
| `/a-propos` | À propos – Franck, photographe Fine Art à Bali \| VF Images | Franck, photographe français basé à Bali. Tirages Fine Art édition limitée, collections privées en France, USA, Australie. |
| `/galerie-index` | Galeries Photo – Bali, New York, Monde \| VF Images | Explorez les galeries de Franck : Bali, New York, La Réunion, Bolivie. Photographies Fine Art disponibles en tirage limité. |
| `/galerie-bali` | Bali — Temples, Rites & Instants \| VF Images | Collection photographique Bali par Franck. Offrandes, rituels et temples en tirages Fine Art édition limitée. |
| `/galerie-newyork` | New York — Tirages Fine Art \| VF Images | Collection photographique New York par Franck. Manhattan, SoHo, Brooklyn en tirages Fine Art édition limitée. |
| `/galerie-portraits` | Portraits — Visages du monde \| VF Images | Collection Portraits par Franck Vinel — Bali, Bolivie. Visages de cérémonie, regards vrais, humanité photographiée en Fine Art. |
| `/boutique` | Boutique Tirages Fine Art – VF Images | Tirages Fine Art de Bali et du monde. Éditions limitées numérotées, papier Hahnemühle museum. Livraison internationale 7-10 jours. |
| `/contact` | Contact – VF Images \| Photographe Fine Art Bali | Contactez Franck pour des projets photographiques, commandes privées ou questions sur les tirages Fine Art. Basé à Bali, disponible dans le monde. |
| `/blog` | Journal — Écrits & Lens of Wonder \| VF Images | Écrits contemplatifs sur la photographie et les voyages. Vlogs Bali et voyages par The Lens of Wonder — Instagram et YouTube de Franck. |
| `/blog-article` | Melasti, ou l'âme rendue à la mer — Notes d'un photographe \| VF Images | Melasti à Petitenget : une journée de purification où Bali vient laver son monde et son âme dans la mer. Récit et photographies d'un photographe Fine Art basé à Bali. |
| `/blog-article-reunion` | Cari feu de bois — La Réunion \| VF Images | Un pique-nique créole au Maïdo, un rougail saucisses cuisiné au feu de bois, des amis et un lieu magique. La Réunion comme on l'aime. |
| `/mentions-legales` | Mentions Légales & Politique de Confidentialité – VF Images | Mentions légales, conditions générales de vente et politique de confidentialité RGPD de VF Images — photographies Fine Art. |
| `/editions/portrait-bali-012` | Portrait Balinais N°12 — Tirage Fine Art Édition Limitée \| VF Images | Portrait Balinais N°12 par Franck Vinel — tirage Fine Art en édition limitée à **7 exemplaires**. Hahnemühle Photo Rag · Fine Art Baryta · formats 45×30 à 100×70 cm. |
| `/editions/portrait-bali-369` | Portrait Balinais N°369 — Tirage Fine Art Édition Limitée \| VF Images | Portrait Balinais N°369 par Franck Vinel — tirage Fine Art en édition limitée à **7 exemplaires**. Hahnemühle Photo Rag · Fine Art Baryta · formats 45×30 à 100×70 cm. |

**Incohérence factuelle relevée** : les 2 meta descriptions des fiches édition limitée annoncent **"7 exemplaires"**, alors que [`catalogue.json`](../catalogue.json) (source de vérité du catalogue) déclare `"limited_edition": 15` pour ces mêmes tirages, à quatre reprises dans le fichier. Le nombre affiché dans le texte de partage Google/réseaux sociaux ne correspond pas au nombre réellement en vente.

## Tagline / signature de marque

Trouvée sur `index.html` (`.hero-tagline`) : **"True moments, world perspectives"** — en anglais même quand la langue active est le français (pas d'attribut `data-fr` sur cet élément).
