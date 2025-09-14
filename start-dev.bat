@echo off
echo ========================================
echo    SIMULIO - Demarrage Developpement
echo ========================================
echo.
echo Ce script va ouvrir 3 terminaux pour:
echo 1. API Simulation (Python) - Port 8000
echo 2. Backend (AdonisJS) - Port 3333  
echo 3. Frontend (Vue.js) - Port 5173
echo.
echo Assurez-vous que MySQL est demarré !
echo.
pause

REM Terminal 1 - API Simulation
start "Simulio - API Simulation" cmd /k "cd simulation && .venv\Scripts\activate && python main.py"

REM Attendre un peu
timeout /t 2 /nobreak > nul

REM Terminal 2 - Backend
start "Simulio - Backend API" cmd /k "cd back-end && npm run dev"

REM Attendre un peu
timeout /t 2 /nobreak > nul

REM Terminal 3 - Frontend
start "Simulio - Frontend" cmd /k "cd front-end && npm run dev"

echo.
echo ========================================
echo Terminaux ouverts ! Acces:
echo - Frontend: http://localhost:5173
echo - Backend: http://localhost:3333
echo - Simulation: http://localhost:8000
echo ========================================
