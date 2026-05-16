# Mon workflow — VF Images

Guide pratique pour gérer le site au quotidien, sans toucher au code.

---

## Vue d'ensemble

Le site fonctionne avec trois outils simples :

- **Lightroom** — pour retoucher et exporter les photos
- **Lancer-VFImages.command** — pour optimiser les photos et les mettre en ligne
- **L'interface admin** — pour gérer les galeries et les textes

---

## 1. Ajouter des photos sur le site

### Étape 1 — Exporter depuis Lightroom

Dans Lightroom, sélectionne les photos à publier et exporte-les avec le préréglage **"VF Images — Site Web"**.

Ce préréglage exporte en JPG, dans le dossier `photos-originales/` du projet.

> **Conseil pour les noms de fichiers :** donne un vrai nom à tes photos avant d'exporter, c'est ce nom qui sera utilisé partout sur le site.
>
> - ✅ `Procession Barong Ubud.jpg`
> - ✅ `Coucher de soleil Seminyak.jpg`
> - ❌ `IMG_4821.jpg` (inutilisable)

### Étape 2 — Lancer le traitement

Double-clique sur **`Lancer-VFImages.command`** sur le Bureau.

Le script vérifie qu'il y a des photos à traiter, puis génère automatiquement :
- 4 versions WebP (mobile, tablette, desktop, hero)
- 1 JPG de secours pour les anciens navigateurs
- Une nouvelle entrée dans `galeries.json` si la galerie n'existait pas encore

À la fin, il te demande :

```
Mettre en ligne maintenant ? (o/n)
```

Tape `o` pour publier, `n` pour attendre.

### Ce qui se passe ensuite

Les photos apparaissent sur le site dans les 2 minutes (Vercel redéploie automatiquement).

Les nouvelles galeries sont créées avec **`visible: false`** — elles n'apparaissent pas encore sur le site. Il faut les activer manuellement depuis l'admin (voir section 3).

---

## 2. Images hero (fonds d'écran pleine page)

Certaines photos servent de fond d'écran sur les grandes pages du site. Elles ont des noms spéciaux :

| Nom du fichier exporté | Page concernée |
|---|---|
| `hero-bali.jpg` | Page d'accueil |
| `hero-galerie.jpg` | Index des galeries |
| `hero-newyork.jpg` | Galerie New York |
| `hero-apropos.jpg` | Page À propos |
| `hero-contact.jpg` | Page Contact |
| `hero-blog.jpg` | Page Blog |
| `cta-bali.jpg` | Section d'appel à l'action (accueil) |

Pour ces images, exporte en **2400px de large minimum** depuis Lightroom. Le script les traite comme les autres.

---

## 3. Gérer les contenus depuis l'admin

L'interface d'administration permet de modifier le site sans toucher au code.

**Accès :** ouvre [vfimages.com/admin](https://vfimages.com/admin) dans le navigateur.

---

### 3a. Photos de la page d'accueil (section "Accueil")

Depuis l'admin → **Accueil**, tu peux modifier sans toucher au code :

| Zone | Ce que tu peux changer |
|---|---|
| **Portfolio** (grille de 12 photos) | Ajouter, supprimer, réordonner des photos ; modifier la légende ; masquer une photo (`Visible` → false) |
| **Photo À propos** | Remplacer la photo portrait de la section "Un regard sur le monde" |
| **Photo de fond CTA** | Remplacer le fond de la section boutique en bas de page |

**Workflow type pour changer une photo du portfolio :**

1. Traiter la nouvelle photo avec `Lancer-VFImages.command` (elle atterrit dans `images/`)
2. Aller dans l'admin → **Accueil**
3. Dans la liste Portfolio, modifier l'entrée souhaitée (ou en ajouter une nouvelle)
4. Sélectionner le fichier image dans le sélecteur
5. Mettre à jour la légende si besoin
6. Cliquer **Publier** — le site se met à jour en 2 minutes

> Pour masquer une photo sans la supprimer, passe simplement `Visible` sur **false**.

---

### 3b. Gérer les galeries

### Ce que tu peux faire depuis l'admin → Galeries

- **Activer une galerie** : passe `Visible` de false à true pour qu'elle apparaisse sur le site
- **Modifier le titre ou le sous-titre** d'une galerie
- **Changer l'image de couverture** (l'image qui s'affiche dans la liste des galeries)
- **Changer l'orientation** : `portrait` ou `landscape` selon le format dominant des photos
- **Réordonner les galeries** en modifiant le champ `Ordre`

### Workflow type pour une nouvelle galerie

1. Traiter les photos avec `Lancer-VFImages.command`
2. Aller dans l'admin → **Galeries**
3. Trouver la nouvelle galerie (visible: false)
4. Corriger le titre si besoin (il est généré automatiquement depuis le nom de fichier)
5. Ajouter un sous-titre
6. Choisir la bonne image de couverture
7. Passer `Visible` sur **true**
8. Cliquer **Publier** — le site se met à jour en 2 minutes

---

## 4. Les 3 raccourcis sur le Bureau

### `Lancer-VFImages.command`
**Le raccourci principal.** À utiliser après chaque export Lightroom.
- Optimise les photos
- Met à jour `galeries.json`
- Propose de mettre en ligne

### `sauvegarder-vfimages.command`
**Sauvegarde complète du projet** vers le disque externe `pics`.
- Crée un dossier daté : `vf-images-backup-2026-05-16`
- Copie absolument tout (photos originales incluses)
- À faire avant de modifier des choses importantes, ou une fois par semaine

### `sauvegarder-site-local.command`
**Sauvegarde rapide des fichiers du site** (sans les photos originales).
- Copie les HTML, CSS, images optimisées, JSON…
- N'écrase que le dossier `vf-images-site` sur le disque `pics`
- Plus rapide, utile après chaque session de travail

> Les deux scripts vérifient que le disque `pics` est bien branché avant de commencer.

---

## 5. Préréglages Lightroom recommandés

| Préréglage | Usage |
|---|---|
| **VF Images — Site Web** | Export standard pour toutes les photos du site (JPG, vers `photos-originales/`) |

Pour les images hero, utilise le même préréglage mais en réglant la taille à **2400px** côté long.

---

## 6. En cas de problème

**Le script dit "aucune photo trouvée"**
→ Vérifie que les photos sont bien dans `photos-originales/` et qu'elles ont une extension `.jpg`, `.jpeg` ou `.png`.

**La photo existe déjà dans `images/` et n'est pas retraitée**
→ Normal : le script ne retraite pas les photos déjà optimisées. Si tu veux forcer, supprime les fichiers correspondants dans `images/` et relance.

**Le git push échoue**
→ Vérifie ta connexion internet. Tu peux relancer `Lancer-VFImages.command`, le script reposera la question de mise en ligne.

**La galerie n'apparaît pas sur le site**
→ Vérifie dans l'admin → Galeries que `Visible` est bien sur **true** et que tu as cliqué **Publier**.

**Une photo de l'accueil n'a pas changé après publication**
→ Vérifie dans l'admin → Accueil que le bon fichier est sélectionné et que `Visible` est sur **true**. Pense à vider le cache du navigateur (Cmd+Shift+R).

---

*Dernière mise à jour : mai 2026*
