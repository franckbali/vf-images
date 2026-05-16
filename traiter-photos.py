#!/usr/bin/env python3
"""
VF Images — Script de traitement automatique des photos
========================================================
Glissez vos photos dans le dossier "photos-originales/"
Lancez ce script : python3 traiter-photos.py
Les photos optimisées apparaissent dans "images/" — prêtes pour le site.

Aucune configuration requise. Le script gère tout automatiquement.
"""

import os
import sys
import re
import unicodedata
import shutil
from pathlib import Path
from PIL import Image, ImageOps

# ══════════════════════════════════════════
# CONFIGURATION — modifiez selon vos besoins
# ══════════════════════════════════════════

CONFIG = {
    # Dossiers
    "input_dir":  "photos-originales",   # Vos photos brutes ici
    "output_dir": "images",              # Résultat optimisé ici
    "backup_dir": "photos-originales/deja-traites",  # Sauvegarde après traitement

    # Qualité WebP (85 = excellent rapport qualité/poids, 92 = quasi-lossless)
    "webp_quality": 87,

    # Fallback JPG pour navigateurs anciens (qualité légèrement inférieure)
    "jpg_quality": 82,

    # Tailles générées automatiquement (largeur en pixels)
    # Le site utilise srcset pour servir la bonne taille selon l'écran
    "sizes": {
        "small":  640,   # Mobile portrait
        "medium": 1200,  # Tablette / laptop
        "large":  1920,  # Desktop full HD
        "hero":   2400,  # Images hero plein écran
    },

    # Formats acceptés en entrée
    "input_formats": [".jpg", ".jpeg", ".png", ".tif", ".tiff", ".raw", ".arw", ".cr2", ".nef"],

    # Préserver les métadonnées EXIF (False = supprime pour alléger)
    "keep_exif": False,
}

# ══════════════════════════════════════════
# UTILITAIRES
# ══════════════════════════════════════════

def slugify(text):
    """Convertit 'Procession Barong · Bali' en 'procession-barong-bali'"""
    text = unicodedata.normalize('NFD', text)
    text = ''.join(c for c in text if unicodedata.category(c) != 'Mn')
    text = text.lower()
    text = re.sub(r'[·&\s]+', '-', text)
    text = re.sub(r'[^a-z0-9\-]', '', text)
    text = re.sub(r'-+', '-', text).strip('-')
    return text

def format_size(bytes_val):
    """Formate une taille en Ko ou Mo"""
    if bytes_val > 1_000_000:
        return f"{bytes_val/1_000_000:.1f} Mo"
    return f"{bytes_val/1_000:.0f} Ko"

def get_output_name(input_path):
    """Génère le nom de sortie depuis le nom de fichier d'entrée"""
    stem = Path(input_path).stem
    return slugify(stem)

# ══════════════════════════════════════════
# TRAITEMENT PRINCIPAL
# ══════════════════════════════════════════

