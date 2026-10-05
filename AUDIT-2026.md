# AUDIT VF Images — septembre 2026

> **Pour Claude Code :** audit du site en production (vfimages.com), réalisé depuis l'extérieur par un consultant externe. Il remplace `AUDIT.md` (mai 2026), dont plusieurs actions ont été faites depuis (wordmark Bodoni, logo SVG, preconnect fonts, skip link, bandeau cookies, Umami, menu mobile apparent, WebP sur les héros).
>
> **Mission :** parcourir chaque action, vérifier son état réel dans le code, marquer le statut, puis proposer les 5 premières à traiter. **N'implémenter rien avant validation explicite de Franck.**

| Statut | Sens |
|--------|------|
| `[ ]`  | À faire |
| `[~]`  | Partiellement fait |
| `[x]`  | Fait |
| `[—]`  | Non faisable / non pertinent |

**Note globale : 4,4 / 10** — sévère parce que le site est évalué comme boutique, pas comme portfolio. Les fondations (identité, images, typo, métadonnées, code statique propre) sont bonnes. Ce qui manque relève de décisions et d'exécution.

---

## Vérification du 5 octobre 2026

**Bilan : 9 faites, 8 partielles, 3 à faire** (08 témoignages, 09 page « Le tirage », 17 newsletter). Pour le référencement, les plus utiles sont 09, 19 et 20.

