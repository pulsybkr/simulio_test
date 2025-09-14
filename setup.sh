#!/bin/bash

echo "========================================"
echo "   SIMULIO - Installation Initiale"
echo "========================================"
echo
echo "Ce script va installer les dépendances pour:"
echo "1. API Simulation (Python)"
echo "2. Backend (AdonisJS)"
echo "3. Frontend (Vue.js)"
echo
read -p "Appuyez sur Entrée pour continuer..."

echo
echo "[1/3] Installation API Simulation (Python)..."
cd simulation
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cd ..

echo
echo "[2/3] Installation Backend (AdonisJS)..."
cd back-end
npm install
if [ ! -f .env ]; then
    cp env.example .env
fi
cd ..

echo
echo "[3/3] Installation Frontend (Vue.js)..."
cd front-end
npm install
if [ ! -f .env ]; then
    cp env.example .env
fi
cd ..

echo
echo "========================================"
echo "Installation terminée !"
echo
echo "Prochaines étapes:"
echo "1. Configurez MySQL et créez la base 'simulio'"
echo "2. Éditez back-end/.env avec vos paramètres MySQL"
echo "3. Éditez front-end/.env (VITE_API_URL=http://localhost:3333)"
echo "4. Lancez: ./start-dev.sh"
echo "========================================"