def process_image(input_path, output_dir, config):
    """
    Traite une image :
    1. Détecte l'orientation EXIF et corrige
    2. Génère 3 tailles WebP + 1 fallback JPG
    3. Optimise la qualité sans perte visible
    """
    input_path = Path(input_path)
    name = get_output_name(input_path)
    out_dir = Path(output_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    print(f"\n  📸 {input_path.name}")
    original_size = input_path.stat().st_size
    print(f"     Original : {format_size(original_size)}")

    try:
        img = Image.open(input_path)

        # Corriger l'orientation EXIF (évite les photos retournées)
        img = ImageOps.exif_transpose(img)

        # Convertir en RGB si nécessaire (PNG avec transparence, CMYK, etc.)
        if img.mode not in ('RGB', 'L'):
            img = img.convert('RGB')

        # Supprimer les métadonnées EXIF si configuré
        if not config['keep_exif']:
            data = list(img.getdata())
            clean_img = Image.new(img.mode, img.size)
            clean_img.putdata(data)
            img = clean_img

        orig_w, orig_h = img.size
        is_portrait = orig_h > orig_w

        generated = []

        # ── Générer chaque taille ──
        for size_name, target_w in config['sizes'].items():
            # Ne pas upscaler : si l'image est plus petite, on saute cette taille
            if orig_w < target_w and size_name != 'small':
                continue

            # Calculer la hauteur proportionnelle
            ratio = target_w / orig_w
            target_h = int(orig_h * ratio)

            resized = img.resize((target_w, target_h), Image.LANCZOS)

            # ── WebP ──
            webp_path = out_dir / f"{name}-{size_name}.webp"
            resized.save(
                webp_path,
                'WEBP',
                quality=config['webp_quality'],
                method=6,        # Compression maximale (plus lent mais meilleur)
                lossless=False
            )
            webp_size = webp_path.stat().st_size
            generated.append(('WebP', size_name, target_w, webp_size, webp_path.name))

        # ── JPG fallback (taille medium uniquement) ──
        ratio = min(config['sizes']['medium'], orig_w) / orig_w
        fb_w = int(orig_w * ratio)
        fb_h = int(orig_h * ratio)
        fallback = img.resize((fb_w, fb_h), Image.LANCZOS)
        jpg_path = out_dir / f"{name}.jpg"
        fallback.save(jpg_path, 'JPEG', quality=config['jpg_quality'], optimize=True, progressive=True)
        jpg_size = jpg_path.stat().st_size
        generated.append(('JPG', 'fallback', fb_w, jpg_size, jpg_path.name))

        # ── Rapport ──
        total_saved = sum(s for _, _, _, s, _ in generated)
        ratio_perc = (1 - total_saved / original_size) * 100 if original_size > 0 else 0

        for fmt, size_name, width, fsize, fname_out in generated:
            print(f"     ✅ {fname_out:<45} {width}px → {format_size(fsize)}")

        print(f"     💾 Original {format_size(original_size)} → plus grosse version {format_size(max(s for _,_,_,s,_ in generated))}")

        return {
            'name': name,
            'original': input_path.name,
            'files': generated,
            'success': True
        }

    except Exception as e:
        print(f"     ❌ Erreur : {e}")
        return {'name': name, 'success': False, 'error': str(e)}

def generate_html_snippet(result):
    """Génère le code HTML srcset à copier-coller dans le site"""
    name = result['name']
    files = result['files']

    webp_files = [(sz, w, fn) for fmt, sz, w, _, fn in files if fmt == 'WebP']
    webp_files.sort(key=lambda x: x[1])  # Trier par largeur

    if not webp_files:
        return ""

    srcset_webp = ", ".join(f"images/{fn} {w}w" for sz, w, fn in webp_files)
    jpg_fallback = f"images/{name}.jpg"

    # Trouver la taille medium pour le src par défaut
    default_src = next((f"images/{fn}" for sz, w, fn in webp_files if sz == 'medium'), f"images/{webp_files[-1][2]}")

    snippet = f'''<!-- {name} -->
<picture>
  <source
    type="image/webp"
    srcset="{srcset_webp}"
    sizes="(max-width: 480px) 100vw, (max-width: 900px) 50vw, 33vw">
  <img
    src="{jpg_fallback}"
    alt="[DESCRIPTION]"
    loading="lazy"
    decoding="async"
    width="{webp_files[-1][1]}"
    height="auto">
</picture>'''
    return snippet

def main():
    config = CONFIG
    input_dir = Path(config['input_dir'])
    output_dir = Path(config['output_dir'])
    backup_dir = Path(config['backup_dir'])

    print("╔════════════════════════════════════════╗")
    print("║  VF Images — Traitement automatique    ║")
    print("╚════════════════════════════════════════╝\n")

    # Créer les dossiers si nécessaire
    input_dir.mkdir(exist_ok=True)
    output_dir.mkdir(exist_ok=True)
    backup_dir.mkdir(parents=True, exist_ok=True)

    # Trouver les images à traiter
    images = []
    for ext in config['input_formats']:
        images.extend(input_dir.glob(f"*{ext}"))
        images.extend(input_dir.glob(f"*{ext.upper()}"))

    # Exclure les images déjà traitées (dans le sous-dossier backup)
    images = [i for i in images if backup_dir not in i.parents and i.parent == input_dir]
    images = sorted(set(images))

    if not images:
        print(f"✋ Aucune image trouvée dans '{input_dir}/'")
        print(f"   Placez vos JPG/RAW dans ce dossier et relancez.")
        print(f"\n   Formats acceptés : {', '.join(config['input_formats'])}")
        return

    # Filtrer les photos déjà traitées (le JPG correspondant existe déjà dans images/)
    new_images = []
    skipped = []
    for img_path in images:
        name = get_output_name(img_path)
        jpg_already = (output_dir / f"{name}.jpg").exists()
        webp_already = list(output_dir.glob(f"{name}-*.webp"))
        if jpg_already or webp_already:
            skipped.append(img_path)
        else:
            new_images.append(img_path)

    if skipped:
        print(f"⏭️  {len(skipped)} photo(s) déjà traitée(s) — ignorée(s) :")
        for s in skipped:
            print(f"   · {s.name}")
        print()

    images = new_images

    if not images:
        print(f"✅ Toutes les photos sont déjà à jour dans '{output_dir}/'")
        print(f"   Ajoutez de nouvelles photos dans '{input_dir}/' pour les traiter.")
        return

    print(f"📂 {len(images)} nouvelle(s) image(s) à traiter\n")

    results = []
    snippets = []

    for img_path in images:
        result = process_image(img_path, output_dir, config)
        results.append(result)

        if result['success']:
            # Déplacer vers backup
            dest = backup_dir / img_path.name
            shutil.move(str(img_path), str(dest))
            print(f"     📦 Original archivé dans {backup_dir}/")

            # Générer le snippet HTML
            snippet = generate_html_snippet(result)
            if snippet:
                snippets.append(snippet)

    # ── Rapport final ──
    success = sum(1 for r in results if r['success'])
    print(f"\n{'═'*50}")
    print(f"✅ {success}/{len(results)} images traitées avec succès")
    print(f"📁 Fichiers optimisés dans : {output_dir}/")

    # ── Sauvegarder les snippets HTML ──
    if snippets:
        snippets_file = Path('html-snippets.txt')
        with open(snippets_file, 'w', encoding='utf-8') as f:
            f.write("═"*60 + "\n")
            f.write("CODE HTML À COPIER DANS VOS PAGES\n")
            f.write("Remplacez [DESCRIPTION] par le texte alternatif\n")
            f.write("═"*60 + "\n\n")
            f.write("\n\n".join(snippets))
        print(f"📋 Code HTML généré dans : {snippets_file}")
        print(f"\n{'─'*50}")
        print("PROCHAINE ÉTAPE : Copiez le dossier 'images/' sur votre")
        print("hébergeur, puis copiez le code HTML de 'html-snippets.txt'")
        print("dans vos pages HTML à la place des balises <img> actuelles.")

if __name__ == '__main__':
    main()