**Les 5 prochaines actions proposées :**
1. **12 — afficher lieu / date / histoire sur les fiches boutique** (les données existent déjà, ~1 h).
2. **09 — page « Le tirage »** : papier, atelier, emballage (photos de livraison), certificat, délais, retours. Répond aux objections d'achat et se référence bien.
3. **08 — un premier témoignage** (la phrase de l'ami qui a reçu le tirage, avec son accord) + intégrer les photos de livraison sur À propos (reste de 07).
4. **19 / 20 — référencement** : pages anglaises avec leurs propres URLs, puis la page « cérémonies de Bali, mois par mois ».
5. **18 + 14 — finitions** : focus clavier du panneau produit et de la lightbox, miniatures YouTube du blog.


---

## Constat central

**La boutique ne peut prendre aucune commande.** Sur les 9 tirages :

| Œuvre | État du bouton d'achat |
|---|---|
| Faune Sacrée | lien mort → `#` |
| Procession Barong | lien mort → `#` |
| Rituels & Offrandes | lien mort → `#` |
| Manhattan | lien mort → `#` |
| Fenêtre sur l'Océan | lien mort → `#` |
| Portrait · Bali (012) | non cliquable — texte sans lien |
| Portrait · Bali (369) | non cliquable — texte sans lien |
| Colibri · Costa Rica | non cliquable — texte sans lien |
| Offrandes · Bali | non cliquable — texte sans lien |

Seule action réellement disponible : un `mailto` « Livraison hors Europe · Me contacter ». Le visiteur européen — la cible à qui la livraison est offerte — n'a aucune action possible.

## Les 5 problèmes majeurs

1. Aucun chemin d'achat fonctionnel (9 produits, 0 bouton actif).
2. La page Galerie est vide — et c'est le 2e item du menu.
3. L'offre se contredit : bandeau « Certificat · Numéroté · Édition limitée » vs `Édition : Tirage ouvert` sur chaque fiche, plus « Signature reproduite » écrit en clair.
4. Aucune preuve : ni photo de Franck adulte, ni témoignage, ni tirage réel, ni certificat, ni CGV.
5. Le positionnement rare (vivre à Bali, accès aux cérémonies) n'est écrit nulle part.

## Deux décisions à trancher avant tout développement

- **D1 — Comment on achète ?** (a) redirection theprintspace, (b) **Stripe Payment Links** par œuvre et par format — recommandé, gratuit, impression commandée manuellement derrière, (c) formulaire + devis + facture.
- **D2 — Édition limitée ou tirage ouvert ?** Pas de moyen terme. L'option « édition de 30 numérotée » justifie les prix ; « tirage ouvert signé » est honnête mais plafonne. Toute la copie du site, le certificat et la logistique de signature en découlent.

---

# 🔴 PRIORITÉ 1 — cette semaine

## `[x]` 01. Câbler l'achat

> **État (5 oct. 2026) :** Fait. `handleCheckout` → `/api/create-checkout` (Stripe Checkout) sur les 4 tirages en vente, flux jusqu'à Creativehub testé avec un vrai achat. Les 5 fiches à bouton mort ont été retirées de la boutique.

**Impact :** décisif · **Difficulté :** moyenne · **Temps :** 1 journée

**Problème :** 9 produits, 0 bouton fonctionnel. 5 `href="#"`, 4 éléments non-liens.

**Solution :** un lien de paiement par œuvre **et par format** (dépend de D1). Aucun bouton d'achat ne doit rester en `#`. Les 4 boutons non-liens doivent devenir des `<a>` ou `<button>` — ils sont aussi invisibles au clavier et aux lecteurs d'écran.

**Fichiers :** `boutique.html` (grille + panneau détail)

---

## `[x]` 02. Trancher et harmoniser la question de l'édition

> **État (5 oct. 2026) :** Fait. Tirage ouvert (45×30, 60×40…) + format limité à 15 exemplaires, libellés harmonisés, certificat numérique « Édition ouverte » / « Exemplaire N° X / 15 ». « Signature reproduite » conservé volontairement (transparence : Fra ne signe pas à la main).

**Impact :** fort · **Difficulté :** décision · **Temps :** 1 h après décision

**Problème :** trois contradictions sur le même écran.
- bandeau boutique : « Certificat d'authenticité · Signature reproduite · Numéroté · Édition limitée »
- méta-description : « Éditions limitées numérotées »
- chaque fiche : `Édition — Tirage ouvert`

**Solution :** appliquer D2 partout — fiches, bandeau, métas, OG, accueil, À propos. **Supprimer « Signature reproduite » dans tous les cas** : une signature imprimée annule la valeur du certificat. Résoudre la logistique de signature à la main (les tirages partent de theprintspace sans passer par les mains de Franck).

**Fichiers :** `boutique.html`, `index.html`, métas de toutes les pages

---

## `[x]` 03. Régler la Galerie

> **État (5 oct. 2026) :** Fait. `galerie-index` lit `galeries.json` et affiche les collections visibles (Bali, Mekotek, Portraits, New York).

**Impact :** fort · **Difficulté :** faible · **Temps :** 15 min ou 1 week-end

**Problème :** `galerie-index.html` n'affiche qu'un héros, un H1 et « Explorez les collections ». Zéro collection, zéro lien. C'est le 1er clic naturel d'un visiteur qui veut voir le travail avant d'acheter. L'accueil y renvoie aussi via « Voir la galerie complète ».

**Solution — option courte (à faire ce soir) :** retirer l'item « Galerie » du menu + le lien de l'accueil.
**Solution — option juste :** construire la collection Bali, puis rétablir les liens.

**Fichiers :** `galerie-index.html`, nav de toutes les pages, `index.html`

---

## `[x]` 04. Prix par format, mis à jour en direct

> **État (5 oct. 2026) :** Fait. Prix par format (95 / 190 / 690 €) mis à jour au clic, `catalogue.json` = source de vérité.

**Impact :** fort · **Difficulté :** faible · **Temps :** 2 h

**Problème :** 4 boutons de format, un prix statique « À partir de 95 € ». 8 œuvres sur 9 au même prix. L'acheteur ne peut pas savoir ce que coûte un 80×120 — frein d'achat n°1 après le bouton mort.

**Solution :** grille de prix réelle en `data-prices`, prix mis à jour au clic sur le format. **Récupérer d'abord les tarifs theprintspace** pour calculer les marges.

```html
<div class="product" data-prices='{"30x40":95,"40x60":145,"60x90":230,"80x120":380}'>
```

**Fichiers :** `boutique.html` + JS

---

## `[x]` 05. Nettoyer les mensonges passifs

> **État (5 oct. 2026) :** Fait pour l'essentiel : « — cm » retiré, « Tous les articles » corrigé, modale de commande câblée, homonymes boutique résolus (« Les Années » / « La Bénédiction »). Reste seulement « Rituels · Bali » ×3 dans `galerie-bali`.

**Impact :** fort · **Difficulté :** très faible · **Temps :** 1 h

Chacun de ces détails dit au visiteur que le site n'est pas tenu :

- `[ ]` **`— cm`** affiché dans le panneau de détail : gabarit de dimensions non rempli, visible par le client.
- `[ ]` **Toggle FR / EN** visible sur toutes les pages, version EN inexistante.
- `[ ]` **« Tous les articles »** (`blog.html`) renvoie vers `blog-article.html` — un article, pas un index.
- `[ ]` **Deux œuvres titrées « Portrait · Bali »** (012 et 369), même lieu, même prix : à renommer distinctement.
- `[ ]` **Écart 3 / 4 formats** entre la vignette et le panneau de détail de la même œuvre.
- `[ ]` **Modale « Commande confirmée »** présente dans `boutique.html` alors qu'aucun tunnel n'y mène : à câbler ou retirer.
- `[ ]` **Lien Instagram du footer** dont l'intitulé est l'URL brute.

**Fichiers :** `boutique.html`, `blog.html`, footer commun, nav commune

---

## `[x]` 06. Réécrire le hero de l'accueil

> **État (5 oct. 2026) :** Fait. Hero accueil avec bandeau « Tirages Fine Art · Éditions limitées », prix d'appel et CTA « Voir les tirages ».

**Impact :** fort · **Difficulté :** faible · **Temps :** 2 h de rédaction

**Problème :** le hero est une plaque de nom (VF Images / Franck Vinel / « à travers mes yeux » / « Découvrir »). Aucune mention qu'il y a quelque chose à acheter, aucun prix, aucune preuve au-dessus du pli. « à travers mes yeux » est une tautologie ; « Découvrir » est le CTA le plus vague qui existe.

**Avant :** VF Images — Franck Vinel · à travers mes yeux
**Après :** Tirages d'art de Bali et du monde. Photographiés sur place, imprimés sur papier musée, numérotés et signés. À partir de 95 €.
**CTA :** « Voir les tirages » au lieu de « Découvrir ».

**Fichiers :** `index.html`

---

# 🟠 PRIORITÉ 2 — ce mois

## `[~]` 07. Les trois photos de preuve

> **État (5 oct. 2026) :** Boutique : fait le 5 oct. 2026 (section « De l'atelier à votre mur », 5 photos de la première livraison, sans filtre). Reste : l'intégrer aussi sur À propos. Le « colis étiqueté » a été écarté (nom du destinataire visible).

**Impact :** fort · **Temps :** 2 h (côté Franck) + intégration

Tirage encadré accroché à un mur · certificat posé sur une table · colis étiqueté prêt à partir. Téléphone, lumière naturelle, suffisant. À intégrer boutique + À propos, **sans filtre brightness/saturate**.

**Fichiers :** `/images/process/`, `boutique.html`, `a-propos.html`

---

## `[ ]` 08. Trois témoignages

> **État (5 oct. 2026) :** Rien en place. Une phrase de l'ami qui a reçu le premier tirage serait un début (avec son accord).

**Impact :** fort · **Temps :** 2 h + attente

Email aux acheteurs passés. Prénom, ville, deux phrases. Section sobre en bas de boutique. Actuellement : zéro preuve sociale, et « Collections privées en France, États-Unis et Australie » n'est étayée par rien.

**Fichiers :** `boutique.html`

---

## `[ ]` 09. Page « Le tirage »

> **État (5 oct. 2026) :** Aucune page « Le tirage » (papier, encres, atelier, emballage, délais, retours). Les photos de livraison et le certificat fourniraient le contenu.

**Impact :** fort · **Temps :** 1 dimanche

Papier, encres, atelier partenaire, marges, signature, certificat, emballage, délais, retour. Une seule page qui répond à la moitié des objections d'achat. Lien depuis le footer et sous chaque bouton d'achat.

**Fichiers :** nouvelle page + footer + `boutique.html`

---

## `[~]` 10. CGV et politique de retour

> **État (5 oct. 2026) :** CGV + retours/remboursements présents, mais dans `mentions-legales.html` (pas de page dédiée ; le lien du footer s'appelle « Mentions légales »). À décider : renommer le lien ou créer une page CGV.

**Impact :** fort · **Temps :** 3 h

**Problème :** le footer ne porte que « Mentions légales ». Aucune CGV, aucune politique de retour, aucun délai de rétractation, rien sur les dommages de transport — pour un site qui vend à des consommateurs européens depuis l'étranger. Disqualifiant sur un achat à 300 €.

**À vérifier aussi dans les mentions légales :** identité de l'éditeur, statut et pays d'activité, hébergeur.

**Fichiers :** nouvelle page CGV + footer + `mentions-legales.html`

---

## `[~]` 11. Réécrire l'À propos avec des faits

> **État (5 oct. 2026) :** Texte réécrit avec des faits (Ubud depuis 2022, 2016, école de 300 élèves). Reste : une photo de Franck aujourd'hui (il n'y a que 2 photos d'enfance) et vérifier l'alt de `franck-enfant.jpg`.

**Impact :** fort · **Temps :** 3 h

**Problème :** cinq paragraphes sans un seul fait vérifiable — aucune date, aucun lieu précis, aucun chiffre, aucune exposition, aucun nom. Texte interchangeable avec celui de n'importe quel photographe. Deux photos d'enfance, aucune photo de Franck aujourd'hui.

**Avant :** « J'ai longtemps parcouru le monde un appareil photo à la main — d'abord en simple témoin, puis en véritable chercheur d'instants. »
**Après :** « Je vis à Bali depuis [X] ans. Assez longtemps pour qu'on me laisse entrer dans les temples pendant les cérémonies, et pour savoir à quelle heure la lumière tombe sur les offrandes de Galungan. »

Ramener de 5 paragraphes à 3. Ajouter une photo de Franck en situation. Corriger l'alt vide de `franck-enfant.jpg`.

**Fichiers :** `a-propos.html`

---

## `[~]` 12. Légendes enrichies sur chaque œuvre

> **État (5 oct. 2026) :** Galeries : descriptions et titres EN faits. Fiches boutique : lieu, date et histoire de chaque tirage existent dans `catalogue.json` mais ne sont pas affichés dans le panneau détail — gain rapide.

**Impact :** fort · **Temps :** 3 h de rédaction (Franck) + intégration

**Problème :** « Forêt des singes · Bali » est une étiquette, pas une légende. Une photo sans légende reste un poster ; datée, située, racontée, elle devient une pièce documentée — c'est ce qui justifie 300 € plutôt que 40 €.

**Format :** titre · lieu précis · date · circonstance · édition · papier.
**Exemple :** « Faune Sacrée — Mandala Suci Wenara Wana, Ubud. Février 2024, à l'ouverture, avant les visiteurs. Édition de 30, papier Hahnemühle Photo Rag. »

**Fichiers :** `boutique.html`, panneau détail, lightbox, galeries

---

## `[x]` 13. Accorder canonicals et liens internes

> **État (5 oct. 2026) :** Fait. Canonicals et liens internes sans extension, sitemap à jour (Ngaben ajouté 5 oct.), redirections 301.

**Impact :** moyen · **Temps :** 2 h

**Problème :** les canonicals pointent vers `/boutique`, `/a-propos`, `/` (sans extension) ; tous les liens internes pointent vers `/boutique.html`, `/a-propos.html`, `/index.html`. Google voit deux URL par page et un signal contradictoire.

**Solution :** une seule forme sur tout le site — le plus simple étant des canonicals en `.html`, identiques aux liens réels. Puis Google Search Console : soumettre, contrôler la couverture, lire les requêtes réelles.

**À vérifier au passage :** présence et validité de `sitemap.xml` et `robots.txt` (non vérifiables depuis l'extérieur).

**Fichiers :** `<head>` de toutes les pages

---

## `[~]` 14. Images de boutique en AVIF/WebP + srcset

> **État (5 oct. 2026) :** Boutique : WebP + `srcset` + width/height faits. Reste : les 4 miniatures YouTube de `blog.html` sont toujours en `maxresdefault`.

**Impact :** moyen · **Temps :** 1 journée

**Problème :** les héros sont bien servis en WebP 1280 (`-h1280.webp`), mais les images de boutique restent en `.jpg`, un seul fichier servi identiquement au mobile et au desktop. Principal gisement de performance restant.

Ajouter `width` et `height` sur chaque `<img>` (CLS). Passer les miniatures YouTube de `maxresdefault.jpg` à `hqdefault` + lazy sur `blog.html` (4 fichiers lourds).

**Fichiers :** `/images/`, `boutique.html`, `blog.html`

---

# 🟢 PRIORITÉ 3 — optimisation

## `[x]` 15. Rationner l'or — 3 usages par page

> **État (5 oct. 2026) :** Fait (système or / crème : rareté, CTA, navigation).

**Impact :** moyen · **Temps :** 2 h

L'or `#c9a96e` apparaît dans les eyebrows, filets, prix, hovers, labels, bordures, theme-color. Une matière précieuse ne se lit comme précieuse que si elle est rare. Trois usages choisis par page, le reste en crème chaud (`#dcd4c0`).

---

## `[x]` 16. Différencier les héros de page

> **État (5 oct. 2026) :** Fait pour 5 pages sur 6, `svh` partout. Contact volontairement laissé tel quel (choix de Fra).

**Impact :** moyen · **Temps :** 1 journée

Les 6 pages ouvrent sur le même dispositif : image plein écran assombrie + eyebrow « VF Images » + H1 + une ligne. Résultat : on ne sait jamais où on est, et le site paraît être un gabarit répété. La boutique n'a pas besoin d'un plein écran contemplatif avant sa grille. Retirer aussi l'eyebrow « VF IMAGES » redondant avec la nav et le wordmark. Passer les `100vh` en `100svh` (barre d'URL iOS qui coupe le CTA).

---

## `[ ]` 17. Newsletter

> **État (5 oct. 2026) :** Aucune newsletter ni capture d'email.

**Impact :** moyen · **Temps :** 1/2 journée

Accès anticipé aux nouvelles séries, un email tous les deux mois. Capture l'audience Instagram qui n'achète pas aujourd'hui. Brevo gratuit convient.

---

## `[~]` 18. Finitions techniques et accessibilité

> **État (5 oct. 2026) :** Fait : JSON-LD, page 404, contrastes, aria-label Instagram. Reste : piège/retour de focus clavier dans le panneau produit et la lightbox, `aria-label` de quelques liens (« Lire », « Voir les formats »).

**Impact :** faible à moyen · **Temps :** 1 journée

- `[ ]` **JSON-LD** absent partout : `VisualArtwork` + `Offer` par tirage, `Person` sur l'À propos, `BreadcrumbList`.
- `[ ]` **Page 404** dans le langage visuel du site (`404.html` à la racine, servi automatiquement par GitHub Pages).
- `[ ]` **Contrastes des labels** : l'or à faible opacité sur les tailles 0,44–0,6 rem passe probablement sous 4,5:1. Plancher **0,72 rem**, opacité pleine, interlettrage ≤ 0,2 em sur tout label fonctionnel (prix, format, badge).
- `[ ]` **`aria-label`** sur les libellés non explicites : « Lire », « Voir les formats », lien Instagram.
- `[ ]` **Navigation clavier** : piège de focus dans le panneau produit et la lightbox, retour du focus après fermeture, visibilité des états de focus sur fond noir.
- `[ ]` **Retirer le filtre** `brightness/saturate` sur les vues détaillées et la lightbox — l'acheteur doit voir l'œuvre telle qu'il la recevra.
- `[ ]` **Fonts** : vérifier que la feuille Google ne bloque pas le rendu (`preconnect` déjà en place) ; réduire aux graisses réellement utilisées sur les 3 familles.

---

## `[~]` 19. Version anglaise

> **État (5 oct. 2026) :** Toggle FR/EN fonctionnel sur toutes les pages, textes traduits. Mais pas d'URL anglaises indexables (Google ne voit que le français, pas de hreflang `en`).

**Impact :** fort à terme · **Temps :** 2 jours

Six pages. Le toggle est déjà dessiné. Les acheteurs les plus proches géographiquement (Bali, Australie, USA) sont anglophones.

---

## `[~]` 20. Contenu éditorial régulier

> **État (5 oct. 2026) :** 3 articles (Melasti, Mekotek, Ngaben) + galerie Mekotek. Reste : la page « cérémonies de Bali, mois par mois » et le rythme régulier.

**Impact :** fort à terme · **Temps :** continu

**Problème :** deux articles seulement, le plus récent de mars 2025, l'autre d'août 2020 (« Cari feu de bois » — un repas entre amis, hors sujet avec le positionnement fine art : à archiver). Rien à indexer sur « photographie cérémonie Bali », la requête la plus rentable.

**À produire :** une page « les cérémonies de Bali, mois par mois » (Galungan, Nyepi, Melasti, Kuningan — actif SEO que personne d'autre ne peut produire aussi bien), puis un article tous les deux mois, chacun lié au tirage correspondant. L'article Melasti existant est le meilleur texte du site : c'est le ton à généraliser.

**Piste de revenu absente du site :** accompagnement photo d'une journée aux cérémonies, pour voyageurs. Découle directement du positionnement.

---

# Architecture recommandée

Ne pas repartir de zéro : le graphisme n'est pas le problème, et une refonte visuelle serait une fuite. Ce qui doit être refait, c'est **l'architecture et l'ordre des informations**. Le site est organisé comme un portfolio auquel on a ajouté une boutique ; il devrait être organisé comme un atelier qui vend son travail.

```
Accueil
  proposition claire + prix d'entrée + 3 séries + preuve + CTA

Œuvres                       (fusionne Galerie et Boutique)
  ├─ Série · Cérémonies de Bali
  ├─ Série · Portraits
  └─ Série · Ailleurs (New York, La Réunion, Costa Rica)
       └─ Fiche œuvre : image nette · récit daté et situé ·
          formats et prix · édition et restant · papier ·
          certificat · achat · livraison

Le tirage                    (nouvelle page)
  papier · encres · atelier · signature · certificat ·
  emballage · délais · retour

À propos
  photo de Franck · Bali depuis X ans · faits · collections

Journal
  écrits uniquement, chaque article lié à un tirage
  └─ The Lens of Wonder (vlogs, section distincte)

Contact
```

**Réduire le catalogue :** neuf images éparses valent moins que **trois séries de trois**, chacune avec son récit, son édition et sa raison d'exister.

**Nommage :** quatre noms coexistent aujourd'hui (Franck, Franck Vinel, VF Images, The Lens of Wonder). Règle à tenir partout — **VF Images** = marque, **Franck Vinel** = signature d'auteur, **The Lens of Wonder** = pseudonyme social uniquement.

---

# Scores

| Critère | Note | Justification courte |
|---|---|---|
| Direction artistique | 6,5 | Palette et typo justes, appliquées sans hiérarchie |
| Design | 7 | Propre, aéré, au-dessus de la moyenne du secteur |
| Originalité | 4 | Noir + or + serif + héros plein écran = costume standard |
| Branding | 5 | Wordmark et logo acquis, mais 4 noms et aucune idée portée |
| UX | 3,5 | Menu correct, 3 impasses dont 2 sur le chemin principal |
| UI | 6,5 | Composants soignés, micro-labels trop petits |
| Mobile | 5 | Menu mobile apparent ; labels et `100vh` restent des risques |
| Marketing | 3 | Aucune proposition de valeur, aucune capture d'audience |
| Positionnement | 3 | Rare dans les faits, écrit nulle part |
| Copywriting | 4 | Bien écrit mais interchangeable, zéro fait |
| Conversion | 1 | Aucun chemin d'achat fonctionnel |
| SEO | 6 | Métas et alt très bons ; canonicals, page vide, pas de contenu |
| Performance | 6 | Statique + héros WebP ; JPG boutique et 3 familles de fonts |
| Accessibilité | 6 | Skip link et alt riches ; 4 boutons hors clavier |
| Crédibilité | 3 | Aucune preuve, aucune garantie, liens morts visibles |
| Storytelling | 4 | Matière exceptionnelle, récit cassé au 2e clic |
| **Global** | **4,4** | Jugé comme boutique, pas comme portfolio |

---

# À vérifier côté Franck (non mesurable de l'extérieur)

- Core Web Vitals réels : PageSpeed Insights **en mobile** (LCP, INP, CLS) + suivi Search Console
- Rendu et ergonomie du menu mobile sur appareil réel (ouverture/fermeture, zones tactiles ≥ 44 px, toggle FR/EN dans le menu, bouton d'achat sous le pli)
- Présence et validité de `sitemap.xml` et `robots.txt`
- Contenu exact des mentions légales
- Contrastes mesurés des labels en or
- Navigation clavier complète de la lightbox et du panneau produit

---

# Synthèse attendue de Claude Code

**A.** État réel de chaque action ci-dessus (statut + note courte)
**B.** Les 5 premières actions proposées, ratio impact / effort / faisabilité
**C.** Blockers : ce qui dépend de Franck (photos, témoignages, prix theprintspace, décisions D1 et D2), ce qui dépend de tiers
**D.** Roadmap : cette semaine → ce mois → trois mois
