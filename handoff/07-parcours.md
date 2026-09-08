# 07 — Parcours utilisateur

Parcours reconstitués en suivant le code (liens, gestionnaires de clic, appels réseau) — pas d'interprétation, chaque étape est vérifiable dans les fichiers cités. Les frictions sont des constats factuels (ce qui se passe réellement), pas des recommandations.

---

## Parcours 1 — Découverte d'une œuvre en galerie → achat

**Étapes telles que codées :**
1. Le visiteur arrive sur une galerie individuelle (`galerie-bali.html`, `galerie-newyork.html` ou `galerie-portraits.html`), consulte les photos en lightbox.
2. Aucune photo de ces galeries n'a de lien direct vers la boutique. Seuls liens présents vers `boutique.html` : l'item de nav "Boutique" et le lien du footer (2 occurrences par page, identiques sur les 3 galeries — vérifié dans le code).
3. Pour acheter la photo qu'il vient de regarder, le visiteur doit cliquer sur "Boutique" dans la nav, puis **chercher lui-même visuellement** si cette même photo y est vendue, dans la grille de `boutique.html`.
4. En bas de chaque galerie individuelle figure un bandeau de secours : *"Vous avez repéré une photographie qui n'est pas disponible dans la boutique ? Contactez-moi pour étudier sa disponibilité en tirage d'art."* — un lien texte vers `contact.html` (formulaire générique, pas de champ pré-rempli avec la photo concernée). Trouvé dans [`galerie-bali.html:579-581`](../galerie-bali.html), identique sur les 3 galeries.

**Friction relevée :** aucun lien structurel entre "je regarde une photo dans une galerie" et "je peux l'acheter" — les deux parcours (galerie et boutique) sont indépendants dans le code. Rien ne garantit non plus que la photo admirée en galerie soit effectivement en vente (les catalogues galerie et boutique sont deux jeux de données séparés — `galeries.json`/HTML en dur d'un côté, `catalogue.json` de l'autre).

---

## Parcours 2 — Boutique → achat (les 4 tirages connectés à Stripe)

**Étapes telles que codées :**
1. Le visiteur arrive sur `boutique.html`, voit la grille de tirages.
2. Clic sur une vignette → ouverture d'une modale détail (`#detail-portrait`, `#detail-portrait-369`, `#detail-hummingbird`, `#detail-offrandes-002` — les 4 produits reliés à Creativehub via `catalogue.json`).
3. Choix du format (bouton radio parmi les tailles listées dans `catalogue.json`), le prix affiché se met à jour.
4. Clic sur "Commander ce tirage" → `handleCheckout(this)` ([`boutique.html:1662`](../boutique.html)) → `fetch('/api/create-checkout', ...)` → l'API crée une session Stripe Checkout et redirige le navigateur vers la page de paiement hébergée par Stripe (hors du site).
5. Paiement effectué sur Stripe → redirection vers `boutique.html?status=success` ([`api/create-checkout.js:84`](../api/create-checkout.js)).
6. `boutique.html` détecte le paramètre `?status=success` dans l'URL et affiche... une **alerte navigateur native** (`window.alert()`, pas une page ou un bandeau stylisé) : *"✓ Commande confirmée ! Vous allez recevoir un email de confirmation."* ([`boutique.html:1702-1707`](../boutique.html)).
7. En arrière-plan (hors navigateur, pas observable côté client) : le webhook Stripe ([`api/stripe-webhook.js`](../api/stripe-webhook.js)) transmet la commande à l'API Creativehub pour impression et expédition.

**Friction relevée :** l'écran de confirmation post-achat est une `alert()` du navigateur (bloc modal générique du système, hors charte graphique du site) plutôt qu'une page ou un composant du design du site.

---

## Parcours 3 — Boutique → achat (les 5 tirages non connectés)

**Étapes telles que codées :**
1. Même démarrage que le parcours 2 : grille produits sur `boutique.html`.
2. Pour les modales `#detail-sacred-monkey`, `#detail-barong`, `#detail-offrandes` (tirage ouvert, distinct de `#detail-offrandes-002`), `#detail-manhattan`, `#detail-fenetre`, le bouton "Commander ce tirage" est un `<a href="#" target="_blank" class="order-btn">` — un lien qui pointe vers l'ancre vide de la page courante.

