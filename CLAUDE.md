# VF Images — Brief projet pour Claude Code

## Présentation
Site de photographies fine art de Fra (Franck), galerie bilingue FR/EN.
- **Repo GitHub** : `franckbali/vf-images`
- **Site en ligne** : `vfimages.com`
- **Hébergement** : Vercel (déploiement automatique depuis GitHub)
- **Type** : Site HTML statique (pas de framework JS)

---

## Infrastructure en place ✅

- Sveltia CMS accessible sur `vfimages.com/admin`, connecté à GitHub via OAuth
- Script `traiter-photos.py` — optimise les photos (WebP, miniatures, versions medium)
- Raccourci `Lancer-VFImages.command` — lance le script sans Terminal
- Préréglage Lightroom "VF Images Site Web" — exporte dans `photos-originales/`
- Workflow : Lightroom → `photos-originales/` → script → `images/` → git push → Vercel

---

## Structure des galeries

6 galeries configurées dans `galeries.json` (fichier édité par le CMS) :
- Bali
- New York
- Cérémonies
- Voyages
- Portraits
- La Réunion

`galerie-index.html` lit `galeries.json` dynamiquement et génère les vignettes.

---

## Ce qui reste à faire — par priorité

### Priorité 1 — Vérifier CMS ↔ pages individuelles
Les pages individuelles (`galerie-bali.html`, etc.) lisent-elles `galeries.json` ou sont-elles encore statiques ? À confirmer et corriger si besoin.

### Priorité 2 — Photos réelles (urgent)
Les photos actuelles sont des placeholders. Mettre les vraies photos de Fra :
- Hero de `galerie-index.html`
- Covers de chaque collection (Bali, Cérémonies, etc.)
- Heroes des autres pages

### Priorité 3 — Cohérence visuelle
Le hero de `galerie-index.html` n'a pas la même hauteur que celui d'`a-propos.html`. À aligner.

### Priorité 4 — Dossiers Mac
Clarifier le rôle de `photos-originales/` dans le workflow CMS. Vérifier que le préréglage Lightroom pointe au bon endroit.

### Priorité 5 — Tester les sauvegardes
`sauvegarder-vfimages.command` et `sauvegarder-site-local.command` → vérifier qu'ils sauvegardent vers le disque "pics".

### Priorité 6 — Theprintspace
Compte créé mais pas encore intégré. Les liens Theprintspace ne sont pas dans les pages boutique/galeries.

### Priorité 7 — Blog et Boutique
Collections CMS créées mais vides. Aucun article ni produit encore.

---

## Règles de travail

- Ne jamais modifier les fichiers sans montrer le diff d'abord
- Toujours travailler sur `main` sauf si Fra demande une branche séparée
- Le site est statique — pas de build step, les fichiers HTML sont servis directement
- Les images vont dans `images/` (générées par le script), pas dans `photos-originales/`
- Demander confirmation avant toute suppression de fichier

---

## Par où commencer chaque session

Lire `galeries.json` et la structure de `galerie-index.html` en premier pour comprendre l'état actuel, puis demander à Fra quelle priorité traiter.
