# Certificat d'authenticité numérique — spécification

> Décidé le 10 sept. 2026 : **un certificat d'authenticité numérique pour chaque tirage** (ouvert et limité).
> Pas de certificat papier au lancement. Le certificat papier signé à la main reste une option future, éditions limitées uniquement (cf. mémoire `nettoyage-mensonges-passifs` / discussion certificat).
>
> **Ne rien promettre sur le site tant que ce n'est pas en place** (sinon "mensonge passif"). Le site dit déjà "Certificat d'authenticité" sur les formats limités (le certificat Creativehub imprimé actuel) — ne pas étendre cette promesse à tous les formats avant que le numérique fonctionne.

## Dépendances (à faire AVANT)

1. Chaîne de paiement active et testée (§3-5 CLAUDE.md — token Creativehub, env vars Vercel, achat test réel).
2. **Resend** connecté (email de confirmation client — déjà un TODO dans `api/stripe-webhook.js`). Le certificat part dans cet email.
3. **Vercel KV** ajouté au projet (free tier largement suffisant).

## Architecture

Site statique + fonctions serverless sur Vercel. Le webhook Stripe (`api/stripe-webhook.js`) fait déjà foi après paiement — c'est là qu'on génère le certificat.

### 1. Code unique
- Format : `VFC-XXXXXXXX` (préfixe + 8-10 caractères url-safe aléatoires, style nanoid).
- **Non séquentiel / non devinable** (sinon on peut énumérer tous les certificats).
- Généré dans le webhook au moment du `checkout.session.completed`.

### 2. Stockage — Vercel KV
- `cert:{code}` → JSON de l'enregistrement (voir champs ci-dessous). Écrit par le webhook.
- **`edition:{photo_id}:{format_label}` → compteur vendu**, incrémenté **atomiquement** par le webhook (`INCR`) pour attribuer le numéro d'exemplaire d'une édition limitée.
  - ⚠️ Ça déplace `sold_count` de `catalogue.json` (statique, manuel) vers KV. `api/edition-status.js` doit alors lire le compteur depuis KV.
  - **Ce travail = le même que le compteur « X restants »** (§ "Structure/cohérence" CLAUDE.md, bloqué depuis juillet). À faire ensemble.
  - `catalogue.json` garde `limited_edition: 15` (le total, source de vérité) ; seul le *vendu* passe en KV.

### 3. Champs de l'enregistrement certificat
Depuis `session` Stripe + `catalogue.json` :
```
code              VFC-XXXXXXXX
issued_at         session.created (ISO)
photo_id          session.metadata.photo_id
title_fr/title_en catalogue
location_fr/en    catalogue
image             catalogue (chemin miniature)
format_label      session.metadata.format_label  (ex. "100×70")
dimensions_cm     "100 × 70 cm"
paper_fr/paper_en catalogue
edition           "open"  |  "limited"
edition_number    (si limited) N° attribué via INCR KV
edition_total     (si limited) catalogue.limited_edition  (ex. 15)
buyer_name        session.shipping_details.name   (PDF uniquement, PAS sur la page publique)
buyer_email       session.customer_details.email  (jamais affiché)
stripe_session_id (référence interne, jamais affiché)
```

### 4. Page de vérification — `/certificat/[code]` (ou `/api/certificat?code=X`)
- Publique, sans authentification (c'est le but : n'importe qui avec le code vérifie la provenance).
- Rend le certificat depuis `cert:{code}` en KV.
- Code introuvable → page propre "Certificat introuvable".
- **N'affiche PAS** le nom/email de l'acheteur (vie privée). Affiche uniquement les faits vérifiables : œuvre, papier, dimensions, tirage (ouvert / N° X/15), date d'émission, code.
- Design **clair, imprimable** (fond crème/blanc, texte sombre, logo VF Images, Cormorant/Bodoni pour le titre, Raleway pour les données) — doit rendre bien imprimé en A4. Différent du reste du site (fond noir) : un certificat se veut "papier".
- Bouton "Imprimer / Télécharger" → `window.print()` avec une feuille de style print. (Un vrai PDF joint à l'email = phase 2, lib type `@react-pdf/renderer` ou `pdf-lib`.)
- Bilingue FR/EN (même toggle que le site, ou selon `?lang=`).

### 5. Livraison
- Email de confirmation Resend (client + copie Fra) : lien vers `/certificat/[code]` + (phase 2) PDF joint.
- Encart dans le colis : Creativehub peut insérer une carte avec **QR code → `/certificat/[code]`** (encart statique, à configurer côté Creativehub — vérifier s'ils le facturent).

## Contenu / formulation (garde-fous honnêteté)

- Le tirage : **« signature reproduite »** — jamais « signé à la main ».
- Le certificat numérique : porte le nom + la signature reproduite de l'artiste, **présenté comme un document** (ne prétend pas être un tirage signé main).
- Éditions limitées : « exemplaire N° X / 15 » — le numéro vient de l'INCR KV, doit être fiable.
- Si un jour certificat papier signé (limitées) : là on peut dire « certificat signé à la main par l'artiste ».

## Textes site à mettre à jour (au moment du déploiement, pas avant)

- **`boutique.html`** — fiche produit près du choix de format :
  - format ouvert : « Tirage numéroté · Certificat d'authenticité numérique »
  - format limité : « Édition limitée à N · Certificat numérique vérifiable » (+ « signé à la main » si/quand le papier existe)
  - bandeau qualité (`.quality-strip`) : la ligne « Certificat d'authenticité » devient vraie pour tous les formats.
- **`mentions-legales.html`** — section CGV « Produits » : préciser « certificat d'authenticité numérique, accessible en ligne via un lien unique et permanent » au lieu du vague « accompagné d'un certificat d'authenticité ». (FR + EN — la page est bilingue depuis le commit `22c2426`.)
- Optionnel : une courte section « Le certificat » sur la fiche produit ou une FAQ.

## Étapes de build (quand les dépendances sont prêtes)

1. Ajouter Vercel KV, migrer `sold_count` → KV, adapter `api/edition-status.js`.
2. Dans `api/stripe-webhook.js` (branche `checkout.session.completed`, après la commande Creativehub réussie) : générer le code, INCR l'édition si limitée, écrire `cert:{code}`.
3. Créer `api/certificat.js` (+ `vercel.json` rewrite `/certificat/:code` → `/api/certificat?code=:code`).
4. Brancher Resend : email confirmation avec le lien certificat.
5. Déployer les textes site.
6. (Phase 2) PDF joint à l'email, encart QR Creativehub.