**Friction relevée :** pour ces 5 tirages sur 9 affichés en boutique, cliquer "Commander ce tirage" ne déclenche aucune action d'achat (le lien recharge la page sur elle-même). Rien dans l'interface ne distingue visuellement ces 5 boutons de ceux qui fonctionnent (parcours 2) — même libellé, même style.

---

## Parcours 4 — Fiche produit édition limitée (accès direct) → achat

**Étapes telles que codées :**
1. Le visiteur arrive directement sur `/editions/portrait-bali-012` ou `/editions/portrait-bali-369` (lien partagé, résultat de recherche Google — ces pages ont leur propre `<title>`/meta description indexables, voir [05-contenu.md](05-contenu.md)).
2. La page affiche la photo, la localisation, le compteur d'exemplaires restants (`fetch('/api/edition-status')`), le papier, le format, le nom du photographe, la mention de certificat d'authenticité.
3. Un seul lien d'action est présent sur toute la page : `<a href="/boutique.html" class="back-link">← Retour à la boutique</a>` ([`editions/portrait-bali-012.html`](../editions/portrait-bali-012.html), fin de page).

**Friction relevée : aucun bouton d'achat sur cette page.** Le visiteur qui atterrit directement sur une fiche édition limitée (typiquement depuis Google, puisque ces pages sont spécifiquement indexées avec leur propre SEO) ne peut pas acheter depuis là — il doit cliquer "Retour à la boutique", puis retrouver lui-même la bonne photo dans la grille de `boutique.html`, l'ouvrir à nouveau en modale, et choisir le format 100×70cm pour arriver au même produit qu'il consultait déjà.

---

## Parcours 5 — Contact

**Étapes telles que codées :**
1. Le visiteur arrive sur `contact.html`.
2. Il voit 4 boutons "sujet" en pastille (Tirage Fine Art / Commande sur mesure / Collaboration / Autre), avec "Tirage Fine Art" présélectionné.
3. Plus bas dans le formulaire, un second champ "Sujet" existe : un `<select>` avec des libellés différents des pastilles, sur "Choisir un sujet..." par défaut.
4. Il remplit nom, email, message, clique "Envoyer".
5. `submitForm(e)` ([`contact.html:829`](../contact.html)) valide que nom/email/message sont non vides, envoie une requête `fetch` en `POST` vers `https://formspree.io/f/mwvybbrz` avec `new FormData(form)`.
6. Si la requête réussit : le formulaire est masqué, un bloc de succès stylisé apparaît ("Message envoyé — Merci pour votre message...").

**Friction relevée (détail technique dans [06-problemes.md](06-problemes.md)) :** le sujet visuellement choisi par pastille (étape 2) n'est jamais celui transmis à Formspree, puisque ces boutons sont hors du `<form>` et ne modifient pas le `<select>` (étape 3). Franck reçoit le mail sans savoir quel sujet le visiteur pensait avoir choisi.

---

## Parcours 6 — Changement de langue

**Étapes telles que codées :**
1. Sur n'importe laquelle des 12 pages publiques (hors `404.html`, hors `editions/*.html`), clic sur "EN".
2. `setLang('en')` s'exécute : tous les éléments porteurs de `data-fr`/`data-en` changent de texte en place (pas de rechargement de page, pas de changement d'URL). Préférence retenue dans `localStorage` (`vf_lang`), donc conservée à la prochaine visite/page.
3. Sur `editions/portrait-bali-012.html` et `editions/portrait-bali-369.html`, le même geste (bouton unique "EN"/"FR", pas de paire de boutons) déclenche un système de traduction totalement différent (`applyLang()`, voir [04-composants.md](04-composants.md)) — **et cette préférence n'est pas partagée avec le `localStorage` du reste du site** (aucune lecture de la clé `vf_lang` trouvée dans ces 2 fichiers) : un visiteur qui a mis le site en anglais puis arrive sur une fiche édition limitée la retrouve en français par défaut, et vice versa.

**Friction relevée :** la préférence de langue ne suit pas le visiteur entre les pages publiques et les 2 pages `editions/`.
