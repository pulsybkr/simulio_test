@echo off
echo ========================================
echo    SIMULIO - Installation Initiale
echo ========================================
echo.
echo Ce script va installer les dependances pour:
echo 1. API Simulation (Python)
echo 2. Backend (AdonisJS)
echo 3. Frontend (Vue.js)
echo.
pause

echo.
echo [1/3] Installation API Simulation (Python)...
cd simulation
python -m venv .venv
call .venv\Scripts\activate
pip install -r requirements.txt
cd ..

echo.
echo [2/3] Installation Backend (AdonisJS)...
cd back-end
npm install
if not exist .env copy env.example .env
cd ..

echo.
echo [3/3] Installation Frontend (Vue.js)...
cd front-end
npm install
if not exist .env copy env.example .env
cd ..

echo.
echo ========================================
echo Installation terminee !
echo.
echo Prochaines etapes:
echo 1. Configurez MySQL et creez la base 'simulio'
echo 2. Editez back-end\.env avec vos parametres MySQL
echo 3. Editez front-end\.env (VITE_API_URL=http://localhost:3333)
echo 4. Lancez: start-dev.bat
echo ========================================
pause
