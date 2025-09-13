#!/bin/bash

# Script de développement pour Simulio
echo "🚀 Démarrage de Simulio en mode développement..."

# Fonction pour vérifier si un port est libre
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        echo "❌ Port $port déjà utilisé. Veuillez le libérer ou changer de port."
        return 1
    fi
    return 0
}

# Vérifier les ports nécessaires
check_port 3306 || exit 1  # MySQL
check_port 3333 || exit 1  # Backend
check_port 8000 || exit 1  # Simulation API
check_port 8080 || exit 1  # Frontend

# Démarrer MySQL avec Docker
echo "🐳 Démarrage de MySQL..."
docker run --name simulio_mysql_dev \
    -e MYSQL_ROOT_PASSWORD=rootpassword \
    -e MYSQL_DATABASE=simulio \
    -e MYSQL_USER=simulio_user \
    -e MYSQL_PASSWORD=simulio_password \
    -p 3306:3306 \
    -d mysql:8.0

# Attendre que MySQL soit prêt
echo "⏳ Attente de MySQL..."
sleep 10

# Démarrer l'API de simulation en arrière-plan
echo "🧮 Démarrage de l'API Simulation..."
cd simulation
python main.py &
SIMULATION_PID=$!
cd ..

# Démarrer le backend en arrière-plan
echo "🔧 Démarrage du Backend..."
cd back-end
npm run dev &
BACKEND_PID=$!
cd ..

# Attendre que les services soient prêts
sleep 5

# Démarrer le frontend
echo "🎨 Démarrage du Frontend..."
cd front-end
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "🎉 Simulio est opérationnel en mode développement !"
echo ""
echo "📱 Frontend : http://localhost:8080"
echo "🔧 Backend : http://localhost:3333"
echo "🧮 Simulation API : http://localhost:8000"
echo ""
echo "💡 Comptes de test :"
echo "   Admin: admin@simulio.com / Admin123!"
echo "   Agent: agent@simulio.com / Agent123!"
echo "   Client: client@simulio.com / Client123!"
echo ""
echo "🛑 Pour arrêter : Ctrl+C ou ./stop-dev.sh"

# Fonction de nettoyage
cleanup() {
    echo ""
    echo "🧹 Nettoyage des processus..."
    kill $FRONTEND_PID 2>/dev/null
    kill $BACKEND_PID 2>/dev/null
    kill $SIMULATION_PID 2>/dev/null

    echo "🐳 Arrêt de MySQL..."
    docker stop simulio_mysql_dev 2>/dev/null
    docker rm simulio_mysql_dev 2>/dev/null

    echo "✅ Nettoyage terminé."
    exit 0
}

# Capturer le signal d'arrêt
trap cleanup SIGINT SIGTERM

# Attendre indéfiniment
wait
