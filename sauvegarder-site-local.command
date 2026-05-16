#!/bin/bash
SOURCE="$HOME/Desktop/vf-images"
DEST="/Volumes/pics/vf-images-site"

echo "╔════════════════════════════════════════╗"
echo "║  Sauvegarde site — VF Images           ║"
echo "╚════════════════════════════════════════╝"
echo ""

if [ ! -d "/Volumes/pics" ]; then
    echo "❌  Le disque 'pics' n'est pas connecté."
    echo "    Branchez le disque et réessayez."
    echo ""
    read -r -p "Appuyez sur Entrée pour fermer..."
    exit 1
fi

echo "  Source      : $SOURCE"
echo "  Destination : $DEST"
echo "  Exclusions  : photos-originales/, printspace/"
echo ""

rsync -a --progress \
    --exclude="photos-originales/" \
    --exclude="printspace/" \
    --exclude=".git/" \
    --exclude=".DS_Store" \
    --exclude="*.py" \
    --exclude="*.pdf" \
    --exclude="*.bak" \
    --exclude="html-snippets.txt" \
    "$SOURCE/" "$DEST/"

if [ $? -eq 0 ]; then
    SIZE=$(du -sh "$DEST" 2>/dev/null | cut -f1)
    echo ""
    echo "✅  Copie terminée avec succès !"
    echo "    Dossier : vf-images-site  ($SIZE)"
else
    echo ""
    echo "❌  Erreur lors de la copie (code $?)."
fi

echo ""
read -r -p "Appuyez sur Entrée pour fermer..."
