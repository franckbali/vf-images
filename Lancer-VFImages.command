#!/bin/bash

# ══════════════════════════════════════════
# VF Images — Traitement & Mise en ligne
# Double-clique pour lancer
# ══════════════════════════════════════════

cd ~/Desktop/vf-images

echo ""
echo "╔════════════════════════════════════╗"
echo "║        VF Images — Workflow        ║"
echo "╚════════════════════════════════════╝"
echo ""

# Vérifier que le dossier photos-originales existe et contient des photos
NB_PHOTOS=$(ls photos-originales/*.jpg photos-originales/*.jpeg photos-originales/*.png 2>/dev/null | wc -l | tr -d ' ')

if [ "$NB_PHOTOS" -eq "0" ]; then
    echo "⚠️  Aucune photo trouvée dans photos-originales/"
    echo ""
    echo "→ Exporte tes photos depuis Lightroom d'abord"
    echo "  (préréglage VF Images — Site Web)"
    echo ""
    read -p "Appuie sur Entrée pour fermer..."
    exit 0
fi

echo "📷 $NB_PHOTOS photo(s) trouvée(s) dans photos-originales/"
echo ""
echo "⏳ Optimisation en cours..."
echo ""

# Lancer le script Python
python3 traiter-photos.py

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Demander si on veut mettre en ligne
read -p "✅ Traitement terminé ! Mettre en ligne maintenant ? (o/n) : " REPONSE

if [ "$REPONSE" = "o" ] || [ "$REPONSE" = "O" ]; then
    echo ""
    echo "🚀 Envoi sur le site..."
    git add -A
    git commit -m "Ajout de $NB_PHOTOS photo(s)"
    git push
    echo ""
    echo "🌐 En ligne dans 2 minutes sur ton site !"
else
    echo ""
    echo "👍 Photos optimisées et prêtes dans images/"
    echo "   Lance ce fichier à nouveau pour mettre en ligne."
fi

echo ""
read -p "Appuie sur Entrée pour fermer..."
