# Handoff — VF Images

Dossier de transfert pour audit/refonte externe, constitué le 3 septembre 2026 sans accès à l'hébergement (Vercel) ni aux comptes tiers (Stripe, Creativehub, Formspree, Umami) — uniquement à partir du code source du dépôt.

## Sommaire

1. [01-stack.md](01-stack.md) — techno, hébergement, CMS, build, où vit chaque contenu
2. [02-arborescence.md](02-arborescence.md) — toutes les pages/routes, URL, rôle, fichier source
3. [03-design-tokens.md](03-design-tokens.md) — couleurs, polices, tailles, espacements, breakpoints réellement utilisés + incohérences
4. [04-composants.md](04-composants.md) — composants réutilisables et doublons
5. [05-contenu.md](05-contenu.md) — textes d'interface (nav, boutons, formulaires, messages, footer, métas)
6. [06-problemes.md](06-problemes.md) — audit technique (a11y, perf, SEO, responsive, liens morts, console) classé par gravité
7. [07-parcours.md](07-parcours.md) — parcours utilisateur clés, étape par étape, avec frictions
8. [`screens/`](screens/) — 1 capture pleine page par page, desktop (1440×900, viewport) et mobile (390×844, viewport) — 15 pages × 2 = 30 fichiers `[page]-desktop.png` / `[page]-mobile.png`
9. [`code/`](code/) — copie des fichiers source des pages et composants clés (HTML, CSS, JS, API serverless, données JSON, config CMS)

## Méthode

Chaque affirmation de ces documents est vérifiable dans le code cité (chemin de fichier + ligne quand pertinent). Rien n'est extrapolé ni deviné — quand une donnée n'a pas pu être vérifiée depuis le code seul (ex. contenu des variables d'environnement Vercel), c'est signalé explicitement plutôt que supposé. Aucune solution n'est proposée : ces documents décrivent l'existant.
