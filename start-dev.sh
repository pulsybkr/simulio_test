#!/bin/bash

echo "========================================"
echo "   SIMULIO - Démarrage Développement"
echo "========================================"
echo
echo "Ce script va ouvrir 3 terminaux pour:"
echo "1. API Simulation (Python) - Port 8000"
echo "2. Backend (AdonisJS) - Port 3333"
echo "3. Frontend (Vue.js) - Port 5173"
echo
echo "Assurez-vous que MySQL est démarré !"
echo
read -p "Appuyez sur Entrée pour continuer..."

# Fonction pour détecter le terminal disponible
open_terminal() {
    local title="$1"
    local command="$2"
    
    if command -v gnome-terminal &> /dev/null; then
        gnome-terminal --title="$title" -- bash -c "$command; exec bash"
    elif command -v xterm &> /dev/null; then
        xterm -title "$title" -e bash -c "$command; exec bash" &
    elif command -v konsole &> /dev/null; then
        konsole --title "$title" -e bash -c "$command; exec bash" &
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        osascript -e "tell app \"Terminal\" to do script \"cd $(pwd) && $command\""
    else
        echo "Terminal non détecté. Lancez manuellement:"
        echo "$command"
    fi
}

# Terminal 1 - API Simulation
echo "Ouverture du terminal API Simulation..."
open_terminal "Simulio - API Simulation" "cd simulation && source .venv/bin/activate && python main.py"

sleep 2

# Terminal 2 - Backend
echo "Ouverture du terminal Backend..."
open_terminal "Simulio - Backend API" "cd back-end && npm run dev"

sleep 2

# Terminal 3 - Frontend
echo "Ouverture du terminal Frontend..."
open_terminal "Simulio - Frontend" "cd front-end && npm run dev"

echo
echo "========================================"
echo "Terminaux ouverts ! Accès:"
echo "- Frontend: http://localhost:5173"
echo "- Backend: http://localhost:3333"
echo "- Simulation: http://localhost:8000"
echo "========================================"