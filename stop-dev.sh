#!/bin/bash

# Script d'arrêt du mode développement Simulio
echo "🛑 Arrêt du mode développement Simulio..."

# Tuer les processus Node.js et Python
echo "🔪 Arrêt des processus..."
pkill -f "npm run dev" 2>/dev/null
pkill -f "python main.py" 2>/dev/null
pkill -f "vite" 2>/dev/null

# Attendre un peu
sleep 2

# Arrêter et supprimer le conteneur MySQL
echo "🐳 Arrêt de MySQL..."
docker stop simulio_mysql_dev 2>/dev/null
docker rm simulio_mysql_dev 2>/dev/null

# Nettoyer les volumes Docker orphelins (optionnel)
echo "🧹 Nettoyage des volumes..."
docker volume prune -f >/dev/null 2>&1

echo "✅ Mode développement arrêté avec succès !"
