╔══════════════════════════════════════════════════════════════╗
║          VF Images — Guide ajout de photos                   ║
╚══════════════════════════════════════════════════════════════╝

WORKFLOW EN 3 ÉTAPES (5 minutes par photo)
──────────────────────────────────────────

1. DÉPOSER
   Placez votre JPG (export Lightroom ou direct appareil)
   dans le dossier : photos-originales/

   Le nom du fichier devient le nom de l'image sur le site.
   Exemples de bons noms :
     ✅ Procession Barong Ubud.jpg
     ✅ Coucher de soleil Seminyak.jpg
     ✅ Manhattan depuis Brooklyn.jpg
     ❌ IMG_4821.jpg  (trop générique)
     ❌ DSC_0042.jpg  (inutilisable)

2. TRAITER (automatique)
   Ouvrez un terminal dans ce dossier et lancez :
   
     python3 traiter-photos.py
   
   Le script génère automatiquement :
     • 3 tailles WebP (640px, 1200px, 1920px)
     • 1 JPG fallback pour anciens navigateurs
     • Un fichier html-snippets.txt avec le code HTML prêt

3. INTÉGRER
   - Copiez le dossier images/ sur votre hébergeur
   - Ouvrez html-snippets.txt
   - Copiez le bloc <img> correspondant dans votre page HTML
   - Remplacez [DESCRIPTION] par un texte descriptif court

STRUCTURE DES FICHIERS GÉNÉRÉS
───────────────────────────────
Pour "Procession Barong Ubud.jpg" :

  images/
    procession-barong-ubud-small.webp   (640px  — mobile)
    procession-barong-ubud-medium.webp  (1200px — tablette)
    procession-barong-ubud-large.webp   (1920px — desktop)
    procession-barong-ubud.jpg          (fallback)

IMAGES HERO (backgrounds CSS)
──────────────────────────────
Les fonds d'écran pleine page utilisent des fichiers nommés :
  images/hero-bali.webp       → homepage
  images/hero-apropos.webp    → page À propos
  images/hero-blog.webp       → page Blog
  images/hero-galerie.webp    → page Galerie index
  images/hero-newyork.webp    → page Galerie New York
  images/hero-contact.webp    → page Contact
  images/cta-bali.webp        → section CTA homepage

Pour ces images : exportez en 2400px de large minimum.
Le script les traitera comme les autres.
