#!/bin/bash

echo "🛑 Arrêt du mode développement Simulio..."

echo "🔪 Arrêt des processus..."
pkill -f "npm run dev" 2>/dev/null
pkill -f "python main.py" 2>/dev/null
pkill -f "vite" 2>/dev/null

sleep 2

echo "🐳 Arrêt de MySQL..."
docker stop simulio_mysql_dev 2>/dev/null
docker rm simulio_mysql_dev 2>/dev/null

echo "🧹 Nettoyage des volumes..."
docker volume prune -f >/dev/null 2>&1

echo "✅ Mode développement arrêté avec succès !"
