#!/bin/bash
SOURCE="$HOME/Desktop/vf-images"
DATE=$(date +%Y-%m-%d)
DEST="/Volumes/pics/vf-images-backup-$DATE"

echo "╔════════════════════════════════════════╗"
echo "║  Sauvegarde complète — VF Images       ║"
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
echo ""

rsync -a --progress "$SOURCE/" "$DEST/"

if [ $? -eq 0 ]; then
    SIZE=$(du -sh "$DEST" 2>/dev/null | cut -f1)
    echo ""
    echo "✅  Sauvegarde terminée avec succès !"
    echo "    Dossier : vf-images-backup-$DATE  ($SIZE)"
else
    echo ""
    echo "❌  Erreur lors de la sauvegarde (code $?)."
fi

echo ""
read -r -p "Appuyez sur Entrée pour fermer..."
