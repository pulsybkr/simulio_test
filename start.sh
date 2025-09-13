#!/bin/bash

# Script de lancement pour Simulio
echo "🚀 Démarrage de Simulio..."

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Vérifier si Docker Compose est installé
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Fonction pour attendre qu'un service soit prêt
wait_for_service() {
    local service_name=$1
    local url=$2
    local max_attempts=30
    local attempt=1

    echo "⏳ Attente du service $service_name..."

    while [ $attempt -le $max_attempts ]; do
        if curl -s "$url" > /dev/null 2>&1; then
            echo "✅ Service $service_name prêt !"
            return 0
        fi

        echo "⏳ Tentative $attempt/$max_attempts pour $service_name..."
        sleep 2
        ((attempt++))
    done

    echo "❌ Timeout: Service $service_name non disponible après $max_attempts tentatives"
    return 1
}

# Lancer les services
echo "🐳 Démarrage des conteneurs Docker..."
docker-compose up -d

# Attendre que MySQL soit prêt
wait_for_service "MySQL" "http://localhost:3306" || exit 1

# Attendre que l'API de simulation soit prête
wait_for_service "Simulation API" "http://localhost:8000/health" || exit 1

# Attendre que le backend soit prêt
wait_for_service "Backend API" "http://localhost:3333/health" || exit 1

echo ""
echo "🎉 Simulio est maintenant opérationnel !"
echo ""
echo "📱 Application : http://localhost:8080"
echo "🔧 API Backend : http://localhost:3333"
echo "🧮 API Simulation : http://localhost:8000"
echo "🗄️ phpMyAdmin : http://localhost:8081"
echo ""
echo "💡 Premier utilisateur admin :"
echo "   Email: admin@simulio.com"
echo "   Mot de passe: Admin123!"
echo ""
echo "📖 Consultez le README.md pour plus d'informations"
